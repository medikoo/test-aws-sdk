"use strict";

module.exports.handler = {
	other: (event, context, callback) => {
		callback(null, {
			statusCode: 200,
			body: JSON.stringify({ dirname: __dirname, filename: __filename })
		});
	}
};
