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
        this.parentConditionalNode = options.parentConditionalNode;
        this.rootShowIf = options.rootShowIf;
        this.childrenNodes = new ConditionalNodes(null, {
            model: ConditionalNode, // To avoid circular dependencies inside the collection
            parentConditionalNode: this,
            rootShowIf: options.rootShowIf,
        });

        this.saveRootShowIf = _.debounce(function() {
            this._saveRootShowIf();
        }, Config.INPUT_DELAY_BEFORE_SAVE);

        options.parse = true;
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    reset: function(attributes) {
        this.clear({ silent: true });
        this.set(this.parse(attributes));
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
            throw ReferenceError('Unknonwn conditional node type', nodeType);
        }
    },

    getDepth: function() {
        return (!this.parentConditionalNode) ? 0 : this.parentConditionalNode.getDepth() + 1;
    },

    _saveRootShowIf: function(callback) {
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
    // Actions
    //--------------------------------------------------------------------------

    createNewNeighborNode: function() {
        let neighborNode = new ConditionalNode(null, {
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
    // Criteria Node
    //--------------------------------------------------------------------------

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
