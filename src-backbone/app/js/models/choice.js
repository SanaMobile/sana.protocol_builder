const Config = require('utils/config');


module.exports = Backbone.Model.extend({

    defaults: {
        text: '',
        isDefault: false,
        choiceDisplayIndex: 0,
    },

    toggleDefault: function() {
        const oldValue = this.get('isDefault');
        this.set('isDefault', !oldValue);
    },

    initialize: function() {
        this.debounceSave = _.debounce(function() {
            this._debounceSave.apply(this, arguments);
        }, Config.INPUT_DELAY_BEFORE_SAVE);
    },

    _debounceSave: function(text) {
        this.set({
            text: text,
        }, {
            silent: true, // Do not call Choice.save() because it doesn't have an API endpoint
        });

        // Always trigger even if there's no change because sometimes we may create
        // a Choice by typing 1 letter and stop. This results in just an 'add' event
        // and no 'change' event. Thus it won't trigger the Element.save() method
        // listener in element.js because Element only listens for 'change' and
        // 'destroy' events
        this.trigger('change', this);
    },

});
