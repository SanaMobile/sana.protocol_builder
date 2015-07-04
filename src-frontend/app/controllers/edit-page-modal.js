import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        addElement: function(selectedIndex) {
            var page = this.get('model');

            var newElement = this.store.createRecord('element', {
                page: page,
                displayIndex: selectedIndex,
                eid: selectedIndex
            });

            newElement.save().then(function() {
                page.get('elements').reload();
            });
        },

        deleteElement: function(element) {
            element.deleteRecord();
            element.save();
        },

        save: function() {
            this.get('model.elements').forEach(function(element) {
                element.save();
            });
        }
    }
});
