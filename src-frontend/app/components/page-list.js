import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
        var pageListComponent = this;
        this.$("ul.procedure").sortable({
            items: 'li:not(:first-child)',
            handle: 'span.drag-handle',
            revert: true,
            scroll: true,
            placeholder: 'ui-state-highlight',
            update: function(event, ui) {
                var sortOrder = $(this).sortable('toArray');
                var pageModels = [];

                sortOrder.forEach(function(id, index) {
                    pageModels.push({
                        id: id,
                        display_index: index
                    });
                });

                $(this).sortable('cancel');

                pageListComponent.sendAction('updateSortOrder', pageModels);
            }
        });
    },

    actions: {
        addPage: function(index) {
            this.sendAction('addPage', index);
        },

        editPage: function(page) {
            this.sendAction('editPage', page);
        },

        deletePage: function(page) {
            this.sendAction('deletePage', page);
        }
    }
});
