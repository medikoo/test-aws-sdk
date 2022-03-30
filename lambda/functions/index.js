"use strict";

// module.exports.handler = (event, context, callback) => {
// 	callback(null, { statusCode: 200, body: JSON.stringify({ event, env: process.env, context }) });
// };

module.exports.bar = (event, context, callback) => {
	callback(null, { result: "Extension stripped!!" });
};
module.exports.js = {};
module.exports.js.bar = (event, context, callback) => {
	callback(null, { result: "Object handler!" });
};
// module.exports["foo.bar"] = (event, context, callback) => {
// 	callback(null, { result: "String handler!" });
// };

// module.exports.handler = function (event, context, callback) {
// 	callback(null, { result: "Root handler!", context: this.foo });
// };
// module.exports.foo = "Preserved";
