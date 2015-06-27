import Ember from 'ember';

export default Ember.Controller.extend({
    username: '',
    password: '',

    actions: {
        login: function() {
            var credentials = {
                username: this.get('username'),
                password: this.get('password')
            };

            this.get('session').authenticate('authenticator:token', credentials);
        },
        signup: function() {
            this.transitionToRoute('signup');
        }
    }
});
