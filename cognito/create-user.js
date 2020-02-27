"use strict";

require("../init");

const path = require("path");
const { promises: fs } = require("fs");
const awsRequest = require("../aws-request");

const ENV_PATH = path.resolve(__dirname, "env.json");

const USER_NAME = "test-from-sdk";
const USER_PASSWORD = "razDwa3!";

(async () => {
	const config = JSON.parse(await fs.readFile(ENV_PATH));
	await awsRequest("CognitoIdentityServiceProvider", "adminCreateUser", {
		UserPoolId: config.poolId,
		Username: USER_NAME
	});
	await awsRequest("CognitoIdentityServiceProvider", "adminSetUserPassword", {
		UserPoolId: config.poolId,
		Username: USER_NAME,
		Password: USER_PASSWORD,
		Permanent: true
	});
	Object.assign(config, { user: { name: USER_NAME, password: USER_PASSWORD } });
	await fs.writeFile(ENV_PATH, JSON.stringify(config, null, "\t"));
})();
