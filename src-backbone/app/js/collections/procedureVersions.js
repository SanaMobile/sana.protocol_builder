let Procedure = require('models/procedure');


module.exports = Backbone.Collection.extend({

    model: Procedure,

    url: function() {
        return '/api/procedures/get_versions?id=' + this.id + '&only_return_id=true';
    },

    initialize: function (models, options) {
        this.id = options.id;
    },

    constructor: function(models, options) {
        this.setAscOrder(false);
        this.setComparatorKey('version');
        this.comparator = this._comparator;

        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    _comparator: function(a, b) {
        let ascComparator = function(l, r) {
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
