import $ from 'jquery';
import Ember from 'ember';
import ENV from 'src-frontend/config/environment';

export default Ember.Controller.extend({
    email: '',
    username: '',
    password1: '',
    password2: '',
    accept_tos: false,

    actions: {
        signup: function() {
            var controller = this;
            $.post(ENV.APP.API_HOST + '/auth/signup', {
                email: this.get('email'),
                username: this.get('username'),
                password1: this.get('password1'),
                password2: this.get('password2'),
                accept_tos: this.get('accept_tos')
            }, function(response) {
                if (response.success === true && response.token) {
                    controller.transitionToRoute('login');
                } else {
                    // TODO: Issue #123
                    // Add flash messages to show form errors
                    alert('An error occurred during registration');
                }
            });
        }
    }
});