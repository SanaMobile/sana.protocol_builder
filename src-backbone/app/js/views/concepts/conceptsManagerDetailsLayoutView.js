const App = require('utils/sanaAppInstance');
const Config  = require('utils/config');

const Concepts = require('collections/concepts');

const ElementsEditor = require('./conceptsManagerElementCompositeView');

module.exports = Marionette.LayoutView.extend({

    template: require('templates/concepts/conceptsManagerDetailsLayoutView'),

    ui: {
        displayName: 'input#concept-name',
        description: 'input#concept-description',
    },

    events: {
        'keyup @ui.displayName': '_save',
        'keyup @ui.description': '_save',
    },

    regions: {
        elementsEditor: 'section#elements',
    },

    templateHelpers: function() {
        let activeConcept = this.collection.getActiveConcept();

        if (!activeConcept) {
            return;
        }

        return {
            displayName: activeConcept.get('display_name'),
            description: activeConcept.get('description'),
        };
    },

    initialize: function() {
        console.log(this.collection);
        let self = this;

        this.collection.on(Concepts.ACTIVE_CONCEPT_CHANGE_EVENT, function(concept) {
            console.log('re-rendering ..');
            self.render();
        });
    },

    onRender: function() {
        const activeConcept = this.collection.getActiveConcept();
        if (activeConcept) {
            this.$el.show();
            this.showChildView(
                'elementsEditor',
                new ElementsEditor({
                    model: activeConcept,
                    titleText: 'Elements on this concept',
                })
            );
        } else {
            this.$el.hide();
            this.getRegion('elementsEditor').reset();
        }
    },

    _save: _.debounce(function() {
        this._saveToServer();
    }, Config.INPUT_DELAY_BEFORE_SAVE),

    _saveToServer: function() {
        const activeConcept = this.collection.getActiveConcept();
        activeConcept.save({
            display_name: this.ui.displayName.val(),
            description: this.ui.description.val(),
        }, {
            error: function(model, response, options) {
                console.warn('Failed to save Concept:', response.responseJSON);
                App().RootView.showNotification('Failed to save display name and description!');
            },
        });
    },
});
