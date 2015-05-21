import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr(),
  concept: DS.attr(),
  question: DS.attr(),
  answer: DS.attr(),
  choices: DS.attr()
});
