import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
        var choiceListComponent = this;
        this.$("ul.choices").sortable({
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
