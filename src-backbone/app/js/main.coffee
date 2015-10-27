Setup = require('utils/setup')
Setup.load_libs()

$ ->

    # Create app
    SanaApp = require('sana_app')
    window.App = new SanaApp()
    window.App.start()
