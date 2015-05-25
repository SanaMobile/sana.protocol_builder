import Ember from 'ember';

export default Ember.ObjectController.extend({
  pages: function() {
    return this.get('model.pages').sortBy('displayIndex');
  }.property('model.pages'),

  actions: {
    addElement: function(page, selectedIndex) {
      var targetIndex = selectedIndex + 1;
      var elements = page.get('elements');
      var elementsToBePushed = elements.filter(function(element) {
        return element.get('displayIndex') >= targetIndex;
      });

      elementsToBePushed.forEach(function(element) {
        element.incrementProperty('displayIndex');
        element.save();
      });

      var elementInfo = {
        page: page,
        displayIndex: targetIndex
      };

      this.send('showModal', 'add-element-modal', elementInfo);
    },
    addPage: function(selectedIndex) {
      var targetIndex = selectedIndex + 1;
      var pages = this.get('model.pages');
      var pagesToBePushed = pages.filter(function(page) {
        return page.get('displayIndex') >= targetIndex;
      });

      pagesToBePushed.forEach(function(page) {
        page.incrementProperty('displayIndex');
        page.save();
      });

      var newPage = this.store.createRecord('page', {
        procedure: this.get('model'),
        displayIndex: targetIndex
      });

      newPage.save();
    }
  }
});
