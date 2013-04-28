dunder
======
hot-swap inheritance for every engine

[![build status](https://secure.travis-ci.org/WebReflection/dunder.png)](http://travis-ci.org/WebReflection/dunder)

### API

  * `dunder(object:Object):Object|null` returns the object prototype
  * `dunder(object:Object, proto:Object|null):object|Object` returns an object that inherits from the second argument

If the engine supports a descriptor to set the prototype chain, or the `__proto__`, the object is not recreated, otherwise it's inherited and replicated on top using ES5+ descriptors for a uniformed behavior in IE10 and IE9 too.

```javascript
// basics
var a = {}, b = {};
dunder(a) === Object.prototype; // true

// inline swap
a = dunder(a, b);
b.isPrototypeOf(a); // true
dunder(a) === b;    // true

// hot-swap Zepto.js like
var libObj = dunder(
  document.querySelectorAll(CSS),
  MyAwesomeLibrary.prototype
);
```

That is pretty much it, except you might decide to make the environment safe, if needed, invoking free.

```
'__proto__' in Object.prototype; // true
dunder.free();

// only in certain cases and if possible
'__proto__' in Object.prototype; // false
```

THe list of engines able to get rid of __proto__ as getter/setter is not known yet.

### Free From __proto__ Problems

There is an extra method to try to get rid of `__proto__` called `dunder.free()`, it returns a boolean if `delete Object.prototype.__proto__` was successful, which should be the case with most recent JS engines.