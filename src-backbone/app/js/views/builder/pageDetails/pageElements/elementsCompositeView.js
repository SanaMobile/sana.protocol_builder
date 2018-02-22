const App = require('utils/sanaAppInstance');
const ModalLayoutView = require('views/common/modalLayoutView');
const ConceptSearchModalView = require('views/builder/pageDetails/pageElements/concepts/conceptSearchModalView');
const Config = require('utils/config');


module.exports = Marionette.CompositeView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementsCompositeView'),
    emptyView: require('./emptyElementsView'),
    childView: require('./elementItemView'),
    childViewContainer: 'ul#elements-list',

    events: {
        'click a#create-new-element-btn': '_onCreateNewElement',
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
            title: i18n.t('New Element'),
            bodyView: new ConceptSearchModalView({ page: this.model }),
        });
        App().RootView.showModal(modalView);
    },

});
