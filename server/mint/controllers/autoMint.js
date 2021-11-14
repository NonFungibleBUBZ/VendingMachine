const { getEnv } = require("../../utils/getEnv");
const { cardanocliJs } = require("../../utils/cardano");
const { getAddressByTransactionId } = require( "../../refund/refund" );
const { getFakeWalletById } = require( "../../test/utils" );
const metadataArray = require('../metadata/metadata_first_collection')
const { get_collections, update_collection, set_unavailable, get_availableBubz } = require('../controller')

// those are the autoMint methods, i'll do my best to explain what they do, and what they're for, any question message me on discord #Lrovaris#4065
// i'm online 24/7 there i'll be glad to help, or improve those scripts, or fix if there's anything not working properly

// declaration of wallet variable
let wallet;
let fuseWallet = cardanocliJs.wallet("fuseWallet");
if (getEnv() === "testnet") { // the server runs on two enviroments test and prod, in the main server folder you should run like "npm start test"
    wallet = cardanocliJs.wallet("testWallet"); // testNet wallet there's not much to explain
} else {
    wallet = cardanocliJs.wallet(""); // your wallet, right now 11/14/21 you still didn't sent me your wallet files (i don't even know if it's possible...)
}

// some variables declarations, we're going to need those later
let utxos = {};
let mints = [];
let refunds = [];

// this mint script is responsible for the policy ID VERY IMPORTANT!!!!!!!!!!!!
const mintScript = {
    keyHash: cardanocliJs.addressKeyHash(wallet.name),
    type: "sig",
};
const POLICY_ID = cardanocliJs.transactionPolicyid(mintScript); // note the mintScript being passed as parameter

const firstWallet = // this should be your personal wallet to receive funds
    "";

const secondWallet = // this should be the wallet of the charity project
    "";

const devWallet = // and this is my wallet considered leaving it here, i've comented every script with detailed instructions, and i've made the server easy for you :3
    "addr1qxcd03zuth7gjlxwsgswfzm0tvk2x9z9ghgeljq6xt89hynfxr35pxlj7p3c8kv7w3ue6t52049s0y2gm73ezpsyul8sp3nkkj";


// useful method, i'll be using it to get the random drop value, it runs passing as parameter two values, and then returns a random value between those two
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (
        max - min)) + min;
}

// this method is reponsible for calling the createTxOut method based on enviroment
const createTxOut = function (addressToSend, ASSET_ID, value) {
    if (getEnv() === "testnet") {
        return testTxOut(addressToSend, ASSET_ID, value);
    }

    if (getEnv() === "mainnet") {
        return prodTxOut(addressToSend, ASSET_ID, value);
    }

    throw "enviroment not defined, try: test or prod"; // simple err throw
};


