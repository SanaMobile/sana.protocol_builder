const Config = require('utils/config');
const Procedure = require('models/procedure');
const ShowIfsEditor = require('./pageConditions/showIfsCompositeView');
const ElementsEditor = require('./pageElements/elementsCompositeView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageDetails/pageDetailsLayoutView'),

    regions: {
        showIfsEditor: 'section#show-ifs',
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
        this.showChildView('showIfsEditor', new ShowIfsEditor({ model: activePage }));
        this.showChildView('elementsEditor', new ElementsEditor({ model: activePage }));
    },

});
