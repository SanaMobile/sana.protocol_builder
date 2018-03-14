const ConceptsController = require('controllers/conceptsController');


module.exports = Marionette.AppRouter.extend({

    constructor : function (options) {
        this.controller = new ConceptsController(options);
        Marionette.AppRouter.prototype.constructor.call(this, options);
    },

    appRoutes: {
        'concepts/uploader': 'routeUploader',
        'concepts/manager': 'routeManager',
    },

});
