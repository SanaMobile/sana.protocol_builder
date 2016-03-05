const Config = require('utils/config');


module.exports = Marionette.CompositeView.extend({

    template: require('templates/builder/pageDetails/pageConditions/showIfsCompositeView'),
    childView: require('./showIfItemView'),
    childViewContainer: 'div#condition-editor',

    ui: {
        'showConditionToggle': 'input#show-page-conditionally',
    },

    events: {
        'change @ui.showConditionToggle': '_onToggleShowCondition',
    },

    templateHelpers: function() {
        return {
            pageHasConditions: this.model && this.model.showIfs.length > 0,
        };
    },

    initialize: function () {
        if (!this.model) {
            return;
        }

        this.collection = this.model.showIfs;
        this.listenTo(this.collection, 'update', this.render);
    },

    _onToggleShowCondition: function(event) {
        if (this.ui.showConditionToggle.is(':checked')) {
            this.model.createNewCriteria();
        } else {
            this.model.clearCriteria();
        }
    },

});
