

var utils = {

  randomID: function(prepend) {
    return prepend + Math.random().toString(36).substr(2, 9);
  },

  isInt: function(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  },

  //does rectangle a intersect with rectangle b
  intersects: function (a, b) {

    if (a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0) {
      return false;
    }

    return !(a.right < b.x || a.bottom < b.y || a.x > b.right || a.y > b.bottom);

  }
};

module.exports = utils;