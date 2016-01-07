let Element = require('models/element_model');
let REORDERED_ELEMENTS_EVENT = 'reorder_elements';


module.exports = Backbone.Collection.extend({

    model: Element,

    constructor: function(models, options) {
        this.parent_page = options.parent_page;
        delete options.parent_page;

        this.comparator = 'display_index';
        this.on(REORDERED_ELEMENTS_EVENT, function() {
            this.each(function(model, index) {
                model.save();
            });
        });

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    move_up: function(element) {
        let new_index = this.indexOf(element) - 1;
        this.reorder_elements(element, new_index);
    },

    move_down: function(element) {
        let new_index = this.indexOf(element) + 1;
        this.reorder_elements(element, new_index);
    },

    reorder_elements: function(element, new_index) {
        if (new_index < 0 || new_index >= this.length) {
            console.warn('Trying to reorder elements to an out-of-bounds index', new_index);
            return;
        }

        if (element.get('display_index') === new_index) {
            console.warn('Trying to set display_index of Element to same value');
            return;
        }

        // Take out target element
        this.remove(element, { silent: true });

        // Re-index all the elements
        this.each(function(model, index) {
            let display_index = index;

            // Any models after the newly sorted item should be shifted down
            if (index >= new_index) {
                display_index += 1;
            }

            model.set('display_index', display_index, { silent: true });
        });

        // Finally add back the target element
        element.set('display_index', new_index, { silent: true });
        this.add(element, { 
            at: new_index,
            silent: true,
        });

        this.sort();
        this.trigger(REORDERED_ELEMENTS_EVENT);
    }

});
