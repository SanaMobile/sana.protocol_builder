const ConditionalNodeView = require('./conditionalNodeView');
const ShowIf = require('models/conditionals/showIf');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageDetails/pageConditions/showIfItemView'),

    regions: {
        'main': 'div.show-if'
    },

    modelEvents: {
        'update': 'render',
    },

    onRender: function() {
        let rootNode = this.model.rootConditionalNode;

        if (rootNode) {
            this.showChildView('main', new ConditionalNodeView({ 
                model: rootNode,
            }));
        } else {
            this.getRegion('main').reset();
        }
    },

});
