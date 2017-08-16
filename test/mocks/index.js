/**
 *
 * @return {Object}
 */
export const localStorageMock = function localStorageMock() {
  return {
    _items: {},
    length: 0,
    clear() {
      this._items = {};
    },
    getItem(key) {
      return this._items[key];
    },
    removeItem(key) {
      let hasKey = false;

      if (this._items[key]) {
        hasKey = true;
        delete this._items[key];
        this.length = Object.keys(this._items).length;
      }

      return hasKey;
    },
    setItem(key, value) {
      this._items[key] = value;
      this.length = Object.keys(this._items).length;
      return true;
    },
  };
};

/**
 *
 * @return {Object}
 */
export const redisMock = function redisMock() {
  return {
    _items: {},
    dbsize(callback) {
      callback(null, Object.keys(this._items).length);
    },
    del(key, callback) {
      let hasKey = false;

      if (this._items[key]) {
        hasKey = true;
        delete this._items[key];
      }

      callback(null, hasKey);
    },
    exists(key, callback) {
      callback(null, !!this._items[key]);
    },
    flushdb(callback) {
      this._items = {};
      callback(null, true);
    },
    get(key, callback) {
      callback(null, this._items[key]);
    },
    on(name, callback) {
      callback();
    },
    set(key, value, callback) {
      this._items[key] = value;
      callback(null, true);
    },
  };
};
