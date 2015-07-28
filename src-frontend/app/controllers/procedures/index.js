import Ember from 'ember';

export default Ember.Controller.extend({
    procedures: function() {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['lastModified'],
            sortAscending: false,
            content: this.get('model')
        });
    }.property('model.@each.lastModified'),

    actions: {
        createProcedure: function() {
            // TODO: Deal with owner ID and user-inputted information
            var procedureController = this;
            var flashMessages = Ember.get(this, 'flashMessages');
            var procedure = this.store.createRecord('procedure', {
                title: 'Surgery Follow-Up',
                author: 'Partners for Care'
            });

            procedure.save().then(function() {
                procedureController.transitionToRoute('procedure', procedure);
            }).catch(function(response) {
                var errorMessage = 'Something went wrong trying to create the procedure';
                response.errors.forEach(function(error){
                    for (var attr in error.details) {
                        errorMessage = attr.toString() + ": " + error.details[attr][0];
                    }
                });
                flashMessages.danger(errorMessage);
                procedure.destroy();
            });
        }
    }
});
