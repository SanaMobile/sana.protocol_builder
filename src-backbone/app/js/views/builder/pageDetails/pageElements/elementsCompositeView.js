const App = require('utils/sanaAppInstance');
const Config = require('utils/config');

const ConceptSearchModalView = require('views/builder/pageDetails/pageElements/concepts/conceptSearchModalView');

const SubroutineSearchModalView = require('views/builder/pageDetails/pageElements/subroutines/subroutineSearchModalView');

const ElementTypePickerView = require('./elementTypePickerView');

const ElementModalLayoutView = require('views/common/elementModalLayoutView');


module.exports = Marionette.CompositeView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementsCompositeView'),
    emptyView: require('./emptyElementsView'),
    childView: require('./elementItemView'),
    childViewContainer: 'ul#elements-list',

    events: {
        'click a#create-new-element-btn': '_onCreateNewElement',
        'click a#import-from-concept-btn': '_importFromConcept',
        'click a#import-from-subroutine-btn': '_importFromSubroutine',
    },

    templateHelpers: function() {
        return {
            titleText: this.titleText,
            canImportFromConcept: true,
            canImportFromSubroutine: true,
        };
    },

    initialize: function(option) {
        if (!option.model) {
            return;
        }

        this.titleText = option.titleText;
        this.collection = option.model.elements;
    },

    _onCreateNewElement: function(event) {
        event.preventDefault();

        var modalView = new ElementModalLayoutView({
            title: i18n.t('Choose Element Type'),
            bodyView: new ElementTypePickerView({
                page: this.model,
            }),
        });
        App().RootView.showModal(modalView);
    },

    _importFromConcept: function(event) {
        event.preventDefault();

        var modalView = new ElementModalLayoutView({
            title: i18n.t('Choose Concept'),
            bodyView: new ConceptSearchModalView({
                page: this.model,
            }),
        });
        App().RootView.showModal(modalView);
    },

    _importFromSubroutine: function(event) {
        event.preventDefault();

        var modalView = new ElementModalLayoutView({
            title: i18n.t('Choose Subroutine'),
            bodyView: new SubroutineSearchModalView({
                page: this.model,
            }),
        });
        App().RootView.showModal(modalView);
    },

});
