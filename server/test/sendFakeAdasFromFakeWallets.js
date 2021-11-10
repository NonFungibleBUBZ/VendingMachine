const  cardano   = require("../utils/cardano");

const sendFakeAdas = function (sender, transactionValue) {
	const receiver =
		"addr_test1qzar5myuajym776gpq6neklx8cyd8reg6ujvswcj8xkjdmnl098xjvtpy9qqt5kq0f59dfejyn934k9a9lrmtc65msssf7l295";

	const txInfo = {
		txIn: cardano.queryUtxo(sender.paymentAddr),
		txOut: [
			{
				address: sender.paymentAddr,
				value: {
					lovelace:
						sender.balance().value.lovelace -
						cardano.toLovelace(transactionValue),
				},
			},
			{
				address: receiver,
				value: {
					lovelace: cardano.toLovelace(transactionValue),
				},
			},
		],
	};


	const raw = cardano.transactionBuildRaw(txInfo);

	const fee = cardano.transactionCalculateMinFee({
		...txInfo,
		txBody: raw,
		witnessCount: 1,
	});

	txInfo.txOut[0].value.lovelace -= fee;

	const tx = cardano.transactionBuildRaw({ ...txInfo, fee });

	const txSigned = cardano.transactionSign({
		txBody: tx,
		signingKeys: [sender.payment.skey],
	});

	console.log('aaaaaaaaaaaa')

	const txHash = cardano.transactionSubmit(txSigned);

	console.log(txHash);
};


sendFakeAdas('fake-wallet-0', 25123456)

module.exports = { sendFakeAdas };
