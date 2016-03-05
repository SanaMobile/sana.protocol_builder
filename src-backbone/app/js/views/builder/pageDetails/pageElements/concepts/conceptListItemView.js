const App = require('utils/sanaAppInstance');
const ElementTypePickerView = require('views/builder/pageDetails/pageElements/elementTypePickerView');
const ModalLayoutView = require('views/common/modalLayoutView');


module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageDetails/pageElements/concepts/conceptListItemView'),

    tagName: 'tr',

    ui: {
        'concept': 'td.concept',
    },

    events: {
        'click @ui.concept': '_onClickConcept',
    },

    initialize: function(options) {
        this.page = options.page;
    },

    _onClickConcept: function(event) {
        event.preventDefault();

        var modalView = new ModalLayoutView({
            title: i18n.t('Choose Element Type'),
            bodyView: new ElementTypePickerView({
                page: this.page,
                concept: this.model,
            }),
        });
        App().RootView.modal.show(modalView);
    },

});
