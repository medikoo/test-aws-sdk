"use strict";

const AWS = require("aws-sdk");
const awsLog = require("log").get("aws");
const memoizee = require("memoizee");
const wait = require("timers-ext/promise/sleep");

const getServiceInstance = memoizee(
	nameInput => {
		const params = { region: "us-east-1", ...nameInput.params };
		const name = typeof nameInput === "string" ? nameInput : nameInput.name;
		const Service = AWS[name];
		return new Service(params);
	},
	{
		normalizer: ([nameInput]) =>
			typeof nameInput === "string" ? nameInput : JSON.stringify(nameInput)
	}
);

let lastAwsRequestId = 0;
module.exports = function awsRequest(service, method, ...args) {
	const requestId = ++lastAwsRequestId;
	awsLog.notice("[%d] %o %s %O", requestId, service, method, args);
	const instance = getServiceInstance(service);
	return instance[method](...args).promise().then(
		result => {
			awsLog.notice("[%d] %O", requestId, result);
			return result;
		},
		error => {
			awsLog.notice("[%d] %O", requestId, error);
			if (error.statusCode !== 403 && error.retryable) {
				awsLog.debug("[%d] retry", requestId);
				return wait(4000 + Math.random() * 3000).then(() =>
					awsRequest(service, method, ...args)
				);
			}
			throw error;
		}
	);
};
