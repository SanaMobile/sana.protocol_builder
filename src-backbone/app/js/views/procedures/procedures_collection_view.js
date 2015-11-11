var ProceduresEmptyView = require('views/procedures/procedures_empty_view');
var ProceduresItemView = require('views/procedures/procedures_item_view');


module.exports = Marionette.CollectionView.extend({

    childView: ProceduresItemView,

    emptyView: ProceduresEmptyView,

    tagName: 'ul',

});
