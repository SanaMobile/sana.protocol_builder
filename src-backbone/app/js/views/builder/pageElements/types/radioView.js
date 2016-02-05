module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageElements/types/choicesView'),
    className: 'has-choices radio-select', // To avoid conflicting with BootStrap's 'radio' class

    regions: {
        choicesList: 'div.choices-list',
    },

    behaviors: {
        ChoiceBasedElementBehavior: { }
    },


});
