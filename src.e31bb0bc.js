// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../node_modules/@ffmpeg/ffmpeg/src/config.js":[function(require,module,exports) {
module.exports = {
  defaultArgs: [
  /* args[0] is always the binary path */
  './ffmpeg',
  /* Disable interaction mode */
  '-nostdin',
  /* Force to override output file */
  '-y',
  /* Not to output banner */
  '-hide_banner'],
  baseOptions: {
    /* Flag to turn on/off log messages in console */
    log: false,

    /*
     * Custom logger to get ffmpeg.wasm output messages.
     * a sample logger looks like this:
     *
     * ```
     * logger = ({ type, message }) => {
     *   console.log(type, message);
     * }
     * ```
     *
     * type can be one of following:
     *
     * info: internal workflow debug messages
     * fferr: ffmpeg native stderr output
     * ffout: ffmpeg native stdout output
     */
    logger: function logger() {},

    /*
     * Progress handler to get current progress of ffmpeg command.
     * a sample progress handler looks like this:
     *
     * ```
     * progress = ({ ratio }) => {
     *   console.log(ratio);
     * }
     * ```
     *
     * ratio is a float number between 0 to 1.
     */
    progress: function progress() {},

    /*
     * Path to find/download ffmpeg.wasm-core,
     * this value should be overwriten by `defaultOptions` in
     * each environment.
     */
    corePath: ''
  }
};
},{}],"../node_modules/@ffmpeg/ffmpeg/src/utils/log.js":[function(require,module,exports) {
var logging = false;

var customLogger = function customLogger() {};

var setLogging = function setLogging(_logging) {
  logging = _logging;
};

var setCustomLogger = function setCustomLogger(logger) {
  customLogger = logger;
};

var log = function log(type, message) {
  customLogger({
    type: type,
    message: message
  });

  if (logging) {
    console.log("[".concat(type, "] ").concat(message));
  }
};

module.exports = {
  logging: logging,
  setLogging: setLogging,
  setCustomLogger: setCustomLogger,
  log: log
};
},{}],"../node_modules/@ffmpeg/ffmpeg/src/utils/parseProgress.js":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var duration = 0;

var ts2sec = function ts2sec(ts) {
  var _ts$split = ts.split(':'),
      _ts$split2 = _slicedToArray(_ts$split, 3),
      h = _ts$split2[0],
      m = _ts$split2[1],
      s = _ts$split2[2];

  return parseFloat(h) * 60 * 60 + parseFloat(m) * 60 + parseFloat(s);
};

module.exports = function (message, progress) {
  if (typeof message === 'string') {
    if (message.startsWith('  Duration')) {
      var ts = message.split(', ')[0].split(': ')[1];
      var d = ts2sec(ts);

      if (duration === 0 || duration > d) {
        duration = d;
      }
    } else if (message.startsWith('frame')) {
      var _ts = message.split('time=')[1].split(' ')[0];
      var t = ts2sec(_ts);
      progress({
        ratio: t / duration
      });
    } else if (message.startsWith('video:')) {
      progress({
        ratio: 1
      });
      duration = 0;
    }
  }
};
},{}],"../node_modules/@ffmpeg/ffmpeg/src/utils/parseArgs.js":[function(require,module,exports) {
module.exports = function (Core, args) {
  var argsPtr = Core._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);

  args.forEach(function (s, idx) {
    var buf = Core._malloc(s.length + 1);

    Core.writeAsciiToMemory(s, buf);
    Core.setValue(argsPtr + Uint32Array.BYTES_PER_ELEMENT * idx, buf, 'i32');
  });
  return [args.length, argsPtr];
};
},{}],"../node_modules/resolve-url/resolve-url.js":[function(require,module,exports) {
var define;
// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

void (function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory)
  } else if (typeof exports === "object") {
    module.exports = factory()
  } else {
    root.resolveUrl = factory()
  }
}(this, function() {

  function resolveUrl(/* ...urls */) {
    var numUrls = arguments.length

    if (numUrls === 0) {
      throw new Error("resolveUrl requires at least one argument; got none.")
    }

    var base = document.createElement("base")
    base.href = arguments[0]

    if (numUrls === 1) {
      return base.href
    }

    var head = document.getElementsByTagName("head")[0]
    head.insertBefore(base, head.firstChild)

    var a = document.createElement("a")
    var resolved

    for (var index = 1; index < numUrls; index++) {
      a.href = arguments[index]
      resolved = a.href
      base.href = resolved
    }

    head.removeChild(base)

    return resolved
  }

  return resolveUrl

}));

},{}],"../node_modules/@ffmpeg/ffmpeg/package.json":[function(require,module,exports) {
module.exports = {
  "name": "@ffmpeg/ffmpeg",
  "version": "0.9.4",
  "description": "FFmpeg WebAssembly version",
  "main": "src/index.js",
  "types": "src/index.d.ts",
  "directories": {
    "example": "examples"
  },
  "scripts": {
    "start": "node scripts/server.js",
    "build": "rimraf dist && webpack --config scripts/webpack.config.prod.js",
    "prepublishOnly": "npm run build",
    "lint": "eslint src",
    "wait": "rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js",
    "test": "npm-run-all -p -r start test:all",
    "test:all": "npm-run-all wait test:browser:ffmpeg test:node:all",
    "test:node": "node --experimental-wasm-threads --experimental-wasm-bulk-memory node_modules/.bin/_mocha --exit --bail --require ./scripts/test-helper.js",
    "test:node:all": "npm run test:node -- ./tests/*.test.js",
    "test:browser": "mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000",
    "test:browser:ffmpeg": "npm run test:browser -- -f ./tests/ffmpeg.test.html"
  },
  "browser": {
    "./src/node/index.js": "./src/browser/index.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"
  },
  "keywords": ["ffmpeg", "WebAssembly", "video"],
  "author": "Jerome Wu <jeromewus@gmail.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/ffmpegwasm/ffmpeg.wasm/issues"
  },
  "engines": {
    "node": ">=12.16.1"
  },
  "homepage": "https://github.com/ffmpegwasm/ffmpeg.wasm#readme",
  "dependencies": {
    "is-url": "^1.2.4",
    "node-fetch": "^2.6.1",
    "regenerator-runtime": "^0.13.7",
    "resolve-url": "^0.2.1"
  },
  "devDependencies": {
    "@babel/core": "^7.12.3",
    "@babel/preset-env": "^7.12.1",
    "@ffmpeg/core": "^0.8.2",
    "@types/emscripten": "^1.39.4",
    "babel-loader": "^8.1.0",
    "chai": "^4.2.0",
    "cors": "^2.8.5",
    "eslint": "^7.12.1",
    "eslint-config-airbnb-base": "^14.1.0",
    "eslint-plugin-import": "^2.22.1",
    "express": "^4.17.1",
    "mocha": "^8.2.1",
    "mocha-headless-chrome": "^2.0.3",
    "npm-run-all": "^4.1.5",
    "wait-on": "^5.2.0",
    "webpack": "^5.3.2",
    "webpack-cli": "^4.1.0",
    "webpack-dev-middleware": "^4.0.0"
  }
};
},{}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/@ffmpeg/ffmpeg/src/browser/defaultOptions.js":[function(require,module,exports) {
var process = require("process");
var resolveURL = require('resolve-url');

