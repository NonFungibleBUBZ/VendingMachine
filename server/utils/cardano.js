const CardanocliJs = require("cardanocli-js");
const os = require("os");
const path = require("path");

const { getEnv } = require("./getEnv");

const dir = path.join(os.homedir(), "vendingMachine/server");

const shelleyPath = path.join(
	os.homedir(),
	`${getEnv()}-relay`,
	`${getEnv()}-shelley-genesis.json`
);

const cardanocliJs = new CardanocliJs({
	//   era: "mary",
	era: "alonzo",
	network: getEnv() == "testnet" ? "testnet-magic 1097911063" : "mainnet",
	dir,
	shelleyGenesisPath: shelleyPath
});

console.log(cardanocliJs.queryUtxo('addr_test1qzar5myuajym776gpq6neklx8cyd8reg6ujvswcj8xkjdmnl098xjvtpy9qqt5kq0f59dfejyn934k9a9lrmtc65msssf7l295'))

module.exports = { cardanocliJs };
