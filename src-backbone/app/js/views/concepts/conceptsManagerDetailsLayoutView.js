const Concepts = require('collections/concepts');

const ElementsEditor = require('views/builder/pageDetails/pageElements/elementsCompositeView');

module.exports = Marionette.LayoutView.extend({

    template: require('templates/concepts/conceptsManagerDetailsLayoutView'),

    regions: {
        elementsEditor: 'section#elements',
    },

    templateHelpers: function() {
        let activeConcept = this.collection.getActiveConcept();

        if (!activeConcept) {
            return;
        }

        return {
            displayName: activeConcept.get('display_name'),
            description: activeConcept.get('description'),
        };
    },

    initialize: function() {
        console.log(this.collection);
        let self = this;

        this.collection.on(Concepts.ACTIVE_CONCEPT_CHANGE_EVENT, function(concept) {
            console.log('re-rendering ..');
            self.render();
        });
    },

    onBeforeShow: function() {
        // console.log("HHIHI");
        // this.showChildView('elementsEditor', new ElementsEditor());
    },

    onRender: function() {
        if (this.collection.getActiveConcept()) {
            this.$el.show();
        } else {
            this.$el.hide();
        }
    },

});
