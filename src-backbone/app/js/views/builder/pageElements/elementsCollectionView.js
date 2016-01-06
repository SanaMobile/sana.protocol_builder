let EmptyView = require('./emptyElementsView');
let ItemView = require('./elementItemView');


module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',

    emptyView: EmptyView,

    childView: ItemView,

});
