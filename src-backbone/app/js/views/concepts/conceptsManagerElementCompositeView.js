const App = require('utils/sanaAppInstance');
const ElementModalLayoutView = require('views/common/elementModalLayoutView');

const ElementTypePicker = require('./conceptsManagerElementTypePickerView');

module.exports = Marionette.CompositeView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementsCompositeView'),
    emptyView: require('./conceptsManagerEmptyElementView'),
    childView: require('views/builder/pageDetails/pageElements/elementItemView'),
    childViewContainer: 'ul#elements-list',

    events: {
        'click a#create-new-element-btn': '_onCreateNewElement',
    },

    templateHelpers: function() {
        return {
            titleText: this.titleText,
            canImportFromConcept: false,
            canImportFromSubroutine: false,
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

        if (this.collection.size() >= 1) {
            App().RootView.showNotification({
                title: i18n.t('Cannot add more than 1 element to a concept!'),
            });

            return;
        }

        var modalView = new ElementModalLayoutView({
            title: i18n.t('New Abstract Element'),
            bodyView: new ElementTypePicker({ concept: this.model }),
        });
        App().RootView.showModal(modalView);
    },

});
