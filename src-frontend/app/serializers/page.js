import DRFSerializer from './drf';

export default DRFSerializer.extend({
  serialize: function(snapshot, options) {
    var json = this._super(snapshot, options);

    if (!json.elements) {
      json.elements = [];
    }

    return json;
  }
});
