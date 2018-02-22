const ACTIVE_CONCEPT_CHANGE_EVENT = 'change:activeConcept';

const App = require('utils/sanaAppInstance');

const Concept = require('models/concept');

let Concepts = Backbone.Collection.extend({

    model: Concept,

    comparator: 'display_name',

    initialize : function(models, options){
        this.query = '';
        this.fetch();
    },

    url: function(){
        return '/api/concepts?search=' + this.query;
    },

    createNewConcept: function() {
        const concept = new Concept({
            name: 'default',
            display_name: 'default',
            description: 'default',
        });

        const self = this;
        concept.save({}, {
            success: function() {
                console.info('Created Cocnept', concept.get('id'));
                self.add(concept);
                self.setActiveConcept(concept);
            },
            error: function() {
                console.warn('Failed to create Concept', concept.get('id'));
                App().RootView.showNotification('Failed to create Page!');
            },
        });
    },

    setActiveConcept: function(concept) {
        if (this.activeConcept) {
            this.activeConcept.setSelected(false);
        }

        this.activeConcept = concept;
        this.activeConcept.setSelected(true);
        this.trigger(ACTIVE_CONCEPT_CHANGE_EVENT, concept);
    },

    getActiveConcept: function() {
        return this.activeConcept;
    },
});

Concepts.ACTIVE_CONCEPT_CHANGE_EVENT = ACTIVE_CONCEPT_CHANGE_EVENT;
module.exports = Concepts;
