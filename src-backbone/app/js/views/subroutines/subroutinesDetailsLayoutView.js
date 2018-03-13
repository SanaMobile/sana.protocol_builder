const App = require('utils/sanaAppInstance');
const Config  = require('utils/config');

const Subroutines = require('collections/subroutines');

const ElementsEditor = require('./subroutinesElementCompositeView');

module.exports = Marionette.LayoutView.extend({

    template: require('templates/subroutines/subroutinesDetailsLayoutView'),

    ui: {
        displayName: 'input#subroutine-name',
        description: 'input#subroutine-description',
    },

    events: {
        'keyup @ui.displayName': '_save',
        'keyup @ui.description': '_save',
    },

    regions: {
        elementsEditor: 'section#elements',
    },

    templateHelpers: function() {
        let activeSubroutine = this.collection.getActiveSubroutine();

        if (!activeSubroutine) {
            return;
        }

        return {
            displayName: activeSubroutine.get('display_name'),
            description: activeSubroutine.get('description'),
        };
    },

    initialize: function() {
        console.log(this.collection);
        let self = this;

        this.collection.on(Subroutines.ACTIVE_SUBROUTINE_CHANGE_EVENT, function(subroutine) {
            console.log('re-rendering ..');
            self.render();
        });
    },

    onRender: function() {
        const activeSubroutine = this.collection.getActiveSubroutine();
        if (activeSubroutine) {
            this.$el.show();
            this.showChildView(
                'elementsEditor',
                new ElementsEditor({
                    model: activeSubroutine,
                    titleText: 'Elements in this subroutine',
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
        const activeSubroutine = this.collection.getActiveSubroutine();
        activeSubroutine.save({
            display_name: this.ui.displayName.val(),
            description: this.ui.description.val(),
        }, {
            error: function(model, response, options) {
                console.warn('Failed to save subroutine:', response.responseJSON);
                App().RootView.showNotification('Failed to save display name and description!');
            },
        });
    },
});
