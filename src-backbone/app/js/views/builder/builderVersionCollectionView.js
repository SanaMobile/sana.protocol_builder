let BuilderSelectVersionItemView = require('./builderSelectVersionView');


module.exports = Marionette.CollectionView.extend({

    childView: BuilderSelectVersionItemView,

    tagName: 'select',

});
