const Config = require('utils/config');
const Helpers = require('utils/helpers');


module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageElements/choices/choicesItemView'),
    tagName: 'li',
    className: 'choice',

    ui: {
        defaultAnswerToggle: 'span.default-answer-toggle',
        deleteButton: 'span.delete-choice',
        input: 'div.input',
    },

    events: {
        'click @ui.deleteButton': '_onDeleteChoice',
        'click @ui.defaultAnswerToggle': '_onToggleDefault',
        'paste @ui.input': '_onPasteInput',
        'keydown @ui.input': '_onKeyDownInput', // Gets called first (events get added like a stack?)
    },

    templateHelpers: function () {
        return {
            defaultAnswerTooltip: this.model.get('isDefault') ?
                                  i18n.t("Click here to remove this choice as a default answer") :
                                  i18n.t("Click here to set this choice as a default answer"),
        };
    },

    initialize: function() {
        let self = this;
        this.listenTo(this.model, 'change:isDefault', function() {
            self.render();
        });
    },

    _onDeleteChoice: function(event) {
        this.model.destroy();
    },

    _onToggleDefault: function(event) {
        this.model.toggleDefault();
    },

    _onPasteInput: function(event) {
        event.preventDefault();

        let text = (event.originalEvent || event).clipboardData.getData('text');
        let strippedText = $('<div></div>').append(text).text();

        if (window.getSelection) {
            let selection = window.getSelection();

            if (selection.getRangeAt && selection.rangeCount) {
                let range = selection.getRangeAt(0);
                let textNode = document.createTextNode(strippedText);
                range.deleteContents();
                range.insertNode(textNode);

                range = range.cloneRange();
                range.setStartAfter(textNode);
                range.collapse(true); // Move focus to beginning of textNode
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = strippedText;
        } else {
            console.warn('Failed to paste input');
        }

        this._saveText();
    },

    _onKeyDownInput: _.debounce(this._saveText(), Config.INPUT_DELAY_BEFORE_SAVE),

    _saveText: function() {
        if (this.isDestroyed) {
            // In case this callback gets triggered after the view is destroyed
            return;
        }

        let text = this.ui.input.text(); // TODO doesn't get newlines in text
        this.model.set({
            text: text,
        }, {
            silent: true, // Do not call Choice.save() because it doesn't have an API endpoint
        });

        // Always trigger even if there's no change because sometimes we may create
        // a Choice by typing 1 letter and stop. This results in just an 'add' event
        // and no 'change' event. Thus it won't trigger the Element.save() method
        // listener in element.js because Element only listens for 'change' and
        // 'destroy' events
        this.model.trigger('change', this.model);
    },

});
