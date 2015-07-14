import Ember from 'ember';

export default Ember.Controller.extend({
    procedures: function() {
        return this.get('model').sortBy('lastModified').reverse();
    }.property('model.@each.lastModified'),

    actions: {
        createProcedure: function() {
            // TODO: Deal with owner ID and user-inputted information
            var procedureController = this;
            var procedure = this.store.createRecord('procedure', {
                title: 'Surgery Follow-Up',
                author: 'Partners for Care'
            });

            procedure.save().then(function() {
                procedureController.transitionToRoute('procedure', procedure);
            });
        }
    }
});
