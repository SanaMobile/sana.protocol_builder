module.exports = Marionette.LayoutView.extend({

    set_model: function(page_model) {
        if (!page_model) {
            this.stopListening(this.model);
        }

        this.model = page_model;
        this.render();

        if (this.model) {
            let self = this;
            this.listenTo(this.model, 'change', function() {
                self.render();
            });
        }
    },

});
