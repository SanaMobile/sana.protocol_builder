let Page = require('models/page');
let SortableBehavior = require('behaviors/sortableBehavior');


module.exports = Backbone.Collection.extend({

    model: Page,

    constructor: function(models, options) {
        this.parentProcedure = options.parentProcedure;
        delete options.parentProcedure;

        this.comparator = 'display_index';
        this.on(SortableBehavior.ON_SORT_EVENT, function() {
            this.each(function(model, index) {
                if (index === 0) {
                    // Remove any existing conditions
                    model.clearCriteria();
                }

                model.save();
            });
        });

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

});
