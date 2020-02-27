"use strict";

require("../init");

const path = require("path");
const { promises: fs } = require("fs");
const awsRequest = require("../aws-request");

const ENV_PATH = path.resolve(__dirname, "env.json");

(async () => {
	const { user, clientId } = JSON.parse(await fs.readFile(ENV_PATH));
	await awsRequest("CognitoIdentityServiceProvider", "initiateAuth", {
		AuthFlow: "USER_PASSWORD_AUTH",
		AuthParameters: { USERNAME: user.name, PASSWORD: user.password },
		ClientId: clientId
	});
})();
