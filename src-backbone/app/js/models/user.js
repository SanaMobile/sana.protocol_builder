module.exports = Backbone.Model.extend({

    urlRoot: '/api/users',

    constructor: function(attributes, options) {
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },
});
