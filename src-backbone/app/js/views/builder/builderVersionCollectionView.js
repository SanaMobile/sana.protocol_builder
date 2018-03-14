let BuilderSelectVersionItemView = require('./builderSelectVersionView');

module.exports = Marionette.CollectionView.extend({

    childView: BuilderSelectVersionItemView,

  	childViewOptions: {
    	selectedVersion: null,
  	},

    tagName: 'select',

    id: 'builder-select-version-view',

    event: {
    	'change': '_selectCollectionVersion',
    },

    initialize: function(options){
        this.childViewOptions.selectedVersion = options.selectedVersion;
    },

    _selectCollectionVersion: function() {
        console.log("i ball");
    },
});
