const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');
const Config = require('utils/config');

const DateItemView = require('./types/dateView');
const EntryItemView = require('./types/entryView');
const SelectItemView = require('./types/selectView');
const MultiSelectItemView = require('./types/multiSelectView');
const RadioItemView = require('./types/radioView');
const PictureItemView = require('./types/pictureView');
const PluginItemView = require('./types/pluginView');
const PluginEntryItemView = require('./types/pluginEntryView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementItemView'),
    tagName: 'li',
    className: function () {
        return 'element element-type-' + Helpers.sluggify(this.model.get('element_type'));
    },

    regions: {
        'customAnswer': 'div.custom-answer'
    },

    ui: {
        'question': 'input.question',
        'required': 'input.required',
        'answer': 'input.answer',
        'image': 'input.image',
        'audio': 'input.audio',
        'color': 'input.color',
    },

    events: {
        'click a.delete': '_onDeleteElement',
        'click a.move-up': '_onMoveElementUp',
        'click a.move-down': '_onMoveElementDown',

        'keyup @ui.question': '_onFormUpdate',
        'change @ui.required': '_onFormUpdate',
        'keyup @ui.image': '_onFormUpdate',
        'keyup @ui.audio': '_onFormUpdate',
        'change @ui.color': '_onFormUpdate'
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
                throw new ReferenceError('Unrecognized element_type: ' + item.get('element_type'));
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

    _onFormUpdate: function(event) {
        const question = this.ui.question.val();
        const required = this.ui.required.is(':checked');
        const image = this.ui.image.val();
        const audio = this.ui.audio.val();
        const color = this.ui.color.val();

        this.model.debounceSave({
            question: question,
            required: required,
            image: image,
            audio: audio,
            color: color,
        });
    },

});
