import Ember from 'ember';

export default Ember.Controller.extend({
  pages: function() {
    return this.get('model.pages').sortBy('index');
  }.property('model.pages'),

  actions: {
    addPage: function(selectedIndex) {
      var targetIndex = selectedIndex + 1;
      var pages = this.get('model.pages');
      var pagesToBePushed = pages.filter(function(page) {
        return page.get('index') >= targetIndex;
      });

      pagesToBePushed.forEach(function(page) {
        page.incrementProperty('index');
      });

      var newPage = this.store.createRecord('page', {
        index: targetIndex,
        procedure: this.get('model')
      });

      pages.addObject(newPage);
    }
  }
});
