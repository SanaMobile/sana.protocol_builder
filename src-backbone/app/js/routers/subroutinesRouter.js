const SubroutineController = require('controllers/subroutinesController');

module.exports = Marionette.AppRouter.extend({

    constructor : function (options) {
        this.controller = new SubroutineController(options);
        Marionette.AppRouter.prototype.constructor.call(this, options);
    },

    appRoutes: {
        'subroutines': 'routeSubroutines',
    },

});
