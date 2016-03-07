module.exports = Backbone.Model.extend({

    urlRoot: '/api/concepts',

    parse: function(response, options) {
        response.created       = new Date(Date.parse(response.created));
        response.last_modified = new Date(Date.parse(response.last_modified));

        return response;
    },

});