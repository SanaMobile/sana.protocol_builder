import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    confirm: function() {
      this.$('.modal').modal('hide');
      this.sendAction('confirm');
    }
  },
  show: function() {
    this.$('.modal').modal().on('hidden.bs.modal', function() {
      this.sendAction('close');
    }.bind(this));
  }.on('didInsertElement')
});
