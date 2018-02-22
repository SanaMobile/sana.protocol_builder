const Concepts = require('collections/concepts');

const ElementsEditor = require('./conceptsManagerElementCompositeView');

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

    onRender: function() {
        const activeConcept = this.collection.getActiveConcept();
        if (activeConcept) {
            this.$el.show();
            this.showChildView(
                'elementsEditor',
                new ElementsEditor({
                    model: activeConcept,
                    titleText: 'Elements on this concept',
                })
            );
        } else {
            this.$el.hide();
            this.getRegion('elementsEditor').reset();
        }
    },

});
