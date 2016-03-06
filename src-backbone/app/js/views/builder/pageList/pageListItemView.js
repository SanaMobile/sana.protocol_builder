const Config = require('utils/config');
const App = require('utils/sanaAppInstance');
const PageListConditionalNodeView = require('./pageListConditionalNodeView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageList/pageListItemView'),
    tagName: 'li',
    className: 'page',

    ui: {
        'popoverHandle': 'span.shown-conditionally'
    },

    events: {
        'click a.delete': '_onDeletePage',
        'click a.page': '_onSelectPage',
    },

    modelEvents: {
        'change:depended-upon': 'render',
    },

    regions: {
        'conditions': 'ul.conditions',
    },

    initialize: function() {
        this.listenTo(this.model.showIfs, 'sync', this.render);
    },

    templateHelpers: function() {
        return {
            isActive: this.model.isActive(),
            isBeingDependedUpon: this.model.isBeingDependedUpon(),
            hasConditions: this.model.showIfs.length > 0,
            elements: this.model.elements.toJSON(),
        };
    },

    onRender: function() {
        if (this.model.showIfs.length > 0) {
            this.showChildView('conditions', new PageListConditionalNodeView({ model: this.model.showIfs.at(0).rootConditionalNode }));
        }

        let self = this;
        this.ui.popoverHandle.popover({
            title: i18n.t("Page Conditions"),
            trigger: 'hover',
            placement: 'right',
            html: true,
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><ul class="popover-content"></ul></div>',
            content: function() {
                return self.getRegion('conditions').$el.html();
            },
        });
    },

    onDestroy: function() {
        this.ui.popoverHandle.popover('destroy');
    },

    _onDeletePage: function(event) {
        event.preventDefault();

        // TODO prompt user for confirmation
        let self = this;
 
        this.$el.fadeOut('fast', function() {
            if (self.model.isActive()) {
                self.model.collection.parentProcedure.unselectActivePage();
            }

            self.model.destroy({
                wait: true, // Wait for server response before removing from collection
                success: function() {
                    console.info('Deleted Page', self.model.get('id'));
                },
                error: function(model, response, options) {
                    console.warn('Failed to delete Page', self.model.get('id'), response.responseJSON);
                    App().RootView.showNotification('Failed to delete Page!');
                    self.$el.fadeIn();
                },
            });
        });
    },

    _onSelectPage: function(event) {
        if (this.model.isActive()) {
            this.model.collection.parentProcedure.unselectActivePage();
        } else {
            this.model.collection.parentProcedure.selectActivePage(this.model);
        }
    },

});
