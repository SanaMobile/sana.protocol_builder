let App     = require('utils/sanaAppInstance');
let Helpers = require('utils/helpers');
const Config = require('utils/config');

let DateItemView        = require('./types/dateView');
let EntryItemView       = require('./types/entryView');
let SelectItemView      = require('./types/selectView');
let MultiSelectItemView = require('./types/multiSelectView');
let RadioItemView       = require('./types/radioView');
let PictureItemView     = require('./types/pictureView');
let PluginItemView      = require('./types/pluginView');
let PluginEntryItemView = require('./types/pluginEntryView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageElements/elementItemView'),
    tagName: 'li',
    className: function () {
        return 'element element-type-' + Helpers.sluggify(this.model.get('element_type'));
    },

    regions: {
        'customAnswer': 'div.form-group.custom-answer'
    },

    ui: {
        'eid': 'input.eid',
        'concept': 'input.concept',
        'question': 'input.question',
        'required': 'input.required',
        'answer': 'input.answer',
        'image': 'input.image',
        'audio': 'input.audio',
        'action': 'input.action',
        'mimeType': 'input.mime-type',
    },

    events: {
        'click a.delete': '_onDeleteElement',
        'click a.move-up': '_onMoveElementUp',
        'click a.move-down': '_onMoveElementDown',

        'keyup @ui.eid': '_onFormUpdate',
        'keyup @ui.concept': '_onFormUpdate',
        'keyup @ui.question': '_onFormUpdate',
        'change @ui.required': '_onFormUpdate',
        'keyup @ui.image': '_onFormUpdate',
        'keyup @ui.audio': '_onFormUpdate'
    },

    childEvents: {
        'update_answer': '_onUpdateAnswer',
        'update_action': '_onPluginViewUpdate',
        'update_mimeType': '_onPluginViewUpdate',
    },

    onBeforeShow: function() {
        let ChildViewClass = this._getChildViewClass();
        this.showChildView('customAnswer', new ChildViewClass({ model: this.model }));
    },

    _getChildViewClass: function() {
        switch (this.model.get('element_type')) {
            case 'DATE':          return DateItemView;
            case 'ENTRY':         return EntryItemView;
            case 'SELECT':        return SelectItemView;
            case 'MULTI_SELECT':  return MultiSelectItemView;
            case 'RADIO':         return RadioItemView;
            case 'PICTURE':       return PictureItemView;
            case 'PLUGIN':        return PluginItemView;
            case 'ENTRY_PLUGIN':  return PluginEntryItemView;
            default: {
                let errorMessage = 'Unrecognized element_type: ' + item.get('element_type');
                console.error(errorMessage);
                throw new ReferenceError(errorMessage);
            }
        }
    },

    _onDeleteElement: function(event) {
        event.preventDefault();

        let self = this;
        this.$el.fadeOut('fast', function() {
            self.model.destroy({
                wait: true, // Wait for server response before removing from collection
                success: function() {
                    console.info('Deleted Element', self.model.get('id'));
                },
                error: function(model, response, options) {
                    console.warn('Failed to delete Element', self.model.get('id'), response.responseJSON);
                    App().RootView.showNotification('Failed to delete Element!');
                    self.$el.fadeIn();
                },
            });
        });
    },

    _onMoveElementUp: function(event) {
        this.model.collection.moveUp(this.model);
    },

    _onMoveElementDown: function(event) {
        this.model.collection.moveDown(this.model);
    },

    _onFormUpdate: _.debounce(function() { this._saveToServer(); }, Config.INPUT_DELAY_BEFORE_SAVE),

    _onUpdateAnswer: function(childView) {
        if (this.ui.answer.length === 0) {
            this.ui.answer = childView.ui.answer;
        }

        this._onFormUpdate();
    },

    _onPluginViewUpdate: function(childView) {
        if (this.ui.action.length === 0) {
            this.ui.action = childView.ui.action;
        }

        if (this.ui.mimeType.length === 0) {
            this.ui.mimeType = childView.ui.mimeType;
        }

        this._onFormUpdate();
    },

    _saveToServer: function() {
        const eid = this.ui.eid.val();
        const concept = this.ui.concept.val();
        const question = this.ui.question.val();
        const required = this.ui.required.is(':checked');
        const answer = this.ui.answer.val() || '';
        const image = this.ui.image.val();
        const audio = this.ui.audio.val();
        const action = this.ui.action.val() || '';
        const mimeType = this.ui.mimeType.val() || '';

        let self = this;
        this.model.save({
            eid: eid,
            concept: concept,
            question: question,
            required: required,
            answer: answer,
            image: image,
            audio: audio,
            action: action,
            mime_type: mimeType,
        }, {
            beforeSend: function() {
                console.info('Saving Element', self.model.get('id'));
            },
            success: function() {
                console.info('Saved Element', self.model.get('id'));
            },
            error: function() {
                console.error('Unable to save Element changes', self.model.get('id'));
            },
        });
    },

});
