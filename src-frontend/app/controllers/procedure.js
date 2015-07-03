import Ember from 'ember';
import ENV from 'src-frontend/config/environment';

export default Ember.Controller.extend({
    pages: function() {
        return this.get('model.pages').sortBy('displayIndex');
    }.property('model.pages.@each.displayIndex'),

    actions: {
        addPage: function(selectedIndex) {
            var procedure = this.get('model');

            var newPage = this.store.createRecord('page', {
                procedure: procedure,
                displayIndex: selectedIndex
            });

            newPage.save().then(function() {
                procedure.get('pages').reload();
            });
        },

        editPage: function(page) {
            this.send('showModal', 'edit-page-modal', page);
        },

        deletePage: function(page) {
            page.deleteRecord();
            page.save();
        },

        updateSortOrder: function(pageModels) {
            var ctx = this;
            var onSuccess = function(data) {
                data.forEach(function(page) {
                    ctx.store.push('page', ctx.store.normalize('page', page));
                });
            };

            Ember.$.ajax({
                type: 'PATCH',
                url: ENV.APP.API_PAGE_BULK,
                data: JSON.stringify(pageModels),
                success: onSuccess
            });
        },
        generateProtocol: function() {
            var filename = this.get('model.title') + '.xml';

            Ember.$.ajax({
                type: 'GET',
                url: ENV.APP.API_PROCEDURE_URL + this.get('model.id') + ENV.APP.API_GENERATE,
                success: function(data) {
                    var blob = new Blob([(new XMLSerializer()).serializeToString(data)], { type: 'text/xml' });
                    var url = window.URL.createObjectURL(blob);

                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.setAttribute('id', 'generate-trigger');
                    a.href = url;
                    a.download = filename;
                    a.click();

                    window.URL.revokeObjectURL(url);
                    Ember.$('#generate-trigger').remove();
                }
            });
        }
    }
});
