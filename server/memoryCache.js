module.exports = function () {
    var cache = {};
    return {
        get: function (key) {
            return cache[key];
        },
        set: function (key, val) {
            console.log("Object " + key + " saved in memory");
            cache[key] = val;
        }
    }
}();