const { getFakeWallets } = require("./utils");
const { cardanocliJs } = require( "../utils/cardano" );

const logWalletAddresses = function () {
	/*
	console.log(cardanocliJs.wallet('testWallet').paymentAddr)
	*/
	const wallets = getFakeWallets();

	for (let i = 0; i < wallets.length; i++) {
		console.log(JSON.stringify(wallets[i].paymentAddr(), null,4));

	}
};

logWalletAddresses();

