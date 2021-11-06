const getEnv = function () {
	const env = process.argv[2];
	if (env === "prod") {
		return "mainnet";
	} else if (env === "test") {
		return "testnet";
	} else {
		throw "enviroment not defined -> try:// node scriptName.js test";
	}
};

module.exports = { getEnv };
