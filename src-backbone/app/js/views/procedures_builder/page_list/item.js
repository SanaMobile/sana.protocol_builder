module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures_builder/page_list/page_list_item_view'),
    tagName: 'li',
    attributes: function() {
        let class_name = 'page';

        if (this.model.is_active()) {
            class_name += ' active';
        }

        return {
            'class': class_name,
            'data-model-id': this.model.get('id'),
        };
    },

    templateHelpers: {
        DEBUG: DEBUG,
    },

    events: {
        'click a.delete': 'delete_page',
        'click a.page': 'click_page',
    },

    delete_page: function(event) {
        event.preventDefault();

        // TODO prompt user for confirmation
        let self = this;
 
        this.$el.fadeOut('fast', function() {
            if (self.model.is_active()) {
                self.model.collection.parent_procedure.unselect_active_page();
            }

            self.model.destroy({
                wait: true, // Wait for server response before removing from collection
                success: function() {
                    console.info('Deleted Page', self.model.get('id'));
                },
                error: function(model, response, options) {
                    console.warn('Failed to delete Page', self.model.get('id'), response.responseJSON);
                    self.$el.fadeIn();
                    // TODO show error alert
                },
            });
        });
    },

    click_page: function(event) {
        if (this.model.is_active()) {
            this.model.collection.parent_procedure.unselect_active_page();
        } else {
            this.model.collection.parent_procedure.select_active_page(this.model);
        }
    },

});
