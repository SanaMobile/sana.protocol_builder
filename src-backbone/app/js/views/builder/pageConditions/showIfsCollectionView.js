module.exports = Marionette.CollectionView.extend({

    tagName: 'div',

    childView: require('./showIfItemView'),

});
