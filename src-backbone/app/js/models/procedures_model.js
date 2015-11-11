module.exports = Backbone.Model.extend({

    defaults: {
        'title': 'Untitled', // TODO allow nullable titles
        'author': 'Stephen', // TODO either fetch user's username or let API allow nullable authors
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
