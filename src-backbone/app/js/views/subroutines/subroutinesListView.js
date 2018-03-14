const Subroutines = require('collections/subroutines');

module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'subroutines-list',
    childView: require('./subroutinesListItemView'),

    childEvents: {
        'subroutine:delete': '_onDeleteSubroutine',
        'subroutine:select': '_onSelectSubroutine',
    },

    initialize: function() {
        this.prevSelectedView = null;

        let self = this;
        this.collection.on(Subroutines.ACTIVE_SUBROUTINE_CHANGE_EVENT, function(concept) {
            self.render();
        });
    },

    _onDeleteSubroutine: function(childView) {
        console.log('subroutine deleted: ' + childView.model.attributes.display_name);
        const child = childView.model;

        childView.$el.fadeOut('fast', function() {
            if (child.isSelected()) {
                child.setSelected(false);
            }

            child.destroy({
                wait: true, // Wait for server response before removing from collection
                success: function() {
                    console.info('Deleted subroutine', child.get('id'));
                },
                error: function(model, response, options) {
                    console.warn('Failed to delete subroutine', child.get('id'), response.responseJSON);
                    App().RootView.showNotification('Failed to delete subroutine!');
                    childView.$el.fadeIn();
                },
            });
        });
    },

    _onSelectSubroutine: function(childView) {
        this.collection.setActiveSubroutine(childView.model);
    },
});
