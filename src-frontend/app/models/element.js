import DS from 'ember-data';

export default DS.Model.extend({
  index: DS.attr(),
  type: DS.attr(),
  concept: DS.attr(),
  question: DS.attr(),
  answer: DS.attr(),
  choices: DS.attr()
});
