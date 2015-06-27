import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    actions: {
        showModal: function(name, model) {
            this.render(name, {
                into: 'application',
                outlet: 'modal',
                model: model
            });
        },
        hideModal: function() {
            this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'application'
            });
        }
    }
});