var _require = require('../../package.json'),
    devDependencies = _require.devDependencies;
/*
 * Default options for browser environment
 */


module.exports = {
  corePath: typeof process !== 'undefined' && undefined === 'development' ? resolveURL('/node_modules/@ffmpeg/core/dist/ffmpeg-core.js') : "https://unpkg.com/@ffmpeg/core@".concat(devDependencies['@ffmpeg/core'].substring(1), "/dist/ffmpeg-core.js")
};
},{"resolve-url":"../node_modules/resolve-url/resolve-url.js","../../package.json":"../node_modules/@ffmpeg/ffmpeg/package.json","process":"../node_modules/process/browser.js"}],"../node_modules/@ffmpeg/ffmpeg/src/browser/getCreateFFmpegCore.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var resolveURL = require('resolve-url');

var _require = require('../utils/log'),
    log = _require.log;

module.exports = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var _corePath, corePath, workerBlob;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _corePath = _ref.corePath;

            if (!(typeof window.createFFmpegCore === 'undefined')) {
              _context.next = 13;
              break;
            }

            log('info', 'fetch ffmpeg-core.worker.js script');
            corePath = resolveURL(_corePath);
            _context.next = 6;
            return fetch(corePath.replace('ffmpeg-core.js', 'ffmpeg-core.worker.js'));

          case 6:
            _context.next = 8;
            return _context.sent.blob();

          case 8:
            workerBlob = _context.sent;
            window.FFMPEG_CORE_WORKER_SCRIPT = URL.createObjectURL(workerBlob);
            log('info', "worker object URL=".concat(window.FFMPEG_CORE_WORKER_SCRIPT));
            log('info', "download ffmpeg-core script (~25 MB) from ".concat(corePath));
            return _context.abrupt("return", new Promise(function (resolve) {
              var script = document.createElement('script');

              var eventHandler = function eventHandler() {
                script.removeEventListener('load', eventHandler);
                log('info', 'initialize ffmpeg-core');
                resolve(window.createFFmpegCore);
              };

              script.src = corePath;
              script.type = 'text/javascript';
              script.addEventListener('load', eventHandler);
              document.getElementsByTagName('head')[0].appendChild(script);
            }));

          case 13:
            log('info', 'ffmpeg-core is loaded already');
            return _context.abrupt("return", Promise.resolve(window.createFFmpegCore));

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();
},{"resolve-url":"../node_modules/resolve-url/resolve-url.js","../utils/log":"../node_modules/@ffmpeg/ffmpeg/src/utils/log.js"}],"../node_modules/@ffmpeg/ffmpeg/src/browser/fetchFile.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var resolveURL = require('resolve-url');

var readFromBlobOrFile = function readFromBlobOrFile(blob) {
  return new Promise(function (resolve, reject) {
    var fileReader = new FileReader();

    fileReader.onload = function () {
      resolve(fileReader.result);
    };

    fileReader.onerror = function (_ref) {
      var code = _ref.target.error.code;
      reject(Error("File could not be read! Code=".concat(code)));
    };

    fileReader.readAsArrayBuffer(blob);
  });
};

