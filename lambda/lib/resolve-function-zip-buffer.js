"use strict";

const path   = require("path")
    , fs     = require("fs").promises
    , AdmZip = require("adm-zip");

const functionRoot = path.resolve(__dirname, "../function");

module.exports = async () => {
	const lambdaFiles = await fs.readdir(functionRoot);
	const zip = new AdmZip();

	for (const file of lambdaFiles) zip.addLocalFile(path.resolve(functionRoot, file));

	return zip.toBuffer();
};
