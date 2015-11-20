module.exports = Marionette.LayoutView.extend({
  
    template: require('templates/info/info_layout'),

    regions: {
        info_area: 'article#info'
    }

});
