module.exports = Marionette.LayoutView.extend({

    setPage: function(page) {
        if (!page) {
            this.stopListening(this.model);
        }

        this.model = page;
        this.render();

        if (this.model) {
            let self = this;
            this.listenTo(this.model, 'change', function() {
                self.render();
            });
        }
    },

});