module.exports = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_data) {
    var data, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = _data;

            if (!(typeof _data === 'undefined')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", new Uint8Array());

          case 3:
            if (!(typeof _data === 'string')) {
              _context.next = 16;
              break;
            }

            if (!/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(_data)) {
              _context.next = 8;
              break;
            }

            data = atob(_data.split(',')[1]).split('').map(function (c) {
              return c.charCodeAt(0);
            });
            /* From remote server/URL */

            _context.next = 14;
            break;

          case 8:
            _context.next = 10;
            return fetch(resolveURL(_data));

          case 10:
            res = _context.sent;
            _context.next = 13;
            return res.arrayBuffer();

          case 13:
            data = _context.sent;

          case 14:
            _context.next = 20;
            break;

          case 16:
            if (!(_data instanceof File || _data instanceof Blob)) {
              _context.next = 20;
              break;
            }

            _context.next = 19;
            return readFromBlobOrFile(_data);

          case 19:
            data = _context.sent;

          case 20:
            return _context.abrupt("return", new Uint8Array(data));

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();
},{"resolve-url":"../node_modules/resolve-url/resolve-url.js"}],"../node_modules/@ffmpeg/ffmpeg/src/browser/index.js":[function(require,module,exports) {
var defaultOptions = require('./defaultOptions');

var getCreateFFmpegCore = require('./getCreateFFmpegCore');

var fetchFile = require('./fetchFile');

module.exports = {
  defaultOptions: defaultOptions,
  getCreateFFmpegCore: getCreateFFmpegCore,
  fetchFile: fetchFile
};
},{"./defaultOptions":"../node_modules/@ffmpeg/ffmpeg/src/browser/defaultOptions.js","./getCreateFFmpegCore":"../node_modules/@ffmpeg/ffmpeg/src/browser/getCreateFFmpegCore.js","./fetchFile":"../node_modules/@ffmpeg/ffmpeg/src/browser/fetchFile.js"}],"../node_modules/@ffmpeg/ffmpeg/src/createFFmpeg.js":[function(require,module,exports) {
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _require = require('./config'),
    defaultArgs = _require.defaultArgs,
    baseOptions = _require.baseOptions;

var _require2 = require('./utils/log'),
    setLogging = _require2.setLogging,
    setCustomLogger = _require2.setCustomLogger,
    log = _require2.log;

var parseProgress = require('./utils/parseProgress');

var parseArgs = require('./utils/parseArgs');

var _require3 = require('./node'),
    defaultOptions = _require3.defaultOptions,
    getCreateFFmpegCore = _require3.getCreateFFmpegCore;

var NO_LOAD = Error('ffmpeg.wasm is not ready, make sure you have completed load().');

module.exports = function () {
  var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _baseOptions$defaultO = _objectSpread(_objectSpread(_objectSpread({}, baseOptions), defaultOptions), _options),
      logging = _baseOptions$defaultO.log,
      logger = _baseOptions$defaultO.logger,
      optProgress = _baseOptions$defaultO.progress,
      options = _objectWithoutProperties(_baseOptions$defaultO, ["log", "logger", "progress"]);

  var Core = null;
  var ffmpeg = null;
  var runResolve = null;
  var running = false;
  var progress = optProgress;

  var detectCompletion = function detectCompletion(message) {
    if (message === 'FFMPEG_END' && runResolve !== null) {
      runResolve();
      runResolve = null;
      running = false;
    }
  };

  var parseMessage = function parseMessage(_ref) {
    var type = _ref.type,
        message = _ref.message;
    log(type, message);
    parseProgress(message, progress);
    detectCompletion(message);
  };
  /*
   * Load ffmpeg.wasm-core script.
   * In browser environment, the ffmpeg.wasm-core script is fetch from
   * CDN and can be assign to a local path by assigning `corePath`.
   * In node environment, we use dynamic require and the default `corePath`
   * is `$ffmpeg/core`.
   *
   * Typically the load() func might take few seconds to minutes to complete,
   * better to do it as early as possible.
   *
   */


  var load = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var createFFmpegCore;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              log('info', 'load ffmpeg-core');

              if (!(Core === null)) {
                _context.next = 13;
                break;
              }

              log('info', 'loading ffmpeg-core');
              _context.next = 5;
              return getCreateFFmpegCore(options);

            case 5:
              createFFmpegCore = _context.sent;
              _context.next = 8;
              return createFFmpegCore({
                printErr: function printErr(message) {
                  return parseMessage({
                    type: 'fferr',
                    message: message
                  });
                },
                print: function print(message) {
                  return parseMessage({
                    type: 'ffout',
                    message: message
                  });
                },
                locateFile: function locateFile(path, prefix) {
                  if (typeof window !== 'undefined' && typeof window.FFMPEG_CORE_WORKER_SCRIPT !== 'undefined' && path.endsWith('ffmpeg-core.worker.js')) {
                    return window.FFMPEG_CORE_WORKER_SCRIPT;
                  }

                  return prefix + path;
                }
              });

            case 8:
              Core = _context.sent;
              ffmpeg = Core.cwrap('proxy_main', 'number', ['number', 'number']);
              log('info', 'ffmpeg-core loaded');
              _context.next = 14;
              break;

            case 13:
              throw Error('ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.');

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function load() {
      return _ref2.apply(this, arguments);
    };
  }();
  /*
   * Determine whether the Core is loaded.
   */


  var isLoaded = function isLoaded() {
    return Core !== null;
  };
  /*
   * Run ffmpeg command.
   * This is the major function in ffmpeg.wasm, you can just imagine it
   * as ffmpeg native cli and what you need to pass is the same.
   *
   * For example, you can convert native command below:
   *
   * ```
   * $ ffmpeg -i video.avi -c:v libx264 video.mp4
   * ```
   *
   * To
   *
   * ```
   * await ffmpeg.run('-i', 'video.avi', '-c:v', 'libx264', 'video.mp4');
   * ```
   *
   */


  var run = function run() {
    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    log('info', "run ffmpeg command: ".concat(_args.join(' ')));

    if (Core === null) {
      throw NO_LOAD;
    } else if (running) {
      throw Error('ffmpeg.wasm can only run one command at a time');
    } else {
      running = true;
      return new Promise(function (resolve) {
        var args = [].concat(_toConsumableArray(defaultArgs), _args).filter(function (s) {
          return s.length !== 0;
        });
        runResolve = resolve;
        ffmpeg.apply(void 0, _toConsumableArray(parseArgs(Core, args)));
      });
    }
  };
  /*
   * Run FS operations.
   * For input/output file of ffmpeg.wasm, it is required to save them to MEMFS
   * first so that ffmpeg.wasm is able to consume them. Here we rely on the FS
   * methods provided by Emscripten.
   *
   * Common methods to use are:
   * ffmpeg.FS('writeFile', 'video.avi', new Uint8Array(...)): writeFile writes
   * data to MEMFS. You need to use Uint8Array for binary data.
   * ffmpeg.FS('readFile', 'video.mp4'): readFile from MEMFS.
   * ffmpeg.FS('unlink', 'video.map'): delete file from MEMFS.
   *
   * For more info, check https://emscripten.org/docs/api_reference/Filesystem-API.html
   *
   */


  var FS = function FS(method) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    log('info', "run FS.".concat(method, " ").concat(args.map(function (arg) {
      return typeof arg === 'string' ? arg : "<".concat(arg.length, " bytes binary file>");
    }).join(' ')));

    if (Core === null) {
      throw NO_LOAD;
    } else {
      var ret = null;

      try {
        var _Core$FS;

        ret = (_Core$FS = Core.FS)[method].apply(_Core$FS, args);
      } catch (e) {
        if (method === 'readdir') {
          throw Error("ffmpeg.FS('readdir', '".concat(args[0], "') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')"));
        } else if (method === 'readFile') {
          throw Error("ffmpeg.FS('readFile', '".concat(args[0], "') error. Check if the path exists"));
        } else {
          throw Error('Oops, something went wrong in FS operation.');
        }
      }

      return ret;
    }
  };

  var setProgress = function setProgress(_progress) {
    progress = _progress;
  };

  var setLogger = function setLogger(_logger) {
    setCustomLogger(_logger);
  };

  setLogging(logging);
  setCustomLogger(logger);
  return {
    setProgress: setProgress,
    setLogger: setLogger,
    setLogging: setLogging,
    load: load,
    isLoaded: isLoaded,
    run: run,
    FS: FS
  };
};
},{"./config":"../node_modules/@ffmpeg/ffmpeg/src/config.js","./utils/log":"../node_modules/@ffmpeg/ffmpeg/src/utils/log.js","./utils/parseProgress":"../node_modules/@ffmpeg/ffmpeg/src/utils/parseProgress.js","./utils/parseArgs":"../node_modules/@ffmpeg/ffmpeg/src/utils/parseArgs.js","./node":"../node_modules/@ffmpeg/ffmpeg/src/browser/index.js"}],"../node_modules/@ffmpeg/ffmpeg/src/index.js":[function(require,module,exports) {
require('regenerator-runtime/runtime');

var createFFmpeg = require('./createFFmpeg');

var _require = require('./node'),
    fetchFile = _require.fetchFile;

module.exports = {
  /*
   * Create ffmpeg instance.
   * Each ffmpeg instance owns an isolated MEMFS and works
   * independently.
   *
   * For example:
   *
   * ```
   * const ffmpeg = createFFmpeg({
   *  log: true,
   *  logger: () => {},
   *  progress: () => {},
   *  corePath: '',
   * })
   * ```
   *
   * For the usage of these four arguments, check config.js
   *
   */
  createFFmpeg: createFFmpeg,

  /*
   * Helper function for fetching files from various resource.
   * Sometimes the video/audio file you want to process may located
   * in a remote URL and somewhere in your local file system.
   *
   * This helper function helps you to fetch to file and return an
   * Uint8Array variable for ffmpeg.wasm to consume.
   *
   */
  fetchFile: fetchFile
};
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","./createFFmpeg":"../node_modules/@ffmpeg/ffmpeg/src/createFFmpeg.js","./node":"../node_modules/@ffmpeg/ffmpeg/src/browser/index.js"}],"../node_modules/prelude-ls/lib/Func.js":[function(require,module,exports) {
// Generated by LiveScript 1.4.0
var apply,
    curry,
    flip,
    fix,
    over,
    memoize,
    slice$ = [].slice,
    toString$ = {}.toString;
apply = curry$(function (f, list) {
  return f.apply(null, list);
});

curry = function (f) {
  return curry$(f);
};

flip = curry$(function (f, x, y) {
  return f(y, x);
});

fix = function (f) {
  return function (g) {
    return function () {
      return f(g(g)).apply(null, arguments);
    };
  }(function (g) {
    return function () {
      return f(g(g)).apply(null, arguments);
    };
  });
};

over = curry$(function (f, g, x, y) {
  return f(g(x), g(y));
});

memoize = function (f) {
  var memo;
  memo = {};
  return function () {
    var args, key, arg;
    args = slice$.call(arguments);

    key = function () {
      var i$,
          ref$,
          len$,
          results$ = [];

      for (i$ = 0, len$ = (ref$ = args).length; i$ < len$; ++i$) {
        arg = ref$[i$];
        results$.push(arg + toString$.call(arg).slice(8, -1));
      }

      return results$;
    }().join('');

    return memo[key] = key in memo ? memo[key] : f.apply(null, args);
  };
};

module.exports = {
  curry: curry,
  flip: flip,
  fix: fix,
  apply: apply,
  over: over,
  memoize: memoize
};

function curry$(f, bound) {
  var context,
      _curry = function (args) {
    return f.length > 1 ? function () {
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) < f.length && arguments.length ? _curry.call(context, params) : f.apply(context, params);
    } : f;
  };

  return _curry();
}
},{}],"../node_modules/prelude-ls/lib/List.js":[function(require,module,exports) {
// Generated by LiveScript 1.4.0
var each,
    map,
    compact,
    filter,
    reject,
    partition,
    find,
    head,
    first,
    tail,
    last,
    initial,
    empty,
    reverse,
    unique,
    uniqueBy,
    fold,
    foldl,
    fold1,
    foldl1,
    foldr,
    foldr1,
    unfoldr,
    concat,
    concatMap,
    flatten,
    difference,
    intersection,
    union,
    countBy,
    groupBy,
    andList,
    orList,
    any,
    all,
    sort,
    sortWith,
    sortBy,
    sum,
    product,
    mean,
    average,
    maximum,
    minimum,
    maximumBy,
    minimumBy,
    scan,
    scanl,
    scan1,
    scanl1,
    scanr,
    scanr1,
    slice,
    take,
    drop,
    splitAt,
    takeWhile,
    dropWhile,
    span,
    breakList,
    zip,
    zipWith,
    zipAll,
    zipAllWith,
    at,
    elemIndex,
    elemIndices,
    findIndex,
    findIndices,
    toString$ = {}.toString,
    slice$ = [].slice;
each = curry$(function (f, xs) {
  var i$, len$, x;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    f(x);
  }

  return xs;
});
map = curry$(function (f, xs) {
  var i$,
      len$,
      x,
      results$ = [];

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    results$.push(f(x));
  }

  return results$;
});

