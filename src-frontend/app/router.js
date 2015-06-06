import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('index', { path: '/'});
    this.route('login');
    this.route('procedures', function() {});
    this.route('procedure', { path: '/procedures/:procedure_id' });
    this.route('signup');
});

export default Router;
