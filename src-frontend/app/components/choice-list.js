import Ember from 'ember';

export default Ember.Component.extend({
    targetObject: Ember.computed.alias('parentView'),
    didInsertElement: function() {
        var choiceListComponent = this;
        this.$("ul.choices-list").sortable({
            handle: 'span.reorder-choice',
            revert: true,
            scroll: true,
            update: function(event, ui) {
                var choices = Ember.$(this).sortable('toArray', { attribute: 'data-choice' });

                Ember.$(this).sortable('cancel');

                choiceListComponent.sendAction('updateChoiceOrder', choices);
            }
        });

        this.$('#new-choice').keypress(function(event) {
            if (event.keyCode === Ember.$.ui.keyCode.ENTER) {
                var text = Ember.$(this).val();
                choiceListComponent.addChoice(text);
            }
        });
    },

    addChoice: function(choice) {
        this.get('choices').pushObject(choice);
        this.$('#new-choice').val('');
    },

    actions: {
        deleteChoice: function(index) {
            this.get('choices').removeAt(index);
        }
    }
});
