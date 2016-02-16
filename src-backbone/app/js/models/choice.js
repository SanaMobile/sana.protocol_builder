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

});
