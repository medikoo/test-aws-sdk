"use strict";

require("../init");

const path = require("path");
const { promises: fs } = require("fs");
const awsRequest = require("../aws-request");

const ENV_PATH = path.resolve(__dirname, "env.json");

(async () => {
	const { poolId } = JSON.parse(await fs.readFile(ENV_PATH));
	await awsRequest("CognitoIdentityServiceProvider", "deleteUserPool", { UserPoolId: poolId });
	return fs.unlink(ENV_PATH);
})();
