import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import ENV from 'src-frontend/config/environment';

export default Base.extend({
    restore(data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (!Ember.isEmpty(data.token)) {
                resolve(data);
            } else {
                reject();
            }
        });
    },

    authenticate(credentials) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
                method: 'POST',
                url: ENV.APP.API_LOGIN,
                data: credentials
            }).then(function(response) {
                Ember.run(function() {
                    resolve({ token: response.token });
                });
            }, function(xhr, status, error) {
                Ember.run(function() {
                    reject(xhr);
                });
            });
        });
    },

    invalidate(data) {
        return Ember.$.post(ENV.APP.API_LOGOUT);
    }
});
