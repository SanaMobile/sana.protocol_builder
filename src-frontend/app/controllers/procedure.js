import Ember from 'ember';

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

        updateSortOrder: function(indices) {
            this.beginPropertyChanges();

            this.get('model.pages').forEach(function(page) {
                var index = indices[page.get('id')];
                page.set('displayIndex', index);
                page.save();
            });

            this.endPropertyChanges();
        }
    }
});
