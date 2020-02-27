"use strict";

require("../init");

const path = require("path");
const { promises: fs } = require("fs");
const awsRequest = require("../aws-request");

const ENV_PATH = path.resolve(__dirname, "env.json");

(async () => {
	const result = await awsRequest("CognitoIdentityServiceProvider", "createUserPool", {
		PoolName: "test-from-sdk"
	});
	await fs.writeFile(ENV_PATH, JSON.stringify({ poolId: result.UserPool.Id }, null, "\t"));
})();
