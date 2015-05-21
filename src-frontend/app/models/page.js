import DS from 'ember-data';

export default DS.Model.extend({
  prev: DS.attr(),
  next: DS.attr(),
  elements: DS.hasMany('element')
});
