const ConditionalNode = require('./conditionalNode');
const Config = require('utils/config');


module.exports = Backbone.Model.extend({

    urlRoot: '/api/conditionals',

    constructor: function(attributes, options = {}) {
        this.parentPage = options.parentPage;
        delete options.parentPage;

        this.rootConditionalNode = new ConditionalNode(null, {
            parentPage: this.parentPage,
            parentConditionalNode: null,
            rootShowIf: this,
        });

        options.parse = true;
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    parse: function(response, options) {
        this.rootConditionalNode.reset(response.conditions, { silent: true });
        delete response.conditions;

        this.trigger('update'); // Always rerender on load or post save
        return response;
    },

    toJSON: function() {
        let json = _.clone(this.attributes);
        json.conditions = this.rootConditionalNode.toJSON({ seralizeToShowIf: true });
        return json;
    },

});
