import Ember from "ember";

export default Ember.Route.extend({
    actions: {
        error: function(error, transition) {
            // If unauthorized
            if (error.status == 401) {
                this.transitionTo("login");
            }
        }
    }
});
