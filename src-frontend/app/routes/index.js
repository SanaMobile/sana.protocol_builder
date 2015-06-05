import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        if (!Cookies.get('authorizationToken')) {
            this.transitionTo('login');
        }
    }
})