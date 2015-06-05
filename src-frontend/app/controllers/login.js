import Ember from 'ember';
import ENV from 'src-frontend/config/environment';

export default Ember.Controller.extend({
    username: '',
    password: '',

    actions: {
        login: function() {
            var controller = this;
            $.post(ENV.APP.API_HOST + '/auth/login', {
                username: this.get('username'),
                password: this.get('password')
            }, function(response) {
                if (response.success === true && response.token) {
                    Cookies.set('authorizationToken', response.token);
                    controller.transitionToRoute('procedures');
                } else {
                    alert('Incorrect credentials');
                }
            });
        }
    }
});
