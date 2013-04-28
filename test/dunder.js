//remove:
var dunder = require('../build/dunder.node.js');
//:remove

wru.test([
  {
    name: "main",
    test: function () {
      wru.assert(typeof dunder == "function");
      var a = {}, b = {};
      a = dunder(a, b);
      wru.assert(b.isPrototypeOf(a));
    }
  }
]);
