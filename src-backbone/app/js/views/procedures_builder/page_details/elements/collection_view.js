let EmptyView = require('./empty');
let ItemView = require('./item');


module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',

    emptyView: EmptyView,

    childView: ItemView,

});
