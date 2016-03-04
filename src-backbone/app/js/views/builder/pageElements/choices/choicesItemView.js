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
        'keyup @ui.input': '_onKeyUpInput',
        'paste @ui.input': '_onPasteInput',
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

    saveChoice: function() {
        let text = this.ui.input.get(0).innerText;
        text = $.trim(text);
        this.model.debounceSave(text);
    },

    //--------------------------------------------------------------------------
    // Event handlers
    //--------------------------------------------------------------------------

    _onDeleteChoice: function(event) {
        this.model.destroy();
    },

    _onToggleDefault: function(event) {
        this.model.toggleDefault();
    },

    _onKeyUpInput: function(event) {
        this.saveChoice();
    },

    _onPasteInput: function(event) {
        event.preventDefault();

        let selection = window.getSelection();
        let range = selection.getRangeAt(0);
        range.deleteContents();

        let text = (event.originalEvent || event).clipboardData.getData('text');
        let lines = text.split('\n');
        let textNode = null;
        for (var i = lines.length - 1; i >= 0; i--) {
            textNode = document.createTextNode(lines[i]);
            range.insertNode(textNode);
            range.insertNode(document.createElement('br'));
        }

        range = range.cloneRange();
        range.setStartAfter(textNode);
        range.collapse(true); // Move focus to beginning of textNode
        selection.removeAllRanges();
        selection.addRange(range);

        this.saveChoice();
    },

});
