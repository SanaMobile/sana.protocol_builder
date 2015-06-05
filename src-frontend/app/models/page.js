import DS from 'ember-data';

export default DS.Model.extend({
    procedure: DS.belongsTo('procedure'),
    displayIndex: DS.attr('number'),
    elements: DS.hasMany('element')
});
