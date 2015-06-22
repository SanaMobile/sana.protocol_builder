import Ember from 'ember';

export function plusOne(params) {
  return parseInt(params) + 1;
}

export default Ember.HTMLBars.makeBoundHelper(plusOne);
