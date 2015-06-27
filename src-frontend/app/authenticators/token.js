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
                url: ENV.APP.API_HOST + '/auth/login',
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
        // TODO: add support for token invalidation
    }
});
