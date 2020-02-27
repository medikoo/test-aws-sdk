"use strict";

require("../init");

const path = require("path");
const { promises: fs } = require("fs");
const awsRequest = require("../aws-request");

const ENV_PATH = path.resolve(__dirname, "env.json");

(async () => {
	const config = JSON.parse(await fs.readFile(ENV_PATH));
	const result = await awsRequest("CognitoIdentityServiceProvider", "createUserPoolClient", {
		ClientName: "test-aws-sdk",
		UserPoolId: config.poolId,
		ExplicitAuthFlows: ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"],
		PreventUserExistenceErrors: "ENABLED"
	});
	Object.assign(config, { clientId: result.UserPoolClient.ClientId });
	await fs.writeFile(ENV_PATH, JSON.stringify(config, null, "\t"));
})();
