let Procedure = require('models/procedure');


module.exports = Backbone.Collection.extend({

    model: Procedure,

    url: '/api/procedures?only_return_id=true',

    constructor: function(models, options) {
        this.setAscOrder(false);
        this.setComparatorKey('last_modified');
        this.comparator = this._comparator;

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    _comparator: function(a, b) {
        let ascComparator = function(l, r) {
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
        };

        return (this._isAsc ? 1 : -1) * ascComparator(a.get(this._comparatorKey), b.get(this._comparatorKey));
    },

    setComparatorKey: function(key) {
        console.info('Procedure Comparator Key: ' + key);
        this._comparatorKey = key;
    },

    setAscOrder: function(isAsc) {
        console.info('Procedure Sort Asc: ' + isAsc);
        this._isAsc = isAsc;
    },

    getComparatorKey: function() {
        return this._comparatorKey;
    },

    getOrderName: function() {
        return (this._isAsc ? 'asc' : 'desc');
    },

});
