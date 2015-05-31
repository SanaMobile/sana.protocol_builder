import Ember from 'ember';
import SanaElement from '../models/element';

export default Ember.Controller.extend({
    types: function() {
      return SanaElement.TYPES;
    }.property(SanaElement.TYPES),

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
