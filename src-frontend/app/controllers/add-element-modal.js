import Ember from 'ember';
import SanaElement from '../models/element';

export default Ember.ObjectController.extend({
  types: function() {
    return SanaElement.TYPES;
  }.property(SanaElement.TYPES),

  shouldShowChoices: function() {
    var type = this.get('model.elementType');
    return SanaElement.TYPES_WITH_CHOICES.indexOf(type) !== -1;
  }.property('model.elementType'),

  actions: {
    save: function() {
      var element = this.store.createRecord('element', {
        page: this.get('page'),
        eid: this.get('eid'),
        displayIndex: this.get('displayIndex'),
        elementType: this.get('elementType'),
        concept: this.get('concept'),
        question: this.get('question'),
        answer: this.get('answer')
      });

      var choices = this.get('choices');
      if (choices !== "") {
        element.set('choices', choices);
      }

      element.save();
    }
  }
});
