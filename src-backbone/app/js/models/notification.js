module.exports = Backbone.Model.extend({
    
    // Possible types: 
    //  'success'   green
    //  'info'      blue
    //  'warning'   yellow
    //  'danger'    red

    defaults: function () {
        return {
            alertType: 'danger',
            title: i18n.t('An unknown error has occurred!'), // Bold
            desc: i18n.t('Please try again later.'), // Rest of alert body
            timeout: 5, // Seconds
        };
    },

    constructor: function(attributes, options) {
        if (!options.isTranslated) {
            let translateField = function(key) {
                if (options[key]) {
                    options[key] = i18n.t(options[key]);
                }
            };

            translateField('title');
            translateField('desc');
        }

        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

});
