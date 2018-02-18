const ElementsEditor = require('views/builder/pageDetails/pageElements/elementsCompositeView');

module.exports = Marionette.LayoutView.extend({

    template: require('templates/concepts/conceptsManagerDetailsLayoutView'),

    regions: {
        elementsEditor: 'section#elements',
    },

    onBeforeShow: function() {
        // console.log("HHIHI");
        // this.showChildView('elementsEditor', new ElementsEditor());
    },

});
