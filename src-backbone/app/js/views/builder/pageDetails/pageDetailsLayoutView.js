let Procedure       = require('models/procedure');
let DebugInfo       = require('./debugLayoutView');
let ConditionEditor = require('./conditionLayoutView');
let ElementsEditor  = require('./elementsLayoutView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageDetails/pageDetailsLayoutView'),

    regions: {
        debugInfo: 'section#debug-info',
        conditionEditor: 'section#conditions',
        elementsEditor: 'section#elements',
    },

    templateHelpers: {
        DEBUG: DEBUG,
    },

    initialize: function() {
        this.debugInfo = new DebugInfo();
        this.conditionEditor = new ConditionEditor();
        this.elementsEditor = new ElementsEditor();

        let self = this;
        this.model.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT, function(page) {
            self._setVisibility();
            self.debugInfo.setPage(page);
            self.conditionEditor.setPage(page);
            self.elementsEditor.setPage(page);
        });
    },

    onBeforeShow: function() {
        this._setVisibility();
        this.showChildView('debugInfo', this.debugInfo);
        this.showChildView('conditionEditor', this.conditionEditor);
        this.showChildView('elementsEditor', this.elementsEditor);
    },

    _setVisibility: function() {
        if (this.model.activePageId) {
            this.$el.show();
        } else {
            this.$el.hide();
        }
    },

});
