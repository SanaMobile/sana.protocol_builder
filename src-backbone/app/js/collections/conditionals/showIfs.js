const ShowIf = require('models/conditionals/showIf');


module.exports = Backbone.Collection.extend({

    model: ShowIf,

    constructor: function(models, options) {
        this.parentPage = options.parentPage;
        delete options.parentPage;

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    add: function(models, options) {
        $.extend(options, {
            parentPage: this.parentPage,
        });

        return Backbone.Collection.prototype.add.call(this, models, options);
    },

});
