"use strict";

const path    = require("path")
    , readdir = require("fs2/readdir")
    , AdmZip  = require("adm-zip");

module.exports = async functionRoot => {
	const lambdaFiles = await readdir(functionRoot, { depth: Infinity, type: { file: true } });
	const zip = new AdmZip();

	for (const file of lambdaFiles) {
		zip.addLocalFile(path.resolve(functionRoot, file), path.dirname(file));
	}

	return zip.toBuffer();
};
