module.exports = Marionette.LayoutView.extend({

    template: require('templates/procedures/builder_layout'),

    constructor: function(options = {}) {
        this.app     = options.app     || global.App;
        this.Helpers = options.Helpers || require('utils/helpers');

        Marionette.LayoutView.prototype.constructor.call(this, options);
    },

});
