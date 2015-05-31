import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        addElement: function(selectedIndex) {
            var targetIndex = selectedIndex + 1;
            var elements = this.get('model.elements');
            var elementsToBePushed = elements.filter(function(element) {
              return element.get('displayIndex') >= targetIndex;
            });

            elementsToBePushed.forEach(function(element) {
              element.incrementProperty('displayIndex');
              // TODO: Find a way to batch these updates
              element.save();
            });

            var newElement = this.store.createRecord('element', {
              page: this.get('model'),
              displayIndex: targetIndex
            });

            newElement.save();
        },
        deleteElement: function(element) {
            element.deleteRecord();
            element.save();
        },
        save: function() {
            this.get('model.elements').then(function(elements) {
                elements.forEach(function(element) {
                    element.save();
                });
            });
        }
    }
});
