/*!
 * deasync
 * https://github.com/abbr/deasync
 *
 * Copyright 2014-present Abbr
 * Released under the MIT license
 */

"use strict";

const { runLoopOnce } = require("./NativeModuleLoader.js").load();
const { callbackify } = require("util");

function deasync(fn) {
	return function () {
		var done = false;
		var args = Array.prototype.slice.apply(arguments).concat(cb);
		var err;
		var res;

		fn.apply(this, args);
		while (!done) {
			process._tickCallback();
			if (!done) {
				runLoopOnce();
			}
		}

		if (err) {
			throw err;
		}

		return res;

		function cb(e, r) {
			err = e;
			res = r;
			done = true;
		}
	};
}

// deasyncify takes an async function and converts it to sync.
function deasyncify(p) { return deasync(callbackify(p)); }

module.exports.deasyncify = deasyncify;
