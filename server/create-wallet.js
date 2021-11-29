const { cardanocliJs } = require("./utils/cardano");

const createWallet = (account) => {
	const payment = cardanocliJs.addressKeyGen(account);
	const stake = cardanocliJs.stakeAddressKeyGen(account);
	cardanocliJs.stakeAddressBuild(account);
	cardanocliJs.addressBuild(account, {
		paymentVkey: payment.vkey,
		stakeVkey: stake.vkey,
	});
	return cardanocliJs.wallet(account);
};

createWallet("dropWallet"); // just put another name here and call in linux vm: node createWallet.js test / or prod to create an production wallet
