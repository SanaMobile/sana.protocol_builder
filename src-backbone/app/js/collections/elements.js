const REORDERED_ELEMENTS_EVENT = 'REORDERED_ELEMENTS_EVENT';

let Element = require('models/element');


module.exports = Backbone.Collection.extend({

    model: Element,

    constructor: function(models, options) {
        // this.parentPage = options.parentPage;
        // delete options.parentPage;

        this.comparator = 'display_index';
        this.on(REORDERED_ELEMENTS_EVENT, function() {
            this.each(function(model, index) {
                model.save();
            });
        });

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    moveUp: function(element) {
        let newIndex = this.indexOf(element) - 1;
        this._reorderElements(element, newIndex);
    },

    moveDown: function(element) {
        let newIndex = this.indexOf(element) + 1;
        this._reorderElements(element, newIndex);
    },

    _reorderElements: function(element, newIndex) {
        if (newIndex < 0 || newIndex >= this.length) {
            console.warn('Trying to reorder elements to an out-of-bounds index', newIndex);
            return;
        }

        if (element.get('display_index') === newIndex) {
            console.warn('Trying to set display_index of Element to same value');
            return;
        }

        // Take out target element
        this.remove(element, { silent: true });

        // Re-index all the elements
        this.each(function(model, index) {
            // Any models after the newly sorted item should be shifted down
            if (index >= newIndex) {
                index += 1;
            }

            model.set('display_index', index, { silent: true });
        });

        // Finally add back the target element
        element.set('display_index', newIndex, { silent: true });
        this.add(element, { 
            at: newIndex,
            silent: true,
        });

        this.sort();
        this.trigger(REORDERED_ELEMENTS_EVENT);
    }

});
