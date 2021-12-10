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

createWallet("fuse_firstCollection"); // just put another name here and call in linux vm: node createWallet.js test / or prod for production wallet
createWallet("fuse_woa"); // just put another name here and call in linux vm: node createWallet.js test / or prod for production wallet
createWallet("woa"); // just put another name here and call in linux vm: node createWallet.js test / or prod for production wallet