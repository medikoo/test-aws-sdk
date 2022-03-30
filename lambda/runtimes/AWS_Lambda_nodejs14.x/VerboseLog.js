/**
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 */

"use strict";

const EnvVarName = "AWS_LAMBDA_RUNTIME_VERBOSE";
const Tag = "RUNTIME";
const Verbosity = (() => {
	if (!process.env[EnvVarName]) {
		return 0;
	}

	try {
		const verbosity = parseInt(process.env[EnvVarName]);
		return verbosity < 0 ? 0 : verbosity > 3 ? 3 : verbosity;
	} catch (_) {
		return 0;
	}
})();

exports.logger = function (category) {
	return {
		verbose: function () {
			if (Verbosity >= 1) {
				console.log.apply(null, [Tag, category, ...arguments]);
			}
		},
		vverbose: function () {
			if (Verbosity >= 2) {
				console.log.apply(null, [Tag, category, ...arguments]);
			}
		},
		vvverbose: function () {
			if (Verbosity >= 3) {
				console.log.apply(null, [Tag, category, ...arguments]);
			}
		}
	};
};