compact = function (xs) {
  var i$,
      len$,
      x,
      results$ = [];

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    if (x) {
      results$.push(x);
    }
  }

  return results$;
};

filter = curry$(function (f, xs) {
  var i$,
      len$,
      x,
      results$ = [];

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    if (f(x)) {
      results$.push(x);
    }
  }

  return results$;
});
reject = curry$(function (f, xs) {
  var i$,
      len$,
      x,
      results$ = [];

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    if (!f(x)) {
      results$.push(x);
    }
  }

  return results$;
});
partition = curry$(function (f, xs) {
  var passed, failed, i$, len$, x;
  passed = [];
  failed = [];

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    (f(x) ? passed : failed).push(x);
  }

  return [passed, failed];
});
find = curry$(function (f, xs) {
  var i$, len$, x;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    if (f(x)) {
      return x;
    }
  }
});

head = first = function (xs) {
  return xs[0];
};

tail = function (xs) {
  if (!xs.length) {
    return;
  }

  return xs.slice(1);
};

last = function (xs) {
  return xs[xs.length - 1];
};

initial = function (xs) {
  if (!xs.length) {
    return;
  }

  return xs.slice(0, -1);
};

empty = function (xs) {
  return !xs.length;
};

reverse = function (xs) {
  return xs.concat().reverse();
};

unique = function (xs) {
  var result, i$, len$, x;
  result = [];

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    if (!in$(x, result)) {
      result.push(x);
    }
  }

  return result;
};

uniqueBy = curry$(function (f, xs) {
  var seen,
      i$,
      len$,
      x,
      val,
      results$ = [];
  seen = [];

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    val = f(x);

    if (in$(val, seen)) {
      continue;
    }

    seen.push(val);
    results$.push(x);
  }

  return results$;
});
fold = foldl = curry$(function (f, memo, xs) {
  var i$, len$, x;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    memo = f(memo, x);
  }

  return memo;
});
fold1 = foldl1 = curry$(function (f, xs) {
  return fold(f, xs[0], xs.slice(1));
});
foldr = curry$(function (f, memo, xs) {
  var i$, x;

  for (i$ = xs.length - 1; i$ >= 0; --i$) {
    x = xs[i$];
    memo = f(x, memo);
  }

  return memo;
});
foldr1 = curry$(function (f, xs) {
  return foldr(f, xs[xs.length - 1], xs.slice(0, -1));
});
unfoldr = curry$(function (f, b) {
  var result, x, that;
  result = [];
  x = b;

  while ((that = f(x)) != null) {
    result.push(that[0]);
    x = that[1];
  }

  return result;
});

concat = function (xss) {
  return [].concat.apply([], xss);
};

concatMap = curry$(function (f, xs) {
  var x;
  return [].concat.apply([], function () {
    var i$,
        ref$,
        len$,
        results$ = [];

    for (i$ = 0, len$ = (ref$ = xs).length; i$ < len$; ++i$) {
      x = ref$[i$];
      results$.push(f(x));
    }

    return results$;
  }());
});

flatten = function (xs) {
  var x;
  return [].concat.apply([], function () {
    var i$,
        ref$,
        len$,
        results$ = [];

    for (i$ = 0, len$ = (ref$ = xs).length; i$ < len$; ++i$) {
      x = ref$[i$];

      if (toString$.call(x).slice(8, -1) === 'Array') {
        results$.push(flatten(x));
      } else {
        results$.push(x);
      }
    }

    return results$;
  }());
};

difference = function (xs) {
  var yss, results, i$, len$, x, j$, len1$, ys;
  yss = slice$.call(arguments, 1);
  results = [];

  outer: for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    for (j$ = 0, len1$ = yss.length; j$ < len1$; ++j$) {
      ys = yss[j$];

      if (in$(x, ys)) {
        continue outer;
      }
    }

    results.push(x);
  }

  return results;
};

intersection = function (xs) {
  var yss, results, i$, len$, x, j$, len1$, ys;
  yss = slice$.call(arguments, 1);
  results = [];

  outer: for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    for (j$ = 0, len1$ = yss.length; j$ < len1$; ++j$) {
      ys = yss[j$];

      if (!in$(x, ys)) {
        continue outer;
      }
    }

    results.push(x);
  }

  return results;
};

