const { cardanocliJs } = require("../utils/cardano");

const sendFakeAdas = function (sender, transactionValue) {
	console.log('hm')
	return
	const receiver =
		"addr_test1qzar5myuajym776gpq6neklx8cyd8reg6ujvswcj8xkjdmnl098xjvtpy9qqt5kq0f59dfejyn934k9a9lrmtc65msssf7l295";

	const txInfo = {
		txIn: cardanocliJs.queryUtxo(sender.paymentAddr),
		txOut: [
			{
				address: sender.paymentAddr,
				value: {
					lovelace:
						sender.balance().value.lovelace -
						cardanocliJs.toLovelace(transactionValue),
				},
			},
			{
				address: receiver,
				value: {
					lovelace: cardanocliJs.toLovelace(transactionValue),
				},
			},
		],
	};


	const raw = cardanocliJs.transactionBuildRaw(txInfo);

	const fee = cardanocliJs.transactionCalculateMinFee({
		...txInfo,
		txBody: raw,
		witnessCount: 1,
	});

	txInfo.txOut[0].value.lovelace -= fee;

	const tx = cardanocliJs.transactionBuildRaw({ ...txInfo, fee });

	const txSigned = cardanocliJs.transactionSign({
		txBody: tx,
		signingKeys: [sender.payment.skey],
	});

	console.log('aaaaaaaaaaaa')

	const txHash = cardanocliJs.transactionSubmit(txSigned);

	console.log(txHash);
};

module.exports = { sendFakeAdas };
