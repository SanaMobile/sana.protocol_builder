let Concept = require('models/concept');


module.exports = Backbone.Collection.extend({

    model: Concept,

    initialize : function(models, options){
        this.query = '';
    },

    url: function(){
        return '/api/concepts?search=' + this.query;
    },

});