union = function () {
  var xss, results, i$, len$, xs, j$, len1$, x;
  xss = slice$.call(arguments);
  results = [];

  for (i$ = 0, len$ = xss.length; i$ < len$; ++i$) {
    xs = xss[i$];

    for (j$ = 0, len1$ = xs.length; j$ < len1$; ++j$) {
      x = xs[j$];

      if (!in$(x, results)) {
        results.push(x);
      }
    }
  }

  return results;
};

countBy = curry$(function (f, xs) {
  var results, i$, len$, x, key;
  results = {};

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    key = f(x);

    if (key in results) {
      results[key] += 1;
    } else {
      results[key] = 1;
    }
  }

  return results;
});
groupBy = curry$(function (f, xs) {
  var results, i$, len$, x, key;
  results = {};

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    key = f(x);

    if (key in results) {
      results[key].push(x);
    } else {
      results[key] = [x];
    }
  }

  return results;
});

andList = function (xs) {
  var i$, len$, x;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    if (!x) {
      return false;
    }
  }

  return true;
};

orList = function (xs) {
  var i$, len$, x;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    if (x) {
      return true;
    }
  }

  return false;
};

any = curry$(function (f, xs) {
  var i$, len$, x;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    if (f(x)) {
      return true;
    }
  }

  return false;
});
all = curry$(function (f, xs) {
  var i$, len$, x;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];

    if (!f(x)) {
      return false;
    }
  }

  return true;
});

sort = function (xs) {
  return xs.concat().sort(function (x, y) {
    if (x > y) {
      return 1;
    } else if (x < y) {
      return -1;
    } else {
      return 0;
    }
  });
};

sortWith = curry$(function (f, xs) {
  return xs.concat().sort(f);
});
sortBy = curry$(function (f, xs) {
  return xs.concat().sort(function (x, y) {
    if (f(x) > f(y)) {
      return 1;
    } else if (f(x) < f(y)) {
      return -1;
    } else {
      return 0;
    }
  });
});

sum = function (xs) {
  var result, i$, len$, x;
  result = 0;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    result += x;
  }

  return result;
};

product = function (xs) {
  var result, i$, len$, x;
  result = 1;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    result *= x;
  }

  return result;
};

mean = average = function (xs) {
  var sum, i$, len$, x;
  sum = 0;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    x = xs[i$];
    sum += x;
  }

  return sum / xs.length;
};

maximum = function (xs) {
  var max, i$, ref$, len$, x;
  max = xs[0];

  for (i$ = 0, len$ = (ref$ = xs.slice(1)).length; i$ < len$; ++i$) {
    x = ref$[i$];

    if (x > max) {
      max = x;
    }
  }

  return max;
};

minimum = function (xs) {
  var min, i$, ref$, len$, x;
  min = xs[0];

  for (i$ = 0, len$ = (ref$ = xs.slice(1)).length; i$ < len$; ++i$) {
    x = ref$[i$];

    if (x < min) {
      min = x;
    }
  }

  return min;
};

maximumBy = curry$(function (f, xs) {
  var max, i$, ref$, len$, x;
  max = xs[0];

  for (i$ = 0, len$ = (ref$ = xs.slice(1)).length; i$ < len$; ++i$) {
    x = ref$[i$];

    if (f(x) > f(max)) {
      max = x;
    }
  }

  return max;
});
minimumBy = curry$(function (f, xs) {
  var min, i$, ref$, len$, x;
  min = xs[0];

  for (i$ = 0, len$ = (ref$ = xs.slice(1)).length; i$ < len$; ++i$) {
    x = ref$[i$];

    if (f(x) < f(min)) {
      min = x;
    }
  }

  return min;
});
scan = scanl = curry$(function (f, memo, xs) {
  var last, x;
  last = memo;
  return [memo].concat(function () {
    var i$,
        ref$,
        len$,
        results$ = [];

    for (i$ = 0, len$ = (ref$ = xs).length; i$ < len$; ++i$) {
      x = ref$[i$];
      results$.push(last = f(last, x));
    }

    return results$;
  }());
});
scan1 = scanl1 = curry$(function (f, xs) {
  if (!xs.length) {
    return;
  }

  return scan(f, xs[0], xs.slice(1));
});
scanr = curry$(function (f, memo, xs) {
  xs = xs.concat().reverse();
  return scan(f, memo, xs).reverse();
});
scanr1 = curry$(function (f, xs) {
  if (!xs.length) {
    return;
  }

  xs = xs.concat().reverse();
  return scan(f, xs[0], xs.slice(1)).reverse();
});
slice = curry$(function (x, y, xs) {
  return xs.slice(x, y);
});
take = curry$(function (n, xs) {
  if (n <= 0) {
    return xs.slice(0, 0);
  } else {
    return xs.slice(0, n);
  }
});
drop = curry$(function (n, xs) {
  if (n <= 0) {
    return xs;
  } else {
    return xs.slice(n);
  }
});
splitAt = curry$(function (n, xs) {
  return [take(n, xs), drop(n, xs)];
});
takeWhile = curry$(function (p, xs) {
  var len, i;
  len = xs.length;

  if (!len) {
    return xs;
  }

  i = 0;

  while (i < len && p(xs[i])) {
    i += 1;
  }

  return xs.slice(0, i);
});
dropWhile = curry$(function (p, xs) {
  var len, i;
  len = xs.length;

  if (!len) {
    return xs;
  }

  i = 0;

  while (i < len && p(xs[i])) {
    i += 1;
  }

  return xs.slice(i);
});
span = curry$(function (p, xs) {
  return [takeWhile(p, xs), dropWhile(p, xs)];
});
breakList = curry$(function (p, xs) {
  return span(compose$(p, not$), xs);
});
zip = curry$(function (xs, ys) {
  var result, len, i$, len$, i, x;
  result = [];
  len = ys.length;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    i = i$;
    x = xs[i$];

    if (i === len) {
      break;
    }

    result.push([x, ys[i]]);
  }

  return result;
});
zipWith = curry$(function (f, xs, ys) {
  var result, len, i$, len$, i, x;
  result = [];
  len = ys.length;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    i = i$;
    x = xs[i$];

    if (i === len) {
      break;
    }

    result.push(f(x, ys[i]));
  }

  return result;
});

zipAll = function () {
  var xss,
      minLength,
      i$,
      len$,
      xs,
      ref$,
      i,
      lresult$,
      j$,
      results$ = [];
  xss = slice$.call(arguments);
  minLength = undefined;

  for (i$ = 0, len$ = xss.length; i$ < len$; ++i$) {
    xs = xss[i$];
    minLength <= (ref$ = xs.length) || (minLength = ref$);
  }

  for (i$ = 0; i$ < minLength; ++i$) {
    i = i$;
    lresult$ = [];

    for (j$ = 0, len$ = xss.length; j$ < len$; ++j$) {
      xs = xss[j$];
      lresult$.push(xs[i]);
    }

    results$.push(lresult$);
  }

  return results$;
};

