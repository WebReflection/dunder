var dunder;
if (!dunder) {
  dunder = (function(Object) {
    'use strict';
    var
      getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
      getPrototypeOf = Object.getPrototypeOf,
      getOwnPropertyNames = Object.getOwnPropertyNames,
      defineProperty = Object.defineProperty,
      create = Object.create,
      ObjectPrototype = Object.prototype,
      magic = '__proto__',
      length = 'length',
      freed = false,
      dunder,
      free,
      tmp;
    if (magic in ObjectPrototype) {
      try {
        tmp = getOwnPropertyDescriptor(
          ObjectPrototype,
          magic
        ).set;
        dunder = function dunder(object, proto) {
          if (arguments[length] === 1) {
            return getPrototypeOf(object);
          }
          tmp.call(object, proto);
          return object;
        };
        // test it
        dunder({}, ObjectPrototype);
        // it worked so we could get rid of __proto__
        free = function () {
          return freed || (
            freed = delete ObjectPrototype[magic]
          );
        };
        // will work only in modern browsers
      } catch (e) {
        // this will work on "older" mobile
        dunder = function dunder(object, proto) {
          if (arguments[length] === 1) {
            return object[magic];
          }
          object[magic] = proto;
          return object;
        };
      }
    } else {
      // IE < 11
      tmp = function (original, current) {
        var
          keys = getOwnPropertyNames(original),
          len = keys[length],
          key;
        if (keys.indexOf(length) < 0) {
          while (len--) {
            key = keys[len];
            defineProperty(
              current,
              key,
              getOwnPropertyDescriptor(
                original,
                key
              )
            );
          }
        } else {
          keys.push.call(current, original);
        }
        return current;
      };
      dunder = function dunder(object, proto) {
        if (arguments[length] === 1) {
          return getPrototypeOf(object);
        }
        return tmp(object, create(proto));
      };
    }
    dunder.free = free || function () {
      return false;
    };
    return dunder;
  }(Object));
}