const App     = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');


module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/builderSelectVersionView'),
    tagName: 'option',
    className: 'procedure',

    initialize: function(options){
        this.selectedVersion = options.selectedVersion;
    },

    onRender: function() {
        this.$el.show();
        this.$el.val(this.model.get('id'));
        if (this.selectedVersion == this.model.get('id')) {
            this.$el.attr("selected", "selected");
        }
    },
});
