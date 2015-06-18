import DS from 'ember-data';
import DRFSerializer from './drf';

export default DRFSerializer.extend(DS.EmbeddedRecordsMixin, {
    serialize: function(snapshot, options) {
        var json = this._super(snapshot, options);

        if (!json.pages) {
            json.pages = [];
        }

        return json;
    }
});
