export default Ember.Component.extend({
    didInsertElement: function() {
        var self = this;
        this.$("ul.procedure").sortable({
            items: 'li:not(:first-child)',
            handle: 'span.drag-handle',
            revert: true,
            scroll: true,
            update: function(event, ui) {
                var indices = {};

                $(this).find('a.open-page').each(function(index) {
                    indices[$(this).data('id')] = index;
                });

                self.sendAction('update', indices);
            }
        });
    }
});
