import DS from 'ember-data';

export default DS.Model.extend({
  index: DS.attr(),
  elements: DS.hasMany('element')
});
