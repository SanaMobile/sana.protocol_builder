import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    author: DS.attr('string'),
    version: DS.attr('string'),
    uuid: DS.attr('string'),
    owner: DS.attr('number'),
    pages: DS.hasMany('page', { async: true })
});
