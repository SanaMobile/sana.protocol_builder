module.exports = function() {
    this._map = new Map();

    this.get = function(key) {
        let existing = this._map.get(key);
        return existing ? existing.item : undefined;
    };

    this.has = function(key) {
        return this._map.has(key);
    };

    this.set = function(key, value) {
        if (this._map.has(key)) {
            let existing = this._map.get(key);
            existing.counter++;
        } else {
            this._map.set(key, {
                counter: 1,
                item: value
            });
        }
    };

    this.delete = function(key) {
        if (!this._map.has(key)) {
            return;
        }

        let existing = this._map.get(key);
        existing.counter--;

        if (existing.counter === 0) {
            this._map.delete(key);
        }
    };

    this.clear = function() {
        this._map.clear();
    };

    this.values = function() {
        return this._map.values();
    };
};
