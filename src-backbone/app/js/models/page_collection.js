var Page = require('models/page_model');


module.exports = Backbone.Collection.extend({

    model: Page,

    constructor: function(models, options) {
        this.parent_procedure = options.parent_procedure;
        delete options.parent_procedure;

        this.comparator = 'display_index';
        this.on('sortable', function() {
            this.each(function(model, index) {
                model.save();
            });
        });

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

});
