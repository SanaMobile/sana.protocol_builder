module.exports = Backbone.Model.extend({
    
    // Possible types: 
    //  'success'   green
    //  'info'      blue
    //  'warning'   yellow
    //  'danger'    red

    defaults: {
        alertType: 'danger',
        title: 'An unknown error has occurred!', // Bold
        desc: 'Please try again later.', // Rest of alert body
        timeout: 5, // Seconds
    },

});
