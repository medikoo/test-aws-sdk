"use strict";

module.exports.handler = {
	other: (event, context, callback) => {
		require("aws-sdk");
		console.log("DID IT");
		callback(null, { statusCode: 200, body: JSON.stringify({ message: "hello world" }) });
	}
};
