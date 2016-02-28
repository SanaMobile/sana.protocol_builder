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
        let self = this;
        this.model.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT, function(page) {
            console.info('ACTIVE_PAGE_CHANGE_EVENT', page);
            self.render();
        });
    },

    onRender: function() {
        if (this.model.activePageId) {
            this.$el.show();
        } else {
            this.$el.hide();
        }

        let activePage = this.model.pages.get(this.model.activePageId);
        this.showChildView('conditionEditor', new ConditionEditor({ model: activePage }));
        this.showChildView('elementsEditor', new ElementsEditor({ model: activePage }));
    },

});
