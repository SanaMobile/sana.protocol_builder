module.exports = Marionette.Controller.extend({

    constructor : function (options) {
        this.app = options.app;
        this.Helpers = (options && options.Helpers) || require('utils/helpers');
        this.InfoLayout = (options && options.InfoLayout) || require('views/info/info_layout');

        Marionette.Controller.prototype.constructor.call(this, options);
    },

    not_found: function () {
        this.Helpers.arrived_on_page('404: Page Not Found');

        var info_layout = new this.InfoLayout({ app: this.app });
        this.app.root_view.showChildView('main', info_layout);
        info_layout.showChildView('info_area', new Marionette.ItemView({
            template: Handlebars.templates.not_found,
        }));
    },

});
