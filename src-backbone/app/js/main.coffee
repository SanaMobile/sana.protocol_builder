global.DEBUG = true
require('utils/setup').load_libs()

$ ->
    # Create app
    SanaApp = require('sana_app')
    window.App = new SanaApp()
    window.App.init()
    window.App.start()
