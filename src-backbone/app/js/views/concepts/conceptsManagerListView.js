const Concepts = require('collections/concepts');

module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'concepts-list',
    childView: require('./conceptsManagerListItemView'),

    childEvents: {
        'concept:delete': '_onDeleteConcept',
        'concept:select': '_onSelectConcept',
    },

    initialize: function() {
        this.prevSelectedView = null;
        // this.collection.on(Concepts.ACTIVE_CONCEPT_CHANGE_EVENT, function(concept) {
        //     self.render();
        // });
    },

    _onDeleteConcept: function(childView) {
        console.log('concept deleted: ' + childView.model.attributes.display_name);
        const child = childView.model;

        childView.$el.fadeOut('fast', function() {
            if (child.isSelected()) {
                child.setSelected(false);
            }

            child.destroy({
                wait: true, // Wait for server response before removing from collection
                success: function() {
                    console.info('Deleted Page', child.get('id'));
                },
                error: function(model, response, options) {
                    console.warn('Failed to delete Page', child.get('id'), response.responseJSON);
                    App().RootView.showNotification('Failed to delete Page!');
                    childView.$el.fadeIn();
                },
            });
        });
    },

    _onSelectConcept: function(childView) {
        console.log('concept selected: ' + childView.model.attributes.display_name);
        if (childView === this.prevSelectedView) {
            return;
        }

        this.collection.setActiveConcept(childView.model);
        if (this.prevSelectedView) {
            try {
                this.prevSelectedView.render();
            } catch(err) {
                // can be ignored
            }

        }
        childView.render();

        this.prevSelectedView = childView;
    },

});