// production transaction build
const prodTxOut = function (addressToSend, ASSET_ID, value) {

    let valorAtual = value; // currentValue declaration thats what you going to receive at the end

    const clientValue = cardanocliJs.toLovelace(1.5); // the minimun value to send along with the token

    valorAtual -= clientValue;

    const secondValue = Math.floor(0.4 * valorAtual); // 40% to the second wallet

    valorAtual -= secondValue;

    const valorRovaris = cardanocliJs.toLovelace(1); // 1 ada to the dev

    valorAtual -= valorRovaris; // to remove my part you should remove this

    const firstValue = valorAtual; // the remaining for you

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
            value: { lovelace: valorRovaris }, // to remove my part from the transaction just remove this object
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

const testTxOut = function (addressToSend, ASSET_ID, value) { // test method, you shouldn't care much fro this, will be used fro test purposes only, but is the same transaction as the prod above
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


// the method that is called from the http request
// it works this way, the first method call, puts the info from the wallet inside an array, when it's called the second time, if there's still the value inside the array,
// it handles the mint transaction
const autoMintHandler = function (req, res) {

    const currentUtxos = wallet.balance().utxo; // declaration of wallet content

    for (let i = 0; i < currentUtxos.length; i++) { // one loop for each transaction hash in wallet
        const utxo = currentUtxos[i];
        utxo.txHash;


        if (utxos[utxo.txHash] === true) { // if it stills there
            getAddressByTransactionId(utxo.txHash, async (address) => { // gets sender address by blockFrost

                let availableBubz = await get_availableBubz() // get the current available bubz in the database

                setTimeout( ()=> { // after that runs bellow

                    if (utxo.value === 25000000) { // if the value is different from 25 Ada it gets refunded
                        let index = getRandomInt(0, availableBubz.length) // random bub from the method i've created before, starting from index 0 to the total available bubz

                        mints = [ // array of last mints
                            ...mints,
                            { name: metadataArray[availableBubz[index].name], date: Date.now()},
                        ];

                        mint(address, utxo, metadataArray[availableBubz[index].index], index); // call the mint method

                        utxos[utxo.txHash] = false;
                    } else { //handle refund
                        const refundValue = utxo.value.lovelace;

                        refunds = [
                            ...refunds,
                            { address: address, value: refundValue, txHash: utxo.txHash },
                        ];

                        makeRefund(address, refundValue, utxo);

                        utxos[utxo.txHash] = false;

                        console.table(refunds);
                    }

                },0)

            });
        } else {
            utxos[utxo.txHash] = true; // puts in the transactions to mint
        }
    }

    res
        .status(200)
        .json({ message: "mint array updated", data: JSON.stringify(mints) });
};

const mint = function (receiver, utxo, _metadata, index) {
    const sender = wallet;

    const metadata = { // declares the basse of the transaction metadata
        721: {
            [POLICY_ID]: {
                [_metadata.name.replace(/[^A-Z0-9]+/ig, "")]: {},
            },
        },
    };

    // then adds the name and metadata from the metadataArray that was passed trough parameter
    metadata["721"][`${POLICY_ID}`][_metadata.name.replace(/[^A-Z0-9]+/ig, "")] =
        _metadata;
    const ASSET_ID = `${POLICY_ID}.${_metadata.name.replace(/[^A-Z0-9]+/ig, "")}`;

    const txInfo = {
        txIn: [utxo],
        txOut: createTxOut(receiver, ASSET_ID, cardanocliJs.toLovelace(25)), // create transaction out method that've created before
        mint: [
            { action: "mint", quantity: 1, asset: ASSET_ID, script: mintScript }, // note the mintScript
        ],
        metadata, // note the metadata here
        witnessCount: 2
    };

    const raw = cardanocliJs.transactionBuildRaw(txInfo); //build the transaction raw

    const fee = cardanocliJs.transactionCalculateMinFee({ // calculates the fee
        ...txInfo,
        txBody: raw,
        witnessCount: 1,
    });

    txInfo.txOut[0].value.lovelace -= fee; // value minus fee

    const tx = cardanocliJs.transactionBuildRaw({ ...txInfo, fee }); // build the actual transaction

    const txSigned = cardanocliJs.transactionSign({ // sign the transaction
        txBody: tx,
        signingKeys: [sender.payment.skey],
    });

    const txHash = cardanocliJs.transactionSubmit(txSigned); // send the transaction to the blockchain

    if (txHash) { // if the transaction ocurred without error then it sets the bub unavailable
        set_unavailable(index).then( ()=> {
        })
    }
};

const makeRefund = function (receiver, refundValue, utxo) { // make refund method
    const sender = wallet;

    const txInfo = {
        txIn: [utxo],
        txOut: [
            {
                address: receiver,
                value: {
                    lovelace: refundValue,
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

    const txHash = cardanocliJs.transactionSubmit(txSigned);
};

const fuseHandler = function () {

    console.log(fuseWallet.paymentAddr)

    const currentUtxos = fuseWallet.balance().utxo; // declaration of wallet content

    for (let i = 0; i < currentUtxos.length; i++) { // one loop for each transaction hash in wallet
        const utxo = currentUtxos[i];
        utxo.txHash;
        console.log(fuseWallet.paymentAddr)
        console.log()
        Object.keys(utxo.value)
        var x =  Object.keys(utxo.value)[1]
        console.log(x)
        console.log(x.includes('72a347b015f5da23a00e5208f58bbff3c5a17f623386337308a5709f'))

        return
        if (utxos[utxo.txHash] === true) { // if it stills there
            getAddressByTransactionId(utxo.txHash, async (address) => { // gets sender address by blockFrost

                let availableBubz = await get_availableBubz() // get the current available bubz in the database

                setTimeout( ()=> { // after that runs bellow

                    if (Object.keys(utxo.value)[1]) { // if there's
                        let index = getRandomInt(0, availableBubz.length) // random bub from the method i've created before, starting from index 0 to the total available bubz

                        mints = [ // array of last mints
                            ...mints,
                            { name: metadataArray[availableBubz[index].name], date: Date.now()},
                        ];

                        mint(address, utxo, metadataArray[availableBubz[index].index], index); // call the mint method

                        utxos[utxo.txHash] = false;
                    } else { //handle refund
                        const refundValue = utxo.value.lovelace;

                        refunds = [
                            ...refunds,
                            { address: address, value: refundValue, txHash: utxo.txHash },
                        ];

                        makeRefund(address, refundValue, utxo);

                        utxos[utxo.txHash] = false;

                        console.table(refunds);
                    }

                },0)

            });
        } else {
            utxos[utxo.txHash] = true; // puts in the transactions to mint
        }
    }

    /*res
        .status(200)
        .json({ message: "mint array updated", data: JSON.stringify(mints) });*/
};


module.exports = { autoMintHandler, fuseHandler }