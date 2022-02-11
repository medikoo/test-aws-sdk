#!/usr/bin/env node

"use strict";

console.trace("INTERNAL EXTENSION", Date.now());
console.trace("INTERNAL EXTENSION: ARGV", process.argv);

process.env.TEST_EXTENSION_INTERNAL = "value";
global.internalExtensionObject = { internal: "extension" };

// const childProcess = require("child_process");

// const [command, ...args] = process.argv.slice(2);

// console.log(require("fs").readFileSync("/var/runtime/LogPatch.js", "utf-8"));

// console.log("ATTEMTP TO RUN", command, args);
// childProcess.spawnSync(command, args, { stdio: "inherit" });
