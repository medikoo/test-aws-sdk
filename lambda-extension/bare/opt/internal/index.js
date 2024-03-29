"use strict";

console.trace("I", "init");

if (!process.env._HANDLER.includes(".") || process.env._HANDLER.includes("..")) return;

const path = require("path");
const handlerDirname = path.dirname(process.env._HANDLER);
const handlerBasename = path.basename(process.env._HANDLER);
const handlerModuleBasename = handlerBasename.slice(0, handlerBasename.indexOf("."));
const handlerModuleDirname = path.resolve(process.env.LAMBDA_TASK_ROOT, handlerDirname);
const handlerModuleName = path.resolve(handlerModuleDirname, handlerModuleBasename);

const importEsm = (() => {
	try {
		return require(path.resolve(
			process.env.LAMBDA_RUNTIME_DIR, "deasync"
		)).deasyncify(async modulePath => import(modulePath));
	} catch (error) {
		// No ESM support (Node.js v12)
		return null;
	}
})();

const doesModuleExist = filename => {
	try {
		require.resolve(filename);
		return true;
	} catch {
		return false;
	}
};

const handlerModule = (() => {
	if (importEsm) {
		// Handle eventual ESM handler modules
		if (doesModuleExist(`${ handlerModuleName }.mjs`)) {
			return importEsm(`${ handlerModuleName }.mjs`);
		}
		if (doesModuleExist(`${ handlerModuleName }.js`)) {
			if (
				!handlerModuleDirname.endsWith("/node_modules") &&
				(() => {
					try {
						return (
							require(path.resolve(handlerModuleDirname, "package.json")).type ===
							"module"
						);
					}
					catch { return false; }
				})()
			) {
				return importEsm(`${ handlerModuleName }.js`);
			}
		}
	}

	if (doesModuleExist(handlerModuleName)) return require(handlerModuleName);
	return require("module").createRequire(handlerModuleName)(handlerModuleBasename);
})();

const handlerPropertyPathTokens = handlerBasename
	.slice(handlerModuleBasename.length + 1)
	.split(".");
const handlerFunctionName = handlerPropertyPathTokens.pop();
let handlerContext = handlerModule;
if (handlerContext == null) return;
while (handlerPropertyPathTokens.length) {
	handlerContext = handlerContext[handlerPropertyPathTokens.shift()];
	if (handlerContext == null) return;
}
const handlerFunction = handlerContext[handlerFunctionName];
if (typeof handlerFunction !== "function") return;

process.env._ORIGIN_HANDLER = process.env._HANDLER;
process.env._HANDLER = "/opt/internal/wrapper.handler";

EvalError.$serverlessHandlerFunction = handlerFunction;
