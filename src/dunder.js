var dunder;
if (!dunder) {
  dunder = (function(Object) {
    'use strict';
    var
      getPrototypeOf = Object.getPrototypeOf,
      setPrototypeOf = Object.setPrototypeOf,
      getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
      getOwnPropertyNames = Object.getOwnPropertyNames,
      defineProperties = Object.defineProperties,
      create = Object.create,
      ObjectPrototype = Object.prototype,
      magic = '__proto__',
      length = 'length',
      freed = false,
      free = function () {
        return freed || (
          freed = delete ObjectPrototype[magic]
        );
      },
      dunder,
      tmp;
    if (setPrototypeOf) {
      dunder = function dunder(object, proto) {
        return arguments[length] === 1 ?
          getPrototypeOf(object) :
          setPrototypeOf(object, proto);
      };
    }
    else if (magic in ObjectPrototype) {
      try {
        tmp = getOwnPropertyDescriptor(
          ObjectPrototype,
          magic
        ).set;
        dunder = function dunder(object, proto) {
          return arguments[length] === 1 ?
            getPrototypeOf(object) :
            (tmp.call(object, proto), object);
        };
        // test it
        dunder({}, ObjectPrototype);
      } catch (e) {
        // this will work on "older" mobile
        dunder = function dunder(object, proto) {
          return arguments[length] === 1 ?
            object[magic] :
            ((object[magic] = proto), object);
        };
        free = null;
      }
    } else {
      // IE < 11
      tmp = function (original, current) {
        var
          descriptor = {},
          keys = getOwnPropertyNames(original),
          len = keys[length],
          i = 0,
          key;
        while (i < len) {
          key = keys[i];
          descriptor[key] = getOwnPropertyDescriptor(
            original,
            key
          );
        }
        return defineProperties(current, descriptor);
      };
      dunder = function dunder(object, proto) {
        return arguments[length] === 1 ?
          getPrototypeOf(object) :
          tmp(object, create(proto));
      };
      free = null;
    }
    dunder.free = free || function () {
      return false;
    };
    return dunder;
  }(Object));
}