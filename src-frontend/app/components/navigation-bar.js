import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        logOut: function() {
            this.get('session').invalidate();
        }
    }
});
