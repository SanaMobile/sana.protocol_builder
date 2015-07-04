import Ember from 'ember';
import SanaElement from '../models/element';

export default Ember.Component.extend({
    types: function() {
        return SanaElement.TYPES;
    }.property(SanaElement.TYPES),

    actions: {
        updateChoiceOrder: function(choices) {
            this.set('model.choices', choices);
        }
    }
});
