var Procedure = require('models/procedures_model');


module.exports = Backbone.Collection.extend({

    model: Procedure,

    url: '/procedures',

    constructor: function(options) {
        this.set_order_asc(false);
        this.set_comparator_key('last_modified');
        this.comparator = this._comparator;

        Backbone.Collection.prototype.constructor.call(this, options);
    },

    _asc_comparator: function(l, r) {
        // -1     if the first model should come before the second
        //  0     if they are of the same rank
        //  1     if the first model should come after

        if (l === void 0) return -1;
        if (r === void 0) return 1;

        if (l < r) {
            return -1;
        } else if (l > r) {
            return 1;
        } else {
            return 0;
        }
    },

    _comparator: function(a, b) {
        return (this._sort_asc ? 1 : -1) * this._asc_comparator(a.get(this._comparator_key), b.get(this._comparator_key));
    },

    set_comparator_key: function(key) {
        log.info('Procedure Comparator Key: ' + key);
        this._comparator_key = key;
    },

    set_order_asc: function(sort_asc) {
        log.info('Procedure Sort Asc: ' + sort_asc);
        this._sort_asc = sort_asc;
    },

    get_comparator_key: function() {
        return this._comparator_key;
    },

    get_order_name: function() {
        return (this._sort_asc ? "asc" : "desc");
    },

});
