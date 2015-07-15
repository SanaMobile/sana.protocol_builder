import Ember from 'ember';

export function dateString(params) {
    return params[0].toDateString();
}

export default Ember.HTMLBars.makeBoundHelper(dateString);
