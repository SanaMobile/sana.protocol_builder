let Procedure       = require('models/procedure_model');
let DebugInfo       = require('./section_debug_info');
let ConditionEditor = require('./section_condition');
let ElementsEditor  = require('./section_elements');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/procedures_builder/page_details/layout'),

    regions: {
        debug_info: 'section#debug-info',
        condition_editor: 'section#conditions',
        elements_editor: 'section#elements',
    },

    templateHelpers: {
        DEBUG: DEBUG,
    },

    initialize: function() {
        this.debug_info = new DebugInfo();
        this.condition_editor = new ConditionEditor();
        this.elements_editor = new ElementsEditor();

        let self = this;
        this.model.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT_KEY, function(page_model) {
            self.set_visibility();
            self.debug_info.set_model(page_model);
            self.condition_editor.set_model(page_model);
            self.elements_editor.set_model(page_model);
        });
    },

    onBeforeShow: function() {
        this.set_visibility();
        this.showChildView('debug_info', this.debug_info);
        this.showChildView('condition_editor', this.condition_editor);
        this.showChildView('elements_editor', this.elements_editor);
    },

    set_visibility: function() {
        if (this.model.active_page_id) {
            this.$el.show();
        } else {
            this.$el.hide();
        }
    },

});
