

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

  },
  
  pointDirection: function(object1, object2) {
    // Returns angle between two vectors
    return Math.atan2(object2.y - object1.y, object2.x - object1.x) * 180 / Math.PI;
  },
  
  pointDistance: function(pointA, pointB) {
    //Returns Distance between two points
    //pythagoras squareRoot(a*a + b*b = c*c) = c
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)); 
  }
};

module.exports = utils;