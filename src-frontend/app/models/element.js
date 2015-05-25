import DS from 'ember-data';

export default DS.Model.extend({
  page: DS.belongsTo('page'),
  eid: DS.attr('string'),
  displayIndex: DS.attr('number'),
  elementType: DS.attr('string'),
  concept: DS.attr('string'),
  question: DS.attr('string'),
  answer: DS.attr('string'),
  choices: DS.attr()
});
