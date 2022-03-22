#!/usr/bin/env node

"use strict";

process._rawDebug("EE", "init", process.version, process.env);

const dns = require("dns");
dns.lookup("localhost", (err, result) => { process._rawDebug("EE", "DNS: localhost", result); });
dns.lookup("sandbox", (err, result) => { process._rawDebug("EE", "DNS: sandbox", result); });

process.on("SIGINT", () => () => {
	process._rawDebug("EE", "shutdown", "SIGINT");
	process.exit(0);
});
process.on("SIGTERM", () => {
	process._rawDebug("EE", "shutdown", "SIGTERM");
	process.exit(0);
});

const http             = require("http")
    , { EventEmitter } = require("events");

const baseUrl = `http://${ process.env.AWS_LAMBDA_RUNTIME_API }/2020-01-01/extension`;

const reportEmitter = new EventEmitter();

(async () => {
	const extensionIndentifier = await new Promise((resolve, reject) => {
		const postData = JSON.stringify({ events: ["INVOKE", "SHUTDOWN"] });
		const request = http.request(
			`${ baseUrl }/register`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Lambda-Extension-Name": "extension-external.js",
					"Content-Length": Buffer.byteLength(postData)
				}
			},
			response => {
				process._rawDebug(
					"EE", "register reponse start", response.statusCode, response.headers
				);
				if (response.statusCode !== 200) {
					// TODO: Report propery extension crash
					throw new Error(
						`Unexpected register response status code: ${ response.statusCode }`
					);
				}

				response.setEncoding("utf8");
				let result = "";
				response.on("data", chunk => { result += String(chunk); });
				response.on("end", () => {
					process._rawDebug("EE", "register reponse end", result);
					resolve(response.headers["lambda-extension-identifier"]);
				});
			}
		);
		request.on("error", reject);
		request.write(postData);
		request.end();
	});

	http.createServer((request, response) => {
		process._rawDebug(
			"EE", "logs input start", new Date().toISOString(), request.method, request.headers
		);
		if (request.method === "POST") {
			let body = "";
			request.on("data", data => { body += data; });
			request.on("end", () => {
				process._rawDebug("EE", "logs input end", body, Date.now());
				const data = JSON.parse(body);
				if (data.find(event => event.type === "platform.runtimeDone")) {
					reportEmitter.emit("runtimeDone");
				} else if (data.find(event => event.type === "platform.report")) {
					reportEmitter.emit("report");
				}
				response.writeHead(200, {});
				response.end("OK");
			});
		} else {
			response.writeHead(200, {});
			response.end("OK");
		}
	}).listen(4243, "sandbox");

	await new Promise((resolve, reject) => {
		process._rawDebug("EE", "logs subscribe start");
		const putData = JSON.stringify({
			destination: { protocol: "HTTP", URI: "http://sandbox:4243" },
			types: ["platform", "function"],
			buffering: { timeoutMs: 25, maxBytes: 262144, maxItems: 1000 },
			schemaVersion: "2021-03-18"
		});
		const request = http.request(
			`http://${ process.env.AWS_LAMBDA_RUNTIME_API }/2020-08-15/logs`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Lambda-Extension-Identifier": extensionIndentifier,
					"Content-Length": Buffer.byteLength(putData)
				}
			},
			response => {
				process._rawDebug(
					"EE", "logs subscribe response start", response.statusCode, response.headers
				);
				response.setEncoding("utf8");
				let result = "";
				response.on("data", chunk => { result += String(chunk); });
				response.on("end", () => {
					process._rawDebug("EE", "logs subscribe response end", result);
					if (response.statusCode === 200) {
						resolve();
					} else {
						// TODO: Report propery extension crash
						reject(
							new Error(
								`Unexpecxted logs subscribe response status code: ${
									response.statusCode
								}`
							)
						);
					}
				});
			}
		);
		request.on("error", reject);
		request.write(putData);
		request.end();
	});

	const waitForEvent = async () => {
		const event = await new Promise((resolve, reject) => {
			process._rawDebug("EE", "next start");
			const request = http.request(
				`${ baseUrl }/event/next`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Lambda-Extension-Identifier": extensionIndentifier
					}
				},
				response => {
					process._rawDebug(
						"EE", "next response start", response.statusCode, response.headers
					);
					if (response.statusCode !== 200) {
						// TODO: Report propery extension crash
						throw new Error(
							`Unexpecxted register response status code: ${ response.statusCode }`
						);
					}
					response.setEncoding("utf8");
					let result = "";
					response.on("data", chunk => { result += String(chunk); });
					response.on("end", () => {
						process._rawDebug("EE", "next response end", result, Date.now());
						resolve(JSON.parse(result));
					});
				}
			);
			request.on("error", reject);
			request.end();
		});
		switch (event.eventType) {
			case "SHUTDOWN":
				{
					// Hold process untill all logs are provided
					const timer = setTimeout(() => {
						process._rawDebug("EE", "timer called", Date.now());
					}, 1000 * 60);
					reportEmitter.once("report", () => clearTimeout(timer));
				}
				return;
			case "INVOKE":
				await new Promise(resolve => {
					reportEmitter.once("runtimeDone", () => resolve(waitForEvent()));
				});
				break;
			default:
				throw new Error(`unknown event: ${ event.eventType }`);
		}
	};
	await waitForEvent();
})().catch(error => {
	process._rawDebug("EE", "setup crash");
	process.nextTick(() => { throw error; });
});
