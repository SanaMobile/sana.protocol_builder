var ProceduresController = require('./procedures_controller');
var controller = new ProceduresController();

module.exports = Marionette.AppRouter.extend({
  
    controller: controller,

    appRoutes: {
        'procedures': 'procedures',
    }

});
