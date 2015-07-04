import Ember from 'ember';

export default Ember.Component.extend({
    targetObject: Em.computed.alias('parentView'),
    didInsertElement: function() {
        var choiceListComponent = this;
        this.$("ul.choices").sortable({
            handle: 'span.drag-handle',
            revert: true,
            scroll: true,
            update: function(event, ui) {
                var choices = $(this).sortable('toArray', { attribute: 'choice' });

                $(this).sortable('cancel');

                choiceListComponent.sendAction('updateChoiceOrder', choices);
            }
        });
    },
});
