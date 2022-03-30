"use strict";

const limit   = require("ext/promise/limit").bind(Promise)
    , path    = require("path")
    , fsp     = require("fs").promises
    , readdir = require("fs2/readdir")
    , AWS     = require("aws-sdk");

const s3Client = new AWS.S3();

const bucketName = "aws-runtimes";
const folderName = process.env.AWS_EXECUTION_ENV;
const runtimeDirname = "/var/runtime";

module.exports.handler = async () => {
	const filenames = await readdir(runtimeDirname, { depth: Infinity, type: { file: true } });
	await Promise.all(
		filenames.map(
			limit(10, async filename => {
				process._rawDebug(
					"Copy", filename, "TO", bucketName, path.join(folderName, filename)
				);
				await s3Client
					.putObject({
						Body: Buffer.from(
							await fsp.readFile(path.resolve(runtimeDirname, filename))
						),
						Bucket: bucketName,
						Key: path.join(folderName, filename)
					})
					.promise();
				console.log("Uploaded", filename);
			})
		)
	);
	return { result: "OK" };
};
