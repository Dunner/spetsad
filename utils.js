

var utils = {

  randomID: function(prepend) {
    return prepend + Math.random().toString(36).substr(2, 9);
  }

};

module.exports = utils;