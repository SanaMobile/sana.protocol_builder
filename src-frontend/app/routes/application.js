import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    showModal: function(name, model) {
      this.render(name, {
        into: 'application',
        outlet: 'modal',
        model: model
      });
    },
    hideModal: function() {
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
