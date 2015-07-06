import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        save: function() {
            this.get('model.elements').forEach(function(element) {
                element.save();
            });
        }
    }
});
