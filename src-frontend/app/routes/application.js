import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    showModal: function(name) {
      this.render(name, {
        into: 'application',
        outlet: 'modal'
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
