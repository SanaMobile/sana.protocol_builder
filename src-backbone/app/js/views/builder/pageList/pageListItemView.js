const Config = require('utils/config');
let App = require('utils/sanaAppInstance');



module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageList/pageListItemView'),
    tagName: 'li',
    attributes: function() {
        let cssClasses = 'page';

        if (this.model.isActive()) {
            cssClasses += ' active';
        }

        return {
            'class': cssClasses,
            'data-model-id': this.model.get('id'),
        };
    },

    events: {
        'click a.delete': '_onDeletePage',
        'click a.page': '_onSelectPage',
    },

    templateHelpers: function() {
        return {
            elements: this.model.elements.toJSON(),
        };
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
