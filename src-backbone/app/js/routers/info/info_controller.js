module.exports = Marionette.Controller.extend({

    constructor : function (options = {}) {
        this.app        = options.app;
        this.Helpers    = options.Helpers    || require('utils/helpers');
        this.InfoLayout = options.InfoLayout || require('views/info/info_layout');

        Marionette.Controller.prototype.constructor.call(this, options);
    },

    terms_of_service: function () {
        this.Helpers.arrived_on_page('Terms of Service');

        var info_layout = new this.InfoLayout({ app: this.app });
        this.app.root_view.showChildView('main', info_layout);
        info_layout.showChildView('info_area', new Marionette.ItemView({
            template: require('templates/info/terms_of_service'),
        }));
    },
  
    privacy_policy: function() {
        this.Helpers.arrived_on_page('Privacy Policy');

        var info_layout = new this.InfoLayout({ app: this.app });
        this.app.root_view.showChildView('main', info_layout);
        info_layout.showChildView('info_area', new Marionette.ItemView({
            template: require('templates/info/privacy_policy'),
        }));
    },

});
