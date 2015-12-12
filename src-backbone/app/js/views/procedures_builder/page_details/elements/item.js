let Helpers = require('utils/helpers');

let DateItemView        = require('./item_date');
let EntryItemView       = require('./item_entry');
let SelectItemView      = require('./item_select');
let MultiSelectItemView = require('./item_multi_select');
let RadioItemView       = require('./item_radio');
let PictureItemView     = require('./item_picture');
let PluginItemView      = require('./item_plugin');
let PluginEntryItemView = require('./item_plugin_entry');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/procedures_builder/page_details/elements/item'),
    tagName: 'li',
    className: function () {
        return 'element element-type-' + Helpers.sluggify(this.model.get('element_type'));
    },

    regions: {
        'custom_answer': 'div.form-group.custom-answer'
    },

    ui: {
        'concept': 'input.concept',
        'question': 'input.question',
        'required': 'input.required',
        'image': 'input.image',
        'audio': 'input.audio',
    },

    events: {
        'click a.delete': 'delete_element',
        'click a.move-up': 'move_element_up',
        'click a.move-down': 'move_element_down',

        'keyup @ui.concept': 'form_update',
        'keyup @ui.question': 'form_update',
        'change @ui.required': 'form_update',
        'keyup @ui.image': 'form_update',
        'keyup @ui.audio': 'form_update',
    },

    onBeforeShow: function() {
        let ChildViewClass = this.get_child_view_class();
        this.showChildView('custom_answer', new ChildViewClass());
    },

    get_child_view_class: function() {
        switch (this.model.get('element_type')) {
            case 'DATE':          return DateItemView;
            case 'ENTRY':         return EntryItemView;
            case 'SELECT':        return SelectItemView;
            case 'MULTI_SELECT':  return MultiSelectItemView;
            case 'RADIO':         return RadioItemView;
            case 'PICTURE':       return PictureItemView;
            case 'PLUGIN':        return PluginItemView;
            case 'ENTRY_PLUGIN':  return PluginEntryItemView;
            default:
                console.error('Unrecognized element_type', item.get('element_type'));
        }
    },

    delete_element: function(event) {
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
                    self.$el.fadeIn();
                    // TODO show error alert
                },
            });
        });
    },

    move_element_up: function(event) {
        this.model.collection.move_up(this.model);
    },

    move_element_down: function(event) {
        this.model.collection.move_down(this.model);
    },

    form_update: function (event) {
        let concept = this.ui.concept.val();
        let question = this.ui.question.val();
        let required = this.ui.required.is(':checked');
        let image = this.ui.image.val();
        let audio = this.ui.audio.val();

        let self = this;
        let save_to_server = function() {
            self.model.save({
                concept: concept,
                question: question,
                required: required,
                image: image,
                audio: audio,
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
        };

        // Wait until input is finished before saving to server to avoid sending too many requests
        if (this._timer_id !== undefined) {
            clearTimeout(this._timer_id);
            this._timer_id = undefined;
        }
        this._timer_id = setTimeout(save_to_server, Config.INPUT_DELAY_BEFORE_SAVE);
    },

});
