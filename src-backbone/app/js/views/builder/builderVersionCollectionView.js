let BuilderSelectVersionItemView = require('./builderSelectVersionView');

module.exports = Marionette.CollectionView.extend({

    childView: BuilderSelectVersionItemView,

  	childViewOptions: {
    	selectedVersion: null,
  	},

    tagName: 'select',

    id: 'builder-select-version-view',

    initialize: function(options){
        this.childViewOptions.selectedVersion = options.selectedVersion;
    },
});
