var dunder;
if (!dunder) {
  dunder = (function(Object) {
    'use strict';
    var
      getPrototypeOf = Object.getPrototypeOf || function (object) {
        return object[magic];
      },
      setPrototypeOf = Object.setPrototypeOf,
      getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
      getOwnPropertyNames = Object.getOwnPropertyNames,
      defineProperty = Object.defineProperty,
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