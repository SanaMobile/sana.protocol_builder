import Ember from 'ember';

export default Ember.Controller.extend({
    beforeModel: function() {
        debugger
        if (Cookies.get('authorizationToken')) {
            console.log("Has token");
        }
    }
});