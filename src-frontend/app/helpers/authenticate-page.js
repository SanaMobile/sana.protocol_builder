import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(ctx) {
    if (!Cookies.get('authorizationToken')) {
        ctx.transitionTo('login');
    }
});
