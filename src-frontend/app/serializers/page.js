import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  serialize: function(snapshot, options) {
    var json = this._super(snapshot, options);

    if (json.elements === undefined) {
      json.elements = [];
    }

    return json;
  }
});
