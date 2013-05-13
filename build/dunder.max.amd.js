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
return dunder;
});