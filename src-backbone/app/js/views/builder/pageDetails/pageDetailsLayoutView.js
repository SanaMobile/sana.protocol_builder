const Config = require('utils/config');
const Procedure = require('models/procedure');
const ConditionEditor = require('./conditionLayoutView');
const ElementsEditor = require('./elementsLayoutView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageDetails/pageDetailsLayoutView'),

    regions: {
        conditionEditor: 'section#conditions',
        elementsEditor: 'section#elements',
    },

    initialize: function() {
        this.conditionEditor = new ConditionEditor();
        this.elementsEditor = new ElementsEditor();

        let self = this;
        this.model.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT, function(page) {
            console.info('ACTIVE_PAGE_CHANGE_EVENT', page);
            self._setVisibility();
            self.conditionEditor.setPage(page);
            self.elementsEditor.setPage(page);
        });
    },

    onBeforeShow: function() {
        this._setVisibility();
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
