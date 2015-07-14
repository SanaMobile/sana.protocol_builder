import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    author: DS.attr('string'),
    version: DS.attr('string'),
    uuid: DS.attr('string'),
    owner: DS.attr('number'),
    lastModified: DS.attr('date'),
    created: DS.attr('date'),
    pages: DS.hasMany('page', { async: true })
});
