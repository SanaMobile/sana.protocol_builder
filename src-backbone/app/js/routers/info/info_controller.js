module.exports = Marionette.Controller.extend({

    constructor : function (options) {
        this.app = options.app;
        this.InfoLayout = (options && options.InfoLayout) || require('views/info/info_layout');

        Marionette.Controller.prototype.constructor.call(this, options);
    },

    terms_of_service: function () {
        log.info('View: Terms of Service');

        var info_layout = new this.InfoLayout({ app: this.app });
        this.app.root_view.showChildView('main', info_layout);
        info_layout.showChildView('info_area', new Marionette.ItemView({
            template: Handlebars.templates.terms_of_service,
        }));
    },
  
    privacy_policy: function() {
        log.info('View: Privacy Policy');

        var info_layout = new this.InfoLayout({ app: this.app });
        this.app.root_view.showChildView('main', info_layout);
        info_layout.showChildView('info_area', new Marionette.ItemView({
            template: Handlebars.templates.privacy_policy,
        }));
    },

});
