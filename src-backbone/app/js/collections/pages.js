let Page = require('models/page');
let SortableViewBehavior = require('behaviors/sortableBehavior');


module.exports = Backbone.Collection.extend({

    model: Page,

    constructor: function(models, options) {
        this.parentProcedure = options.parentProcedure;
        delete options.parentProcedure;

        this.comparator = 'display_index';
        this.on(SortableViewBehavior.ON_SORT_EVENT, function() {
            this.each(function(model, index) {
                model.save();
            });
        });

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

});
