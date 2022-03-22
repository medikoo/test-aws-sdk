"use strict";

process._rawDebug("F", "init");
console.log("F", "regular log at init");

module.exports.handler = (event, context, callback) => {
	process._rawDebug("F", "invocation");
	console.log("F", "regular log at invocation");
	setTimeout(() => {
		process._rawDebug("F", "return");
		callback(null, {
			statusCode: 200,
			body: JSON.stringify({ event, env: process.env, context, argv: process.argv })
		});
	}, 2000);
};
