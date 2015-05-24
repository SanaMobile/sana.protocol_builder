import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // TODO: use params['id']
    return this.store.find('procedure', 1);
  }
});
