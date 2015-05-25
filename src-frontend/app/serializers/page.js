import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  serialize: function(snapshot, options) {
    var json = this._super(snapshot, options);

    if (!json.elements) {
      json.elements = [];
    }

    return json;
  }
});
