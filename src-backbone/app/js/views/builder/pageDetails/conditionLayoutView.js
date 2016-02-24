const Config = require('utils/config');
const ConditionNodeView = require('views/builder/pageConditions/conditionalNodeView');
const ShowIfsCollectionView = require('views/builder/pageConditions/showIfsCollectionView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageDetails/conditionLayoutView'),

    regions: {
        'conditionEditor': 'div#condition-editor',
    },

    ui: {
        'showConditionToggle': 'input#show-page-conditionally',
    },

    events: {
        'change @ui.showConditionToggle': '_onToggleShowCondition',
    },

    templateHelpers: function() {
        return {
            showPageConditionally: this.model && this.model.showIfs.length > 0,
        };
    },

    initialize: function () {
        if (!this.model) {
            return;
        }

        this.listenTo(this.model.showIfs, 'update', this.render);
    },

    onRender: function() {
        console.debug('conditionLayoutView render()');

        if (this.model) {
            this.showChildView('conditionEditor', new ShowIfsCollectionView({
                collection: this.model.showIfs,
            }));
        } else {
            this.getRegion('conditionEditor').reset();
        }
    },

    _onToggleShowCondition: function(event) {
        if (this.ui.showConditionToggle.is(':checked')) {
            this.model.createNewCriteria();
        } else {
            this.model.clearCriteria();
        }
    },

});
