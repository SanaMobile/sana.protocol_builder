const App = require('utils/sanaAppInstance');
const ModalLayoutView = require('views/common/modalLayoutView');

const ElementTypePicker = require('./conceptsManagerElementTypePickerView');

module.exports = Marionette.CompositeView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementsCompositeView'),
    emptyView: require('views/builder/pageDetails/pageElements/emptyElementsView'),
    childView: require('views/builder/pageDetails/pageElements/elementItemView'),
    childViewContainer: 'ul#elements-list',

    events: {
        'click a#create-new-element-btn': '_onCreateNewElement',
    },

    initialize: function() {
        if (!this.model) {
            return;
        }

        this.collection = this.model.elements;
    },

    _onCreateNewElement: function(event) {
        event.preventDefault();

        var modalView = new ModalLayoutView({
            title: i18n.t('New Abstract Element'),
            bodyView: new ElementTypePicker({ concept: this.model }),
        });
        App().RootView.showModal(modalView);
    },

});
