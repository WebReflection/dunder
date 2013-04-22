//remove:
var main = require('../build/dunder.node.js');
//:remove

wru.test([
  {
    name: "main",
    test: function () {
      wru.assert(typeof main == "function");
      // wru.assert(0);
    }
  }
]);
