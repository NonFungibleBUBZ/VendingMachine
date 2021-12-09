const { cardanocliJs } = require('../utils/cardano')
const { getFakeWalletById } = require( "./utils" );

const sendFakeAdas = function (sender, transactionValue) {
	const receiver =
		cardanocliJs.wallet('firstCollection').paymentAddr;

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


sendFakeAdas(getFakeWalletById(0), 25.123456)

module.exports = { sendFakeAdas };
