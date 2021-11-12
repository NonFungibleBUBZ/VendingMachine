const { getEnv } = require("../../utils/getEnv");
const { cardanocliJs } = require("../../utils/cardano");
const { getAddressByTransactionId } = require( "../../refund/refund" );
const { getFakeWalletById } = require( "../../test/utils" );
const metadataArray = require('../metadata/metadata_first_collection')
const { get_collections, update_collection, set_unavailable } = require('../controller')
const { get_availableBubz } = require( "../db" );



let wallet;

if (getEnv() === "testnet") {
    // input of wallet, TODO make it trough controller
    wallet = cardanocliJs.wallet("testWallet");
} else {
    wallet = cardanocliJs.wallet("");
}

let utxos = {};

let mints = [];

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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (
        max - min)) + min;
}

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

    const clientValue = cardanocliJs.toLovelace(1.5);

    valorAtual -= clientValue;

    const secondValue = Math.floor(0.4 * valorAtual);

    valorAtual -= secondValue;

    const valorRovaris = cardanocliJs.toLovelace(1);

    valorAtual -= valorRovaris;

    const firstValue = valorAtual;

    let txOutArray = [
        {
            address: firstWallet,
            value: { lovelace: firstValue },
        },
        {
            address: secondWallet,
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

const autoMintHandler = function (req, res) {

    const currentUtxos = wallet.balance().utxo;

    console.log(currentUtxos, " currentUtxos")

    for (let i = 0; i < currentUtxos.length; i++) {
        const utxo = currentUtxos[i];

        utxo.txHash;

        if (utxos[utxo.txHash] === true) {
            getAddressByTransactionId(utxo.txHash, async (address) => {

                let availableBudz = await get_availableBubz()


                setTimeout( ()=> {

                    console.log(availableBudz, " availableBudz")

                    mints = [
                        ...mints,
                        { address: address, txHash: utxo.txHash },
                    ];

                    let index = getRandomInt(0, availableBudz.length)

                    mint(address, utxo, metadataArray[availableBudz[index].index], index);

                    utxos[utxo.txHash] = false;

                    console.table(mints);
                },0)

            });
        } else {
            utxos[utxo.txHash] = true;
        }
    }

    res
        .status(200)
        .json({ message: "mint array updated", data: JSON.stringify(mints) });
};

const mint = function (receiver, utxo, _metadata, index) {
    const sender = wallet;

    const metadata = {
        721: {
            [POLICY_ID]: {
                [_metadata.name.replace(/[^A-Z0-9]+/ig, "")]: {},
            },
        },
    };

    metadata["721"][`${POLICY_ID}`][_metadata.name.replace(/[^A-Z0-9]+/ig, "")] =
        _metadata;
    const ASSET_ID = `${POLICY_ID}.${_metadata.name.replace(/[^A-Z0-9]+/ig, "")}`;

    const txInfo = {
        txIn: [utxo],
        txOut: createTxOut(receiver, ASSET_ID, cardanocliJs.toLovelace(25)),
        mint: [
            { action: "mint", quantity: 1, asset: ASSET_ID, script: mintScript },
        ],
        metadata,
        witnessCount: 2
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

    const txHash = cardanocliJs.transactionSubmit(txSigned);

    if (txHash) {
        set_unavailable(index).then( ()=> {
            console.log(txHash)
        })
    }
};

module.exports = { autoMintHandler }