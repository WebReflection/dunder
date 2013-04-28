/*!
Copyright (C) 2013 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
define(function(){
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
return dunder;
});