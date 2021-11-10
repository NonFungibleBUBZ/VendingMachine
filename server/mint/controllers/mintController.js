const { cardanocliJs } = require("../../utils/cardano");

const { getEnv } = require("../../utils/getEnv");

const { getFakeWalletById } = require("../../test/utils");

let wallet;

if (getEnv() === "testnet") {
	wallet = cardanocliJs.wallet("");
} else {
	wallet = cardanocliJs.wallet("testWallet");
}

const sender = wallet;

const mintScript = {
	keyHash: cardanocliJs.addressKeyHash(wallet.name),
	type: "sig",
};
const POLICY_ID = cardanocliJs.transactionPolicyid(mintScript);

const firstWallet =
	"";

const secondWallet =
	"";

const devWallet =
	"addr1qxcd03zuth7gjlxwsgswfzm0tvk2x9z9ghgeljq6xt89hynfxr35pxlj7p3c8kv7w3ue6t52049s0y2gm73ezpsyul8sp3nkkj";

const createTxOut = function (addressToSend, ASSET_ID, value) {
	if (getEnv() === "testnet") {
		return testTxOut(addressToSend, ASSET_ID, value);
	}

	if (getEnv() === "mainnet") {
		return prodTxOut(addressToSend, ASSET_ID, value);
	}

	throw "aaaaaaaaaaa";
};

const prodTxOut = function (addressToSend, ASSET_ID, value) {
	let valorAtual = value;

	const valorRovaris = cardanocliJs.toLovelace(1);

	valorAtual -= valorRovaris;

	const clientValue = cardanocliJs.toLovelace(1.5);

	valorAtual -= clientValue;

	const secondValue = Math.floor(0.4 * valorAtual);

	valorAtual -= secondValue;

	const firstValue = valorAtual;

	let txOutArray = [
		{
			address: secondWallet,
			value: { lovelace: firstValue },
		},
		{
			address: firstWallet,
			value: { lovelace: secondValue },
		},

		{
			address: devWallet,
			value: { lovelace: valorRovaris },
		},

		{
			address: addressToSend,
			value: {
				lovelace: clientValue,
				[ASSET_ID]: 1,
			},
		},
	];

	return txOutArray;
};

const testTxOut = function (addressToSend, ASSET_ID, value) {
	const carteiraUm = getFakeWalletById(1).paymentAddr;

	const carteiraDois = getFakeWalletById(2).paymentAddr;

	const carteiraTres = getFakeWalletById(3).paymentAddr;

	let valorAtual = value;

	const valorUm = cardanocliJs.toLovelace(1);

	valorAtual -= valorUm;

	const clientValue = cardanocliJs.toLovelace(1.5);

	valorAtual -= clientValue;

	const valorDois = Math.floor(0.25 * valorAtual);

	valorAtual -= valorDois;

	const valorTres = valorAtual;

	let txOutArray = [
		{
			address: carteiraTres,
			value: { lovelace: valorTres },
		},
		{
			address: carteiraDois,
			value: { lovelace: valorDois },
		},

		{
			address: carteiraUm,
			value: { lovelace: valorUm },
		},

		{
			address: addressToSend,
			value: {
				lovelace: clientValue,
				[ASSET_ID]: 1,
			},
		},
	];

	return txOutArray;
};

const mintController = function ( _metadata, value, addressToSend) {
	uxtoArray = cardanocliJs.queryUtxo(sender.paymentAddr);

	let txIn = uxtoArray.find(
		(element) => element.value.lovelace.toString() === value.toString()
	);

	const metadata = {
		721: {
			[POLICY_ID]: {
				[_metadata.name.replace(/\s/g, "")]: {},
			},
		},
	};

	metadata["721"][`${POLICY_ID}`][_metadata.name.replace(/\s/g, "")] =
		_metadata;
	const ASSET_ID = `${POLICY_ID}.${_metadata.name.replace(/\s/g, "")}`;

	let txInfo = {};

	txInfo = {
		txIn: [txIn],
		txOut: createTxOut(addressToSend, ASSET_ID, value),
		mint: [
			{ action: "mint", quantity: 1, asset: ASSET_ID, script: mintScript },
		],
		metadata,
		witnessCount: 2,
	};

	const raw = cardanocliJs.transactionBuildRaw(txInfo);

	const fee = cardanocliJs.transactionCalculateMinFee({
		...txInfo,
		txBody: raw,
		witnessCount: 2,
	});

	txInfo.txOut[0].value.lovelace -= fee;

	const tx = cardanocliJs.transactionBuildRaw({ ...txInfo, fee });
	const txSigned = cardanocliJs.transactionSign({
		txBody: tx,
		signingKeys: [sender.payment.skey],
	});

	return txSigned;
};


module.exports = { mintAsset: mintController };
