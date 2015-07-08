import DS from 'ember-data';

let SanaElement = DS.Model.extend({
    page: DS.belongsTo('page'),
    eid: DS.attr('string'),
    displayIndex: DS.attr('number'),
    elementType: DS.attr('string', { defaultValue: 'ENTRY' }),
    concept: DS.attr('string'),
    question: DS.attr('string'),
    answer: DS.attr('string'),
    choices: DS.attr({ defaultValue: [] }),

    hasChoices: function() {
        var type = this.get('elementType');
        return SanaElement.TYPES_WITH_CHOICES.indexOf(type) !== -1;
    }.property('elementType')
});

SanaElement.reopenClass({
    TYPES: [
        'ENTRY',
        'SELECT',
        'MULTI_SELECT',
        'RADIO',
        'GPS',
        'SOUND',
        'PICTURE'
    ],
    TYPES_WITH_CHOICES: [
        'SELECT',
        'MULTI_SELECT',
        'RADIO'
    ]
});

export default SanaElement;
