import Ember from 'ember';

export default Ember.Controller.extend({
    username: '',
    password: '',

    actions: {
        login: function() {
            var controller = this;
            $.post('http://localhost:8000/auth/login', {
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
