const Config = require('utils/config');
const Procedure = require('models/procedure');
const SortableBehavior = require('behaviors/sortableBehavior');
const ShowIfsEditor = require('./pageConditions/showIfsCompositeView');
const ElementsEditor = require('./pageElements/elementsCompositeView');
const ElementCreator = require('./pageElements/elementCreatorView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageDetails/pageDetailsLayoutView'),

    regions: {
        showIfsEditor: 'section#show-ifs',
        elementsEditor: 'section#elements',
        elementCreator: 'section#element-creator',
    },

    templateHelpers: function() {
        let activePage = this.model.getActivePage();

        return {
            pageCanHaveConditions: activePage && activePage.canHaveConditions(),
        };
    },

    initialize: function() {
        let self = this;

        this.model.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT, function(page) {
            self.render();
        });

        this.model.pages.on(SortableBehavior.ON_SORT_EVENT, function() {
            self.render();
        });
    },

    onRender: function() {
        if (this.model.activePageId) {
            this.$el.show();
        } else {
            this.$el.hide();
        }

        let activePage = this.model.getActivePage();

        if (activePage && activePage.canHaveConditions()) {
            this.showChildView('showIfsEditor', new ShowIfsEditor({ model: activePage }));
        } else {
            this.getRegion('showIfsEditor').reset();
        }

        if (activePage) {
            this.showChildView('elementsEditor', new ElementsEditor({ model: activePage }));
        } else {
            this.getRegion('elementsEditor').reset();
        }

        if (activePage) {
            this.showChildView('elementCreator', new ElementCreator({ model: activePage }));
        } else {
            this.getRegion('elementCreator').reset();
        }
    },

});
