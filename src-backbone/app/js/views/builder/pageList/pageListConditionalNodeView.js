const ConditionalNodeView = Marionette.CompositeView.extend({

    template: require('templates/builder/pageList/pageListItemConditionalNodeView'),
    tagName: 'li',
    childViewContainer: 'ul.children-nodes',

    className: function() {
        return 'node' + ' ' +
               (this.model.isCriteriaNode() ? 'criteria' : 'logical') + ' ' +
               (this.model.isRootNode() ? 'root' : '');
    },

    initialize: function() {
        this.collection = this.model.childrenNodes;
    },

    templateHelpers: function() {
        let isLogicAll = (this.model.get('node_type') === 'AND' && !this.model.get('isNegated')) ||
                         (this.model.get('node_type') === 'OR' && this.model.get('isNegated'));

        let elementQuestion = '';
        try{
            // If this fails, then the page hasn't generated its dependentElementsToPage map yet
            elementQuestion = this.model.getElementQuestion();
        } catch (ignore) {}

        return {
            isLogicAll: isLogicAll,
            isCriteria: this.model.isCriteriaNode(),
            elementQuestion: elementQuestion,
        };
    },

});

module.exports = ConditionalNodeView;