zipAllWith = function (f) {
  var xss,
      minLength,
      i$,
      len$,
      xs,
      ref$,
      i,
      results$ = [];
  xss = slice$.call(arguments, 1);
  minLength = undefined;

  for (i$ = 0, len$ = xss.length; i$ < len$; ++i$) {
    xs = xss[i$];
    minLength <= (ref$ = xs.length) || (minLength = ref$);
  }

  for (i$ = 0; i$ < minLength; ++i$) {
    i = i$;
    results$.push(f.apply(null, fn$()));
  }

  return results$;

  function fn$() {
    var i$,
        ref$,
        len$,
        results$ = [];

    for (i$ = 0, len$ = (ref$ = xss).length; i$ < len$; ++i$) {
      xs = ref$[i$];
      results$.push(xs[i]);
    }

    return results$;
  }
};

at = curry$(function (n, xs) {
  if (n < 0) {
    return xs[xs.length + n];
  } else {
    return xs[n];
  }
});
elemIndex = curry$(function (el, xs) {
  var i$, len$, i, x;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    i = i$;
    x = xs[i$];

    if (x === el) {
      return i;
    }
  }
});
elemIndices = curry$(function (el, xs) {
  var i$,
      len$,
      i,
      x,
      results$ = [];

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    i = i$;
    x = xs[i$];

    if (x === el) {
      results$.push(i);
    }
  }

  return results$;
});
findIndex = curry$(function (f, xs) {
  var i$, len$, i, x;

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    i = i$;
    x = xs[i$];

    if (f(x)) {
      return i;
    }
  }
});
findIndices = curry$(function (f, xs) {
  var i$,
      len$,
      i,
      x,
      results$ = [];

  for (i$ = 0, len$ = xs.length; i$ < len$; ++i$) {
    i = i$;
    x = xs[i$];

    if (f(x)) {
      results$.push(i);
    }
  }

  return results$;
});
module.exports = {
  each: each,
  map: map,
  filter: filter,
  compact: compact,
  reject: reject,
  partition: partition,
  find: find,
  head: head,
  first: first,
  tail: tail,
  last: last,
  initial: initial,
  empty: empty,
  reverse: reverse,
  difference: difference,
  intersection: intersection,
  union: union,
  countBy: countBy,
  groupBy: groupBy,
  fold: fold,
  fold1: fold1,
  foldl: foldl,
  foldl1: foldl1,
  foldr: foldr,
  foldr1: foldr1,
  unfoldr: unfoldr,
  andList: andList,
  orList: orList,
  any: any,
  all: all,
  unique: unique,
  uniqueBy: uniqueBy,
  sort: sort,
  sortWith: sortWith,
  sortBy: sortBy,
  sum: sum,
  product: product,
  mean: mean,
  average: average,
  concat: concat,
  concatMap: concatMap,
  flatten: flatten,
  maximum: maximum,
  minimum: minimum,
  maximumBy: maximumBy,
  minimumBy: minimumBy,
  scan: scan,
  scan1: scan1,
  scanl: scanl,
  scanl1: scanl1,
  scanr: scanr,
  scanr1: scanr1,
  slice: slice,
  take: take,
  drop: drop,
  splitAt: splitAt,
  takeWhile: takeWhile,
  dropWhile: dropWhile,
  span: span,
  breakList: breakList,
  zip: zip,
  zipWith: zipWith,
  zipAll: zipAll,
  zipAllWith: zipAllWith,
  at: at,
  elemIndex: elemIndex,
  elemIndices: elemIndices,
  findIndex: findIndex,
  findIndices: findIndices
};

function curry$(f, bound) {
  var context,
      _curry = function (args) {
    return f.length > 1 ? function () {
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) < f.length && arguments.length ? _curry.call(context, params) : f.apply(context, params);
    } : f;
  };

  return _curry();
}

function in$(x, xs) {
  var i = -1,
      l = xs.length >>> 0;

  while (++i < l) if (x === xs[i]) return true;

  return false;
}

function compose$() {
  var functions = arguments;
  return function () {
    var i, result;
    result = functions[0].apply(this, arguments);

    for (i = 1; i < functions.length; ++i) {
      result = functions[i](result);
    }

    return result;
  };
}

