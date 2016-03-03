const Helpers = require('utils/helpers');
const ConditionalNode = require('models/conditionals/conditionalNode');


const ConditionalNodeView = Marionette.CompositeView.extend({

    template: require('templates/builder/pageDetails/pageConditions/conditionalNodeView'),
    childViewContainer: 'div.children-nodes',

    className: function() {
        return 'node' + ' ' +
               (this.model.isCriteriaNode() ? 'criteria' : 'logical') + ' ' +
               (this.model.isRootNode() ? 'root' : '');
    },

    initialize: function() {
        this.parentNodeView = null;
        this.collection = this.model.childrenNodes;
    },

    onAddChild: function(childView) {
        childView.parentNodeView = this;
    },

    templateHelpers: function() {
        let isLogicAll = (this.model.get('node_type') === 'AND' && !this.model.get('isNegated')) ||
                         (this.model.get('node_type') === 'OR' && this.model.get('isNegated'));

        return {
            cid: this.model.cid,
            isLogicAll: isLogicAll,
            isCriteria: this.model.isCriteriaNode(),
            operandElements: this.model.getOperandElements(),

            canAdd: this.model.canAdd(),
            canDelete: this.model.canDelete(),
            canExpand: this.model.canExpand(),
            canContract: this.model.canContract(),
        };
    },

    ui: function() {
        let cid = this.model.cid;
        if (this.model.isCriteriaNode()) {
            return {
                'criteriaNegation': 'select.negation' + '[data-cid=' + cid + ']',
                'criteriaElement': 'select.operand-element' + '[data-cid=' + cid + ']',
                'criteriaComparator': 'select.comparator' + '[data-cid=' + cid + ']',
                'criteriaValue': 'input.value' + '[data-cid=' + cid + ']',

                'addButton': 'span.glyphicon.add' + '[data-cid=' + cid + ']',
                'deleteButton': 'span.glyphicon.delete' + '[data-cid=' + cid + ']',
                'expandButton': 'span.glyphicon.expand' + '[data-cid=' + cid + ']',
            };
        } else {
            return {
                'logicalConnective': 'select.logical-connective' + '[data-cid=' + cid + ']',
                'logicalNegation': 'select.negation' + '[data-cid=' + cid + ']',

                'addButton': 'span.glyphicon.add' + '[data-cid=' + cid + ']',
                'deleteButton': 'span.glyphicon.delete' + '[data-cid=' + cid + ']',
                'contractButton': 'span.glyphicon.contract' + '[data-cid=' + cid + ']',
            };
        }
    },

    events: function() {
        if (this.model.isCriteriaNode()) {
            return {
                'change @ui.criteriaNegation': '_onCriteriaNegationChanged',
                'change @ui.criteriaElement': '_onCriteriaElementChanged',
                'change @ui.criteriaComparator': '_onCriteriaComparatorChanged',
                'keyup @ui.criteriaValue': '_onCriteriaValueChanged',

                'click @ui.addButton': '_onAddCriteria',
                'click @ui.deleteButton': '_onDeleteNode',
                'click @ui.expandButton': '_onExpandCriteria',
            };
        } else {
            return {
                'change @ui.logicalConnective': '_onLogicalFormChanged',
                'change @ui.logicalNegation': '_onLogicalFormChanged',

                'click @ui.addButton': '_onAddCriteria',
                'click @ui.deleteButton': '_onDeleteNode',
                'click @ui.contractButton': '_onContractLogic',
            };
        }
    },

    onRender: function() {
        let formContainerSelector;

        if (this.model.isCriteriaNode()) {
            formContainerSelector = 'div.criteria-form';
        } else {
            formContainerSelector = 'div.logical-form';
        }

        this.$el.children(formContainerSelector).find('select').selectpicker({
            showTick: false,
            width: 'auto',
        });
    },

    //--------------------------------------------------------------------------
    // Common node event handlers
    //--------------------------------------------------------------------------

    _onDeleteNode: function(event) {
        if (!this.model.canDelete()) {
            return;
        }

        this.model.delete();

        if (!this.model.isRootNode()) {
            this.parentNodeView.render();
        }
    },

    //--------------------------------------------------------------------------
    // Criteria Node
    //--------------------------------------------------------------------------

    _onCriteriaNegationChanged: function(event) {
        let isNegated = (this.ui.criteriaNegation.val() === 'negated');
        this.model.set('isNegated', isNegated);
        this.model.saveRootShowIf();
    },

    _onCriteriaComparatorChanged: function(event) {
        let operand = this.ui.criteriaComparator.val();
        this.model.set('node_type', operand);
        this.model.saveRootShowIf();
    },

    _onCriteriaElementChanged: function(event) {
        let operandElement = parseInt(this.ui.criteriaElement.val());
        this.model.set('criteria_element', operandElement);
        this.model.saveRootShowIf();
    },

    _onCriteriaValueChanged: function(event) {
        let value = this.ui.criteriaValue.val();
        this.model.set('value', value);
        this.model.saveRootShowIf();
    },

    _onAddCriteria: function(event) {
        if (!this.model.canAdd()) {
            return;
        }

        this.model.createNewNeighborNode();
        this.parentNodeView.render(); // Don't need to check for root since only non-root nodes can add neighbors
    },

    _onExpandCriteria: function(event) {
        if (!this.model.canExpand()) {
            return;
        }

        this.model.expand();

        if (this.model.isRootNode()) {
            this.render();
        } else {
            this.parentNodeView.render();
        }
    },

    //--------------------------------------------------------------------------
    // Logical Node
    //--------------------------------------------------------------------------

    _onLogicalFormChanged: function(event) {
        // ALL TRUE  = a ^ b
        //           = AND
        //
        // ANY TRUE = a v b
        //          = OR
        //
        // ALL FALSE = !a ^ !b
        //           = !(a v b)
        //           = NOT OR
        //
        // ANY FALSE = !a v !b
        //           = !(a ^ b)
        //           = NOT AND

        let isAll = this.ui.logicalConnective.val() === 'ALL';
        let isNegated = (this.ui.logicalNegation.val() === 'negated');
        let nodeType;

        if (isAll && isNegated) {
            nodeType = 'OR';
        } else if (isAll && !isNegated) {
            nodeType = 'AND';
        } else if (!isAll && isNegated) {
            nodeType = 'AND';
        } else if (!isAll && !isNegated) {
            nodeType = 'OR';
        } else {
            throw new ReferenceError('Unknown logicalConnective', logicalConnective, isNegated);
        }

        this.model.set({
            node_type: nodeType,
            isNegated: isNegated
        });

        this.model.saveRootShowIf();
    },

    _onContractLogic: function(event) {
        if (!this.model.canContract()) {
            return;
        }

        this.model.contract();

        if (this.model.isRootNode()) {
            this.render();
        } else {
            this.parentNodeView.render();
        }
    },

});

module.exports = ConditionalNodeView;
