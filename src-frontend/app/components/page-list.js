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
                var indices = {};

                $(this).find('a.open-page').each(function(index) {
                    indices[$(this).data('id')] = index;
                });

                pageListComponent.sendAction('updateSortOrder', indices);
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