function not$(x) {
  return !x;
}
},{}],"../node_modules/prelude-ls/lib/Obj.js":[function(require,module,exports) {
// Generated by LiveScript 1.4.0
var values, keys, pairsToObj, objToPairs, listsToObj, objToLists, empty, each, map, compact, filter, reject, partition, find;

values = function (object) {
  var i$,
      x,
      results$ = [];

  for (i$ in object) {
    x = object[i$];
    results$.push(x);
  }

  return results$;
};

keys = function (object) {
  var x,
      results$ = [];

  for (x in object) {
    results$.push(x);
  }

  return results$;
};

pairsToObj = function (object) {
  var i$,
      len$,
      x,
      resultObj$ = {};

  for (i$ = 0, len$ = object.length; i$ < len$; ++i$) {
    x = object[i$];
    resultObj$[x[0]] = x[1];
  }

  return resultObj$;
};

objToPairs = function (object) {
  var key,
      value,
      results$ = [];

  for (key in object) {
    value = object[key];
    results$.push([key, value]);
  }

  return results$;
};

listsToObj = curry$(function (keys, values) {
  var i$,
      len$,
      i,
      key,
      resultObj$ = {};

  for (i$ = 0, len$ = keys.length; i$ < len$; ++i$) {
    i = i$;
    key = keys[i$];
    resultObj$[key] = values[i];
  }

  return resultObj$;
});

objToLists = function (object) {
  var keys, values, key, value;
  keys = [];
  values = [];

  for (key in object) {
    value = object[key];
    keys.push(key);
    values.push(value);
  }

  return [keys, values];
};

empty = function (object) {
  var x;

  for (x in object) {
    return false;
  }

  return true;
};

each = curry$(function (f, object) {
  var i$, x;

  for (i$ in object) {
    x = object[i$];
    f(x);
  }

  return object;
});
map = curry$(function (f, object) {
  var k,
      x,
      resultObj$ = {};

  for (k in object) {
    x = object[k];
    resultObj$[k] = f(x);
  }

  return resultObj$;
});

compact = function (object) {
  var k,
      x,
      resultObj$ = {};

  for (k in object) {
    x = object[k];

    if (x) {
      resultObj$[k] = x;
    }
  }

  return resultObj$;
};

filter = curry$(function (f, object) {
  var k,
      x,
      resultObj$ = {};

  for (k in object) {
    x = object[k];

    if (f(x)) {
      resultObj$[k] = x;
    }
  }

  return resultObj$;
});
reject = curry$(function (f, object) {
  var k,
      x,
      resultObj$ = {};

  for (k in object) {
    x = object[k];

    if (!f(x)) {
      resultObj$[k] = x;
    }
  }

  return resultObj$;
});
partition = curry$(function (f, object) {
  var passed, failed, k, x;
  passed = {};
  failed = {};

  for (k in object) {
    x = object[k];
    (f(x) ? passed : failed)[k] = x;
  }

  return [passed, failed];
});
find = curry$(function (f, object) {
  var i$, x;

  for (i$ in object) {
    x = object[i$];

    if (f(x)) {
      return x;
    }
  }
});
module.exports = {
  values: values,
  keys: keys,
  pairsToObj: pairsToObj,
  objToPairs: objToPairs,
  listsToObj: listsToObj,
  objToLists: objToLists,
  empty: empty,
  each: each,
  map: map,
  filter: filter,
  compact: compact,
  reject: reject,
  partition: partition,
  find: find
};

function curry$(f, bound) {
  var context,
      _curry = function (args) {
    return f.length > 1 ? function () {
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) < f.length && arguments.length ? _curry.call(context, params) : f.apply(context, params);
    } : f;
  };

  return _curry();
}
},{}],"../node_modules/prelude-ls/lib/Str.js":[function(require,module,exports) {
// Generated by LiveScript 1.4.0
var split, join, lines, unlines, words, unwords, chars, unchars, reverse, repeat, capitalize, camelize, dasherize;
split = curry$(function (sep, str) {
  return str.split(sep);
});
join = curry$(function (sep, xs) {
  return xs.join(sep);
});

lines = function (str) {
  if (!str.length) {
    return [];
  }

  return str.split('\n');
};

unlines = function (it) {
  return it.join('\n');
};

words = function (str) {
  if (!str.length) {
    return [];
  }

  return str.split(/[ ]+/);
};

unwords = function (it) {
  return it.join(' ');
};

chars = function (it) {
  return it.split('');
};

unchars = function (it) {
  return it.join('');
};

reverse = function (str) {
  return str.split('').reverse().join('');
};

repeat = curry$(function (n, str) {
  var result, i$;
  result = '';

  for (i$ = 0; i$ < n; ++i$) {
    result += str;
  }

  return result;
});

capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

camelize = function (it) {
  return it.replace(/[-_]+(.)?/g, function (arg$, c) {
    return (c != null ? c : '').toUpperCase();
  });
};

dasherize = function (str) {
  return str.replace(/([^-A-Z])([A-Z]+)/g, function (arg$, lower, upper) {
    return lower + "-" + (upper.length > 1 ? upper : upper.toLowerCase());
  }).replace(/^([A-Z]+)/, function (arg$, upper) {
    if (upper.length > 1) {
      return upper + "-";
    } else {
      return upper.toLowerCase();
    }
  });
};

module.exports = {
  split: split,
  join: join,
  lines: lines,
  unlines: unlines,
  words: words,
  unwords: unwords,
  chars: chars,
  unchars: unchars,
  reverse: reverse,
  repeat: repeat,
  capitalize: capitalize,
  camelize: camelize,
  dasherize: dasherize
};

function curry$(f, bound) {
  var context,
      _curry = function (args) {
    return f.length > 1 ? function () {
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) < f.length && arguments.length ? _curry.call(context, params) : f.apply(context, params);
    } : f;
  };

  return _curry();
}
},{}],"../node_modules/prelude-ls/lib/Num.js":[function(require,module,exports) {
// Generated by LiveScript 1.4.0
var max, min, negate, abs, signum, quot, rem, div, mod, recip, pi, tau, exp, sqrt, ln, pow, sin, tan, cos, asin, acos, atan, atan2, truncate, round, ceiling, floor, isItNaN, even, odd, gcd, lcm;
max = curry$(function (x$, y$) {
  return x$ > y$ ? x$ : y$;
});
min = curry$(function (x$, y$) {
  return x$ < y$ ? x$ : y$;
});

negate = function (x) {
  return -x;
};

abs = Math.abs;

signum = function (x) {
  if (x < 0) {
    return -1;
  } else if (x > 0) {
    return 1;
  } else {
    return 0;
  }
};

quot = curry$(function (x, y) {
  return ~~(x / y);
});
rem = curry$(function (x$, y$) {
  return x$ % y$;
});
div = curry$(function (x, y) {
  return Math.floor(x / y);
});
mod = curry$(function (x$, y$) {
  var ref$;
  return (x$ % (ref$ = y$) + ref$) % ref$;
});

recip = function (it) {
  return 1 / it;
};

pi = Math.PI;
tau = pi * 2;
exp = Math.exp;
sqrt = Math.sqrt;
ln = Math.log;
pow = curry$(function (x$, y$) {
  return Math.pow(x$, y$);
});
sin = Math.sin;
tan = Math.tan;
cos = Math.cos;
asin = Math.asin;
acos = Math.acos;
atan = Math.atan;
atan2 = curry$(function (x, y) {
  return Math.atan2(x, y);
});

truncate = function (x) {
  return ~~x;
};

round = Math.round;
ceiling = Math.ceil;
floor = Math.floor;

isItNaN = function (x) {
  return x !== x;
};

even = function (x) {
  return x % 2 === 0;
};

odd = function (x) {
  return x % 2 !== 0;
};

gcd = curry$(function (x, y) {
  var z;
  x = Math.abs(x);
  y = Math.abs(y);

  while (y !== 0) {
    z = x % y;
    x = y;
    y = z;
  }

  return x;
});
lcm = curry$(function (x, y) {
  return Math.abs(Math.floor(x / gcd(x, y) * y));
});
module.exports = {
  max: max,
  min: min,
  negate: negate,
  abs: abs,
  signum: signum,
  quot: quot,
  rem: rem,
  div: div,
  mod: mod,
  recip: recip,
  pi: pi,
  tau: tau,
  exp: exp,
  sqrt: sqrt,
  ln: ln,
  pow: pow,
  sin: sin,
  tan: tan,
  cos: cos,
  acos: acos,
  asin: asin,
  atan: atan,
  atan2: atan2,
  truncate: truncate,
  round: round,
  ceiling: ceiling,
  floor: floor,
  isItNaN: isItNaN,
  even: even,
  odd: odd,
  gcd: gcd,
  lcm: lcm
};

function curry$(f, bound) {
  var context,
      _curry = function (args) {
    return f.length > 1 ? function () {
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) < f.length && arguments.length ? _curry.call(context, params) : f.apply(context, params);
    } : f;
  };

  return _curry();
}
},{}],"../node_modules/prelude-ls/lib/index.js":[function(require,module,exports) {
// Generated by LiveScript 1.4.0
var Func,
    List,
    Obj,
    Str,
    Num,
    id,
    isType,
    replicate,
    prelude,
    toString$ = {}.toString;
Func = require('./Func.js');
List = require('./List.js');
Obj = require('./Obj.js');
Str = require('./Str.js');
Num = require('./Num.js');

id = function (x) {
  return x;
};

isType = curry$(function (type, x) {
  return toString$.call(x).slice(8, -1) === type;
});
replicate = curry$(function (n, x) {
  var i$,
      results$ = [];

  for (i$ = 0; i$ < n; ++i$) {
    results$.push(x);
  }

  return results$;
});
Str.empty = List.empty;
Str.slice = List.slice;
Str.take = List.take;
Str.drop = List.drop;
Str.splitAt = List.splitAt;
Str.takeWhile = List.takeWhile;
Str.dropWhile = List.dropWhile;
Str.span = List.span;
Str.breakStr = List.breakList;
prelude = {
  Func: Func,
  List: List,
  Obj: Obj,
  Str: Str,
  Num: Num,
  id: id,
  isType: isType,
  replicate: replicate
};
prelude.each = List.each;
prelude.map = List.map;
prelude.filter = List.filter;
prelude.compact = List.compact;
prelude.reject = List.reject;
prelude.partition = List.partition;
prelude.find = List.find;
prelude.head = List.head;
prelude.first = List.first;
prelude.tail = List.tail;
prelude.last = List.last;
prelude.initial = List.initial;
prelude.empty = List.empty;
prelude.reverse = List.reverse;
prelude.difference = List.difference;
prelude.intersection = List.intersection;
prelude.union = List.union;
prelude.countBy = List.countBy;
prelude.groupBy = List.groupBy;
prelude.fold = List.fold;
prelude.foldl = List.foldl;
prelude.fold1 = List.fold1;
prelude.foldl1 = List.foldl1;
prelude.foldr = List.foldr;
prelude.foldr1 = List.foldr1;
prelude.unfoldr = List.unfoldr;
prelude.andList = List.andList;
prelude.orList = List.orList;
prelude.any = List.any;
prelude.all = List.all;
prelude.unique = List.unique;
prelude.uniqueBy = List.uniqueBy;
prelude.sort = List.sort;
prelude.sortWith = List.sortWith;
prelude.sortBy = List.sortBy;
prelude.sum = List.sum;
prelude.product = List.product;
prelude.mean = List.mean;
prelude.average = List.average;
prelude.concat = List.concat;
prelude.concatMap = List.concatMap;
prelude.flatten = List.flatten;
prelude.maximum = List.maximum;
prelude.minimum = List.minimum;
prelude.maximumBy = List.maximumBy;
prelude.minimumBy = List.minimumBy;
prelude.scan = List.scan;
prelude.scanl = List.scanl;
prelude.scan1 = List.scan1;
prelude.scanl1 = List.scanl1;
prelude.scanr = List.scanr;
prelude.scanr1 = List.scanr1;
prelude.slice = List.slice;
prelude.take = List.take;
prelude.drop = List.drop;
prelude.splitAt = List.splitAt;
prelude.takeWhile = List.takeWhile;
prelude.dropWhile = List.dropWhile;
prelude.span = List.span;
prelude.breakList = List.breakList;
prelude.zip = List.zip;
prelude.zipWith = List.zipWith;
prelude.zipAll = List.zipAll;
prelude.zipAllWith = List.zipAllWith;
prelude.at = List.at;
prelude.elemIndex = List.elemIndex;
prelude.elemIndices = List.elemIndices;
prelude.findIndex = List.findIndex;
prelude.findIndices = List.findIndices;
prelude.apply = Func.apply;
prelude.curry = Func.curry;
prelude.flip = Func.flip;
prelude.fix = Func.fix;
prelude.over = Func.over;
prelude.split = Str.split;
prelude.join = Str.join;
prelude.lines = Str.lines;
prelude.unlines = Str.unlines;
prelude.words = Str.words;
prelude.unwords = Str.unwords;
prelude.chars = Str.chars;
prelude.unchars = Str.unchars;
prelude.repeat = Str.repeat;
prelude.capitalize = Str.capitalize;
prelude.camelize = Str.camelize;
prelude.dasherize = Str.dasherize;
prelude.values = Obj.values;
prelude.keys = Obj.keys;
prelude.pairsToObj = Obj.pairsToObj;
prelude.objToPairs = Obj.objToPairs;
prelude.listsToObj = Obj.listsToObj;
prelude.objToLists = Obj.objToLists;
prelude.max = Num.max;
prelude.min = Num.min;
prelude.negate = Num.negate;
prelude.abs = Num.abs;
prelude.signum = Num.signum;
prelude.quot = Num.quot;
prelude.rem = Num.rem;
prelude.div = Num.div;
prelude.mod = Num.mod;
prelude.recip = Num.recip;
prelude.pi = Num.pi;
prelude.tau = Num.tau;
prelude.exp = Num.exp;
prelude.sqrt = Num.sqrt;
prelude.ln = Num.ln;
prelude.pow = Num.pow;
prelude.sin = Num.sin;
prelude.tan = Num.tan;
prelude.cos = Num.cos;
prelude.acos = Num.acos;
prelude.asin = Num.asin;
prelude.atan = Num.atan;
prelude.atan2 = Num.atan2;
prelude.truncate = Num.truncate;
prelude.round = Num.round;
prelude.ceiling = Num.ceiling;
prelude.floor = Num.floor;
prelude.isItNaN = Num.isItNaN;
prelude.even = Num.even;
prelude.odd = Num.odd;
prelude.gcd = Num.gcd;
prelude.lcm = Num.lcm;
prelude.VERSION = '1.1.2';
module.exports = prelude;

function curry$(f, bound) {
  var context,
      _curry = function (args) {
    return f.length > 1 ? function () {
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) < f.length && arguments.length ? _curry.call(context, params) : f.apply(context, params);
    } : f;
  };

  return _curry();
}
},{"./Func.js":"../node_modules/prelude-ls/lib/Func.js","./List.js":"../node_modules/prelude-ls/lib/List.js","./Obj.js":"../node_modules/prelude-ls/lib/Obj.js","./Str.js":"../node_modules/prelude-ls/lib/Str.js","./Num.js":"../node_modules/prelude-ls/lib/Num.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _ffmpeg = _interopRequireDefault(require("@ffmpeg/ffmpeg"));

var _preludeLs = require("prelude-ls");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createFFmpeg = _ffmpeg.default.createFFmpeg,
    fetchFile = _ffmpeg.default.fetchFile;
var ffmpeg = createFFmpeg({
  log: true
});
document.getElementById('fileInput').addEventListener('change', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var files, name, data, video;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            files = _ref.target.files;
            name = files[0].name;
            _context.next = 4;
            return ffmpeg.load();

          case 4:
            _context.t0 = ffmpeg;
            _context.t1 = name;
            _context.next = 8;
            return fetchFile(files[0]);

          case 8:
            _context.t2 = _context.sent;

            _context.t0.FS.call(_context.t0, 'writeFile', _context.t1, _context.t2);

            _context.next = 12;
            return ffmpeg.run('-f', 'gif', '-i', name, 'output.mp4');

          case 12:
            data = ffmpeg.FS('readFile', 'output.mp4');
            video = document.getElementById('player');
            video.src = URL.createObjectURL(new Blob([data.buffer], {
              type: 'video/mp4'
            }));

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}());
},{"@ffmpeg/ffmpeg":"../node_modules/@ffmpeg/ffmpeg/src/index.js","prelude-ls":"../node_modules/prelude-ls/lib/index.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "38175" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map