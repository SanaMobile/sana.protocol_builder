module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'choices',
    childView: require('./choicesItemView'),

    behaviors: {
        SortableBehavior: {
            displayIndexAttr: 'choiceDisplayIndex',
            sortableOptions: {
                // See http://api.jqueryui.com/sortable/ for more info
                placeholder: 'ui-sortable-placeholder',
                handle: 'span.handle',
                forcePlaceholderSize: true,
                containment: 'body',
                distance: 5,
            },
        }
    },

});
