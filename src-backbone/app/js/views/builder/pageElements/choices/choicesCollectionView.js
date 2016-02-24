const ItemView = require('./choicesItemView');


module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'choices',

    childView: ItemView,

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

    onRender: function() {
        console.debug('choicesCollectionView onRender');
    },

});
