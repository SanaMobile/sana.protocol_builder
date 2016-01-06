let ProceduresEmptyView = require('./emptyProceduresView');
let ProceduresItemView = require('./proceduresItemView');


module.exports = Marionette.CollectionView.extend({

    childView: ProceduresItemView,

    emptyView: ProceduresEmptyView,

    tagName: 'ul',

});
