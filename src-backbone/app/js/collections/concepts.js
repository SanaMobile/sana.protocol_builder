const ACTIVE_CONCEPT_CHANGE_EVENT = 'change:activeConcept';

let Concept = require('models/concept');

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

    setActiveConcept: function(concept) {
        this.activeConcept = concept;
        this.trigger(ACTIVE_CONCEPT_CHANGE_EVENT, concept);
    },

    getActiveConcept: function() {
        return this.activeConcept;
    },
});

Concepts.ACTIVE_CONCEPT_CHANGE_EVENT = ACTIVE_CONCEPT_CHANGE_EVENT;
module.exports = Concepts;
