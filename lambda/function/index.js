"use strict";

module.exports.handler = () => {
	setTimeout(() => console.log("TIMEOUT"), 5950).unref();
	console.log("DID IT");
};
