import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',

    actions: {
        deleteProcedure: function(procedure) {
            procedure.deleteRecord();
            procedure.save();
        }
    }
});
