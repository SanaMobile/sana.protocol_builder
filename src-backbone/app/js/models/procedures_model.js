module.exports = Backbone.Model.extend({

    defaults: {
        'title': 'Untitled Procedure',
        'author': '',
        'pages': [],
    },

    parse: function(response, options) {
        var parse_date_in_response = function(key) {
            response[key] = new Date(Date.parse(response[key]));
        };

        parse_date_in_response('created');
        parse_date_in_response('last_modified');
        return response;
    },

});
