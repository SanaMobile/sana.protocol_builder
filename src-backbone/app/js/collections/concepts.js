let Concept = require('models/concept');


module.exports = Backbone.Collection.extend({

    model: Concept,

    comparator: 'display_name',

    initialize : function(models, options){
        this.query = '';
        this.fetch();
    },

    url: function(){
        return '/api/concepts?search=' + this.query;
    },

});
