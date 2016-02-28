const ConditionalNode = require('models/conditionals/conditionalNode');


module.exports = Backbone.Collection.extend({

    initialize: function(models, options) {
        delete options.model;
        this.childrenModelOptions = options;
    },

    add: function(models, options) {
        $.extend(options, this.childrenModelOptions);
        return Backbone.Collection.prototype.add.call(this, models, options);
    },

});
