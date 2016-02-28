const ConditionalNode = require('./conditionalNode');
const Config = require('utils/config');


module.exports = Backbone.Model.extend({

    urlRoot: '/api/conditionals',

    constructor: function(attributes, options = {}) {
        this.rootConditionalNode = new ConditionalNode(null, {
            parentConditionalNode: null,
            rootShowIf: this,
        });

        options.parse = true;
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    parse: function(response, options) {
        this.rootConditionalNode.reset(response.conditions);
        delete response.conditions;

        this.trigger('update');
        return response;
    },

    toJSON: function() {
        let json = _.clone(this.attributes);
        json.conditions = this.rootConditionalNode.toJSON({ seralizeToShowIf: true });
        return json;
    },

});
