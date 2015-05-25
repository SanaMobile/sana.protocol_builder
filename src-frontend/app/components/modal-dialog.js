import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    save: function() {
      this.$('.modal').modal('hide');
      this.sendAction('save');
    }
  },
  show: function() {
    this.$('.modal').modal().on('hidden.bs.modal', function() {
      this.sendAction('cancel');
    }.bind(this));
  }.on('didInsertElement')
});
