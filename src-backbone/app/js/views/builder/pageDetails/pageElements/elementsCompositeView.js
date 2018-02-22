const App = require('utils/sanaAppInstance');
const Config = require('utils/config');

const ConceptSearchModalView = require('views/builder/pageDetails/pageElements/concepts/conceptSearchModalView');
const ElementTypePickerView = require('./elementTypePickerView');
const ModalLayoutView = require('views/common/modalLayoutView');


module.exports = Marionette.CompositeView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementsCompositeView'),
    emptyView: require('./emptyElementsView'),
    childView: require('./elementItemView'),
    childViewContainer: 'ul#elements-list',

    events: {
        'click a#create-new-element-btn': '_onCreateNewElement',
        'click a#import-from-concept-btn': '_importFromConcept',
    },

    templateHelpers: function() {
        return {
            titleText: this.titleText,
            canImportFromConcept: true,
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

        var modalView = new ModalLayoutView({
            title: i18n.t('Choose Element Type'),
            bodyView: new ElementTypePickerView({
                page: this.model,
            }),
        });
        App().RootView.showModal(modalView);
    },

    _importFromConcept: function(event) {
        event.preventDefault();

        var modalView = new ModalLayoutView({
            title: i18n.t('Choose Element Type'),
            bodyView: new ConceptSearchModalView({
                page: this.model,
            }),
        });
        App().RootView.showModal(modalView);
    }

});
