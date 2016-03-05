const Config = require('utils/config');
const ConditionalNodes = require('collections/conditionals/conditionalNodes');


const CRITERIA_NODE_TYPES = [
    'EQUALS',
    'GREATER',
    'LESS',
];
const LOGICAL_NODE_TYPES = [
    'AND',
    'OR',
    'NOT',
];


const ConditionalNode = Backbone.Model.extend({

    defaults: {
        isNegated: false,
        node_type: 'EQUALS',
        criteria_element: -1,
        value: '',
    },

    url: function() {
        throw new ReferenceError('ConditionalNode should not be manually saved to server!');
    },

    constructor: function(attributes, options = {}) {
        this.parentPage = options.parentPage;
        delete options.parentPage;

        this.parentConditionalNode = options.parentConditionalNode;
        delete options.parentConditionalNode;

        this.rootShowIf = options.rootShowIf;
        delete options.rootShowIf;

        this.childrenNodes = new ConditionalNodes(null, {
            model: ConditionalNode, // To avoid circular dependencies inside the collection
            parentPage: this.parentPage,
            parentConditionalNode: this,
            rootShowIf: this.rootShowIf,
        });

        this._debounceSave = _.debounce(function() {
            this._saveRootShowIf();
        }, Config.INPUT_DELAY_BEFORE_SAVE);

        options.parse = true;
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    initialize: function() {
        this.on('destroy', function(self, collection, options) {
            // Unregister elementId from parentPage's dependency cache
            let elementId = self.get('criteria_element');
            self.parentPage.dependentElementsToPage.delete(elementId);

            console.log('onDestroy', self.parentPage.dependentElementsToPage);
        });

        this.on('change:criteria_element', function(self, criteriaElementId, options) {
            let previousElementId = self.previous('criteria_element');

            // Check if previousElementId exists (initially -1)
            if (previousElementId > 0) {
                // Unregister previous criteriaElementId from parentPage's dependency cache
                let previousDependentPage = self.parentPage.dependentElementsToPage.get(previousElementId);
                self.parentPage.dependentElementsToPage.delete(previousElementId);
                previousDependentPage.trigger('change:depended-upon', previousDependentPage);
            }

            // Check if criteriaElementId is being set (property is undefined when calling unset)
            if (criteriaElementId) {
                // Register new criteriaElementId to parentPage's dependency cache
                let dependentPage = self.parentPage.collection.get(options.operandElementPage);
                self.parentPage.dependentElementsToPage.set(criteriaElementId, dependentPage);
                dependentPage.trigger('change:depended-upon', dependentPage);
            }

            console.log('onChange', self.parentPage.dependentElementsToPage);
        });
    },

    reset: function(attributes, options) {
        this.clear(options);
        this.set(this.parse(attributes), options);
    },

    parse: function(response, options) {
        let originalResponse = response;
        let nodeType = response.node_type;
        let isNegated = false;

        // Go down tree until we hit a non-NOT node
        while (nodeType === 'NOT') {
            if (response.children.length != 1) {
                throw new RangeError('NOT node should only have 1 child!', originalResponse);
            }

            response = response.children[0];
            response.isNegated = (isNegated = !isNegated); // Toggle isNegated and set it

            nodeType = response.node_type;
        }

        this.childrenNodes.reset(response.children, { silent: true });
        delete response.children;

        return response;
    },

    toJSON: function(options = {}) {
        let json = {};
        json.node_type = this.get('node_type');

        if (this.isCriteriaNode()) {
            json.criteria_element = this.get('criteria_element');
            json.value = this.get('value') || '';
        } else {
            json.children = this.childrenNodes.toJSON(options);
        }

        if (options.seralizeToShowIf) {
            if (this.get('isNegated')) {
                json = {
                    node_type: 'NOT',
                    children: [ json ],
                };
            }
        } else {
            json.isNegated = this.get('isNegated');
        }

        return json;
    },

    isRootNode: function() {
        return !this.parentConditionalNode;
    },

    isCriteriaNode: function() {
        let nodeType = this.get('node_type');
        if (CRITERIA_NODE_TYPES.includes(nodeType)) {
            return true;
        } else if (LOGICAL_NODE_TYPES.includes(nodeType)) {
            return false;
        } else {
            throw ReferenceError('Unknown conditional node type', nodeType);
        }
    },

    getPossibleOperandElements: function() {
        return this.rootShowIf.collection.parentPage.getPossibleOperandElements();
    },

    getDepth: function() {
        return (!this.parentConditionalNode) ? 0 : this.parentConditionalNode.getDepth() + 1;
    },

    getDependentElements: function() {
        let dependents = [];

        if (this.isCriteriaNode()) {
            let elementId = this.get('criteria_element');
            if (elementId > 0) {
                dependents.push(elementId);
            }
        } else {
            this.childrenNodes.each(function(child) {
                dependents = dependents.concat(child.getDependentElements());
            });
        }

        return dependents;
    },

    clearDependentElementsAfterPosition: function(position) {
        if (this.isCriteriaNode()) {
            let dependentPage = this.parentPage.dependentElementsToPage.get(this.get('criteria_element'));
            let dependentPageIndex = dependentPage.get('display_index');
            if (dependentPageIndex >= position) {
                // dependentPage appears after this position
                this.unset('criteria_element');
            }
        } else {
            this.childrenNodes.each(function(child) {
                child.clearDependentElementsAfterPosition(position);
            });
        }

        if (this.isRootNode()) {
            // Bypass the debounce since we want the ShowIfItemView to rerender
            // immediately. This is safe because this method is only be triggered
            // after a sort event, which should not happen that frequently
            this._saveRootShowIf();
        }
    },

    clearDependentElementsFromPage: function(pageId) {
        if (this.isCriteriaNode()) {
            let dependentPage = this.parentPage.dependentElementsToPage.get(this.get('criteria_element'));
            if (dependentPage.get('id') === pageId) {
                // pageId contains this element but it got moved after this node's parentPage
                this.unset('criteria_element');
            }
        } else {
            this.childrenNodes.each(function(child) {
                child.clearDependentElementsFromPage(pageId);
            });
        }

        if (this.isRootNode()) {
            this._saveRootShowIf();
        }
    },

    saveRootShowIf: function() {
        this._debounceSave();
    },

    _saveRootShowIf: function() {
        // Should not call this method directly from view callbacks
        // Call saveRootShowIf() instead (without the _) to debounce the save calls
        let self = this;
        this.rootShowIf.save(null, {
            beforeSend: function() {
                console.info('Saving rootShowIf', self.rootShowIf.get('id'));
            },
            success: function() {
                console.info('Saved rootShowIf', self.rootShowIf.get('id'));
            },
            error: function() {
                console.error('Unable to save rootShowIf changes', self.rootShowIf.get('id'));
            },
        });
    },

    //--------------------------------------------------------------------------
    // View events
    //--------------------------------------------------------------------------

    createNewNeighborNode: function() {
        let neighborNode = new ConditionalNode(null, {
            parentPage: this.parentPage,
            parentConditionalNode: this.parentConditionalNode,
            rootShowIf: this.rootShowIf,
        });

        this.collection.push(neighborNode, {
            silent: true,
            at: this.collection.indexOf(this) + 1,
        });

        this.saveRootShowIf();
    },

    delete: function() {
        this.stopListening();

        if (this.parentConditionalNode) {
            // Not root node
            this.parentConditionalNode.childrenNodes.remove(this, { silent: true });
            this.saveRootShowIf();
        } else {
            // Root node
            this.rootShowIf.destroy();
        }
    },

    expand: function() {
        let childNode = new ConditionalNode(this.attributes, {
            parentPage: this.parentPage,
            parentConditionalNode: this,
            rootShowIf: this.rootShowIf,
        });

        this.clear({ silent: true });
        this.set({'node_type': 'AND'}, { silent: true });
        this.childrenNodes.reset([ childNode ], { silent: true });

        this.saveRootShowIf();
    },

    contract: function() {
        let childNode = this.childrenNodes.models[0];

        this.clear({ silent: true });
        this.set(childNode.attributes, { silent: true });
        this.childrenNodes.reset(null, { silent: true });

        this.saveRootShowIf();
    },

    //--------------------------------------------------------------------------
    // Template helpers
    //--------------------------------------------------------------------------

    elementIsDate: function() {
        if (!(this.isCriteriaNode() && this.get('criteria_element') > 0)) {
            return false;
        }

        let dependentPage = this.parentPage.dependentElementsToPage.get(this.get('criteria_element'));
        let dependentElement = dependentPage.elements.get(this.get('criteria_element'));
        return dependentElement.get('element_type') === 'DATE';
    },

    elementIsChoiceBased: function() {
        if (!(this.isCriteriaNode() && this.get('criteria_element') > 0)) {
            return false;
        }

        let dependentPage = this.parentPage.dependentElementsToPage.get(this.get('criteria_element'));
        let dependentElement = dependentPage.elements.get(this.get('criteria_element'));
        return dependentElement.isChoiceBased();
    },

    getElementChoices: function() {
        if (!(this.isCriteriaNode() && this.get('criteria_element') > 0)) {
            return [];
        }

        let dependentPage = this.parentPage.dependentElementsToPage.get(this.get('criteria_element'));
        let dependentElement = dependentPage.elements.get(this.get('criteria_element'));
        return dependentElement.choices.pluck('text');
    },

    canAdd: function() {
        // Only if this node already belongs to a collection (i.e. not root)
        return _.isObject(this.collection);
    },

    canDelete: function() {
         // Not part of a collection (i.e. is root) OR parent collection has more than 1 element
        return !_.isObject(this.collection) ||
               this.collection.length > 1;
    },

    canExpand: function() {
        // Only criteria nodes less than max depth
        return this.isCriteriaNode() &&
               this.getDepth() < Config.MAX_CONDITIONAL_DEPTH;
    },

    canContract: function() {
        // Only logical nodes with 1 criteria child
        return !this.isCriteriaNode() &&
               this.childrenNodes.length === 1 &&
               this.childrenNodes.models[0].isCriteriaNode();
    },

});

module.exports = ConditionalNode;
