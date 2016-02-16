const ChoicesCollectionView = require('views/builder/pageElements/choices/choicesCollectionView');
const Choice = require('models/choice');
const Helpers = require('utils/helpers');


module.exports = Marionette.Behavior.extend({

    events: {
        'keypress input.new-choice': '_onKeypressNewChoiceInput',
        'paste input.new-choice': '_onPasteNewChoiceInput',
    },

    onBeforeShow: function() {
        this.choicesCollectionView = new ChoicesCollectionView({
            collection: this.view.model.choices,
        });
        
        this.view.showChildView('choicesList', this.choicesCollectionView);
    },

    _onKeypressNewChoiceInput: function(event) {
        if (!event.which) {
            // Do nothing when keypress is not a valid character
            return;
        }

        event.preventDefault();

        let newChoice = this.view.model.createNewChoice(String.fromCharCode(event.keyCode));
        this._changeFocusToNewChoice(newChoice);
    },

    _onPasteNewChoiceInput: function(event) {
        event.preventDefault();

        let text = (event.originalEvent || event).clipboardData.getData('text/html');
        let strippedText = $('<div></div>').append(text).text();

        let newChoice = this.view.model.createNewChoice(strippedText);
        this._changeFocusToNewChoice(newChoice);
    },

    _changeFocusToNewChoice: function(newChoice) {
        let childView = this.choicesCollectionView.children.findByModel(newChoice);

        // Ensure even if there's no input afterwards, Choice model will still trigger an update event
        childView._onKeyDownInput(Helpers.createDummyEvent());

        let $input = childView.$el.find('div.input');
        $input.focus();

        let range = document.createRange();
        range.selectNodeContents($input.get(0));
        range.collapse(false); // Move focus to end of range

        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    },

});
