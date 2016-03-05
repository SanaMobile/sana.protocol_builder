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
            operandElements: this.model.getPossibleOperandElements(),

            showDateEditorForValue: this.model.elementIsDate(),
            showChoiceEditorForValue: this.model.elementIsChoiceBased() && this.model.get('node_type') === 'EQUALS',
            elementChoices: this.model.getElementChoices(),

            canAdd: this.model.canAdd(),
            canDelete: this.model.canDelete(),
            canExpand: this.model.canExpand(),
            canContract: this.model.canContract(),
        };
    },

    ui: function() {
        let cid = this.model.cid;
        let viewUI = {
            'addButton': 'span.glyphicon.add' + '[data-cid=' + cid + ']',
            'deleteButton': 'span.glyphicon.delete' + '[data-cid=' + cid + ']',
        };

        if (this.model.isCriteriaNode()) {
            _.extend(viewUI, {
                'criteriaNegation': 'select.negation' + '[data-cid=' + cid + ']',
                'criteriaElement': 'select.operand-element' + '[data-cid=' + cid + ']',
                'criteriaComparator': 'select.comparator' + '[data-cid=' + cid + ']',
                'expandButton': 'span.glyphicon.expand' + '[data-cid=' + cid + ']',
            });

            if (this.model.elementIsDate()) {
                _.extend(viewUI, {
                    'criteriaValue': 'input.value.date' + '[data-cid=' + cid + ']',
                });
            } else if (this.model.elementIsChoiceBased()) {
                _.extend(viewUI, {
                    'criteriaValue': 'select.value' + '[data-cid=' + cid + ']',
                });
            } else {
                _.extend(viewUI, {
                    'criteriaValue': 'input.value' + '[data-cid=' + cid + ']',
                });
            }
        } else {
            _.extend(viewUI, {
                'logicalConnective': 'select.logical-connective' + '[data-cid=' + cid + ']',
                'logicalNegation': 'select.negation' + '[data-cid=' + cid + ']',
                'contractButton': 'span.glyphicon.contract' + '[data-cid=' + cid + ']',
            });
        }

        return viewUI;
    },

    events: function() {
        let viewEvents = {
            'click @ui.addButton': '_onAddCriteria',
            'click @ui.deleteButton': '_onDeleteNode',
        };

        if (this.model.isCriteriaNode()) {
            _.extend(viewEvents, {
                'change @ui.criteriaNegation': '_onCriteriaNegationChanged',
                'change @ui.criteriaElement': '_onCriteriaElementChanged',
                'change @ui.criteriaComparator': '_onCriteriaComparatorChanged',
                'click @ui.expandButton': '_onExpandCriteria',
            });

            if (this.model.elementIsDate()) {
                _.extend(viewEvents, {
                    'changeDate @ui.criteriaValue': '_onCriteriaValueChanged',
                    'clearDate @ui.criteriaValue': '_onCriteriaValueChanged',
                });
            } else if (this.model.elementIsChoiceBased()) {
                _.extend(viewEvents, {
                    'change @ui.criteriaValue': '_onCriteriaValueChanged',
                });
            } else {
                _.extend(viewEvents, {
                    'keyup @ui.criteriaValue': '_onCriteriaValueChanged',
                });
            }
        } else {
            _.extend(viewEvents, {
                'change @ui.logicalConnective': '_onLogicalFormChanged',
                'change @ui.logicalNegation': '_onLogicalFormChanged',
                'click @ui.contractButton': '_onContractLogic',
            });
        }

        return viewEvents;
    },

    onRender: function() {
        // Setup bootstrap-select
        let formContainerSelector = this.model.isCriteriaNode() ? 'div.criteria-form' : 'div.logical-form';
        this.$el.children(formContainerSelector).find('select:not(.value)').selectpicker({
            showTick: false,
            width: '120px',
        });
        this.$el.children(formContainerSelector).find('select.value').selectpicker({
            showTick: false,
            width: 'fit',
        });

        // Setup bootstrap-datepicker
        if (this.model.elementIsDate()) {
            this._isFinishedRenderingDatePicker = false;
            this.$el.find('input.date').datepicker({
                todayBtn: 'linked',
                clearBtn: true,
                autoclose: true,
                language: i18n.language,
                format: 'mm/dd/yyyy',
            });
            this._isFinishedRenderingDatePicker = true;
        }
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
        let data = this.ui.criteriaElement.val().split('-');
        let operandElement = parseInt(data[0]);
        let operandElementPage = parseInt(data[1]);

        this.model.set({
            criteria_element: operandElement,
        }, {
            operandElementPage: operandElementPage,
        });
        this.model.saveRootShowIf();
    },

    _onCriteriaValueChanged: function(event) {
        if (this.model.elementIsDate() && !this._isFinishedRenderingDatePicker) {
            return;
        }

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
