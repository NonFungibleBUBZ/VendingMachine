const { getEnv } = require("../../utils/getEnv");
const { cardanocliJs } = require("../../utils/cardano");
const { getAddressByTransactionId } = require( "../../refund/refund" );
const { getFakeWalletById } = require( "../../test/utils" );
const metadataArray = require('../metadata/metadata_firstCollection')
const { get_collections, update_collection, set_unavailable, get_availableBubz } = require('../controller')
const  MaintenanceObj  = require('../../maintenance/controller')
const {promisify} = require("util");
const readFile = promisify(require('fs').readFile)

// those are the autoMint methods, i'll do my best to explain what they do, and what they're for, any question message me on discord #Lrovaris#4065
// i'm online 24/7 there i'll be glad to help, or improve those scripts, or fix if there's anything not working properly





// declaration of wallet variable
let drop;
let fuseWallet = cardanocliJs.wallet("fuseWallet");
if (getEnv() === "testnet") { // the server runs on two enviroments test and prod, in the main server folder you should run like "npm start test"
    drop = cardanocliJs.wallet("testWallet"); // testNet wallet there's not much to explain
} else {
    drop = cardanocliJs.wallet("dropWallet"); // your wallet, right now 11/14/21 you still didn't sent me your wallet files (i don't even know if it's possible...)
}

 let maintenance = MaintenanceObj.MaintenanceObj()

// some variables declarations, we're going to need those later
let utxos = {};
let mints = [];
let refunds = [];
let isCharityDrop = maintenance.isCharity;
let charityValue = 0

let fuseCalled = 0
let mintCalled = 0

// defined those new variables based on the last messages 17/11/21, this way should be easy to set up token price, note that you may face some errors if you put some low values
// if the console shows errors like UtxoFailure -> valueNotConserved -> negativeValue ...etc it's because the tokenPrice is too low
let tokenPrice = maintenance.tokenPrice
let fusePrice = maintenance.fusionPrice


console.log(maintenance)

// this mint script is responsible for the policy ID VERY IMPORTANT!!!!!!!!!!!!
const mintScript = {
    keyHash: cardanocliJs.addressKeyHash(drop.name),
    type: "sig",
};
const POLICY_ID = cardanocliJs.transactionPolicyid(mintScript); // note the mintScript being passed as parameter

const firstWallet = // this should be your personal wallet to receive funds
    maintenance.dropWallet;

const secondWallet = // this should be the wallet of the charity project
    maintenance.charityWallet;

const devWallet = // and this is my wallet considered leaving it here, i've commented every script with detailed instructions, and i've made the server easy for you :3
    "addr1qxcd03zuth7gjlxwsgswfzm0tvk2x9z9ghgeljq6xt89hynfxr35pxlj7p3c8kv7w3ue6t52049s0y2gm73ezpsyul8sp3nkkj";


// useful method, i'll be using it to get the random wallet value, it runs passing as parameter two values, and then returns a random value between those two
const getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (
        max - min)) + min;
}
const getMetadata = async function (collectionName) {
    return require(`../metadata/metadata_${collectionName}.js`)
}

// this method is responsible for calling the createTxOut method based on enviroment
const createTxOut = function (addressToSend, ASSET_ID, value) {
    if (getEnv() === "testnet") {
        return testTxOut(addressToSend, ASSET_ID, value);
    }

    if (getEnv() === "mainnet") {
        return prodTxOut(addressToSend, ASSET_ID, value);
    }

    throw "enviroment not defined, try: test or prod"; // simple err throw
};
const createFuseTxOut = function (addressToSend, ASSET_ID, value, oldASSET_ID) {
    if (getEnv() === "testnet") {
        return testFuseTxOut(addressToSend, ASSET_ID, value, oldASSET_ID);
    }

    if (getEnv() === "mainnet") {
        return prodFuseTxOut(addressToSend, ASSET_ID, value, oldASSET_ID);
    }

    throw "enviroment not defined, try: test or prod"; // simple err throw
};

const prodFuseTxOut = function (addressToSend, ASSET_ID, value, oldASSET_ID) {

    let currentValue = value; // currentValue declaration thats what you going to receive at the end

    const clientValue = cardanocliJs.toLovelace(1.5); // the minimun value to send along with the token
    const disposalValue = cardanocliJs.toLovelace(1.5);

    currentValue -= clientValue + disposalValue;

    const valorRovaris = cardanocliJs.toLovelace(1); // 1 ada to the dev

    currentValue -= valorRovaris; // to remove my part you should remove this

    const firstValue = currentValue; // the remaining for you

    let txOutArray = [
        {
            address: firstWallet,
            value: { lovelace: firstValue },
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
        {
            address: '',
            value: {
                lovelace: disposalValue,
                [oldASSET_ID]: 1,
            },
        },
    ];

    return txOutArray;
};
const prodTxOut = function (addressToSend, ASSET_ID, value) {

    let currentValue = value; // currentValue declaration thats what you going to receive at the end

    const clientValue = cardanocliJs.toLovelace(1.5); // the minimun value to send along with the token

    currentValue -= clientValue;

    const secondValue = Math.floor(0.4 * currentValue); // 40% to the second wallet

    currentValue -= secondValue;

    const valorRovaris = cardanocliJs.toLovelace(1); // 1 ada to the dev

    currentValue -= valorRovaris; // to remove my part you should remove this

    const firstValue = currentValue; // the remaining for you

    let txOutArray = []

    if (isCharityDrop) {
        charityValue = (secondValue / 1000000)
        txOutArray = [
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
    } else {
        txOutArray = [
            {
                address: firstWallet,
                value: { lovelace: firstValue + secondValue },
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
    }


    return txOutArray;
};
const testFuseTxOut = function (addressToSend, ASSET_ID, value, oldASSET_ID) { // test method, you shouldn't care much fro this, will be used fro test purposes only, but is the same transaction as the prod above
    const carteiraUm = getFakeWalletById(1).paymentAddr;

    const carteiraDois = getFakeWalletById(2).paymentAddr;

    const carteiraTres = getFakeWalletById(3).paymentAddr;

    const carteiraQuatro = getFakeWalletById(4).paymentAddr;

    let currentValue = value;

    const valorUm = cardanocliJs.toLovelace(1);

    currentValue -= valorUm;

    const clientValue = cardanocliJs.toLovelace(1.5);

    const disposalValue = cardanocliJs.toLovelace(1.5);

    currentValue -= clientValue;
    currentValue -= disposalValue;

    const valorDois = Math.floor(0.25 * currentValue);

    currentValue -= valorDois;

    const valorTres = currentValue;

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
        },{
            address: carteiraQuatro,
            value: {
                lovelace: disposalValue,
                [oldASSET_ID]: 1,
            },
        },
    ];

    return txOutArray;
};
const testTxOut = function (addressToSend, ASSET_ID, value) { // test method, you shouldn't care much for this, will be used for test purposes only, but is the same transaction as the prod above
    const carteiraUm = getFakeWalletById(1).paymentAddr;

    const carteiraDois = getFakeWalletById(2).paymentAddr;

    const carteiraTres = getFakeWalletById(3).paymentAddr;

    let currentValue = value;

    const valorUm = cardanocliJs.toLovelace(1);

    currentValue -= valorUm;

    const clientValue = cardanocliJs.toLovelace(1.5);

    currentValue -= clientValue;

    const valorDois = Math.floor(0.25 * currentValue);

    currentValue -= valorDois;

    const valorTres = currentValue;

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

const walletPayAddr = function (walletName) {
    return cardanocliJs.wallet(walletName).paymentAddr
}





// the method that is called from the http request
// it works this way, the first method call, puts the info from the wallet inside an array, when it's called the second time, if there's still the value inside the array,
// it handles the mint transaction
const autoMintHandler = function (req, res) {


    mintCalled++
    console.log(mintCalled)

    const currentUtxos = cardanocliJs.wallet(req.params.id).balance().utxo; // declaration of wallet content
    console.log(currentUtxos)

    for (let i = 0; i < currentUtxos.length; i++) { // one loop for each transaction hash in wallet
        const utxo = currentUtxos[i];
        utxo.txHash;


        if (utxos[utxo.txHash] === true) { // if it stills there
            getAddressByTransactionId(utxo.txHash,req.params.id, async (address) => { // gets wallet address by blockFrost

                let availableBubz = await get_availableBubz(req.params.id) // get the current available bubz in the database

                setTimeout( ()=> { // after that runs bellow
                    console.log(tokenPrice, utxo.value.lovelace, utxo.value.lovelace === tokenPrice)
                    if (utxo.value.lovelace === tokenPrice) { // if the value is different from 25 Ada it gets refunded
                        let index = getRandomInt(0, availableBubz.length) // random bub from the method i've created before, starting from index 0 to the total available bubz

                        console.log(getMetadata(req.params.id)[index])
                        let x = getMetadata(req.params.id)
                        console.log(x[0])
                        mints = [ // array of last mints
                            ...mints,
                            { name: getMetadata(req.params.id)[index].name, date: Date.now()},
                        ];

                        mint(address, utxo, getMetadata(req.params.id)[index], index); // call the mint method

                        utxos[utxo.txHash] = false;
                    } else { //handle refund
                        console.log('refund?')
                        const refundValue = utxo.value.lovelace;

                        refunds = [
                            ...refunds,
                            { address: address, value: refundValue, txHash: utxo.txHash },
                        ];

                        makeRefund(address, refundValue, utxo, req.params.id);

                        utxos[utxo.txHash] = false;

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
        txOut: createTxOut(receiver, ASSET_ID, cardanocliJs.toLovelace(tokenPrice)), // create transaction out method that've created before
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
        signingKeys: [drop.payment.skey],
    });

    const txHash = cardanocliJs.transactionSubmit(txSigned); // send the transaction to the blockchain


    if (txHash) { // if the transaction ocurred without error then it sets the bub unavailable
        set_unavailable(index, 'firstCollection', fee, isCharityDrop, charityValue).then( ()=> {
        })
    }
};

const makeRefund = function (receiver, refundValue, utxo, walletName) { // make refund method

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


    const txSigned = cardanocliJs.transactionSign({txBody: tx, signingKeys: [cardanocliJs.wallet(walletName).payment.skey],})

    const txHash = cardanocliJs.transactionSubmit(txSigned);
    console.log(txHash)
};

const fuseHandler = function (req, res) {

    fuseCalled++
    console.log(fuseCalled)

    const currentUtxos = fuseWallet.balance().utxo; // declaration of wallet content

    console.log(currentUtxos)

    for (let i = 0; i < currentUtxos.length; i++) { // one loop for each transaction hash in wallet

        const utxo = currentUtxos[i];
        utxo.txHash;

        if (utxos[utxo.txHash] === true) { // if it stills there
            getAddressByTransactionId(utxo.txHash,true, async (address) => { // gets wallet address by blockFrost

                let availableBubz = await get_availableBubz() // get the current available bubz in the database

                setTimeout( ()=> { // after that runs bellow
                    //fuse verification
                    if (Object.keys(utxo.value)[1] && Object.keys(utxo.value)[1].includes(POLICY_ID) && utxo.value.lovelace === fusePrice) {

                        // if there's an token on the utxo and it has the policyId and the value with it is 25 ada
                        let thisBud = Object.keys(utxo.value)[1].substring(63,67)
                        thisBud = parseInt(thisBud)
                        thisBud -= 1

                        let index = getRandomInt(thisBud, availableBubz.length) // random bub from the method i've created before, starting from index 0 to the total available bubz

                        while (index > availableBubz.length) {
                            index = getRandomInt(thisBud, availableBubz.length)
                        }

                        mints = [ // array of last mints
                            ...mints,
                            { name: getMetadata(req.params.id)[availableBubz[index].name], date: Date.now()},
                        ];

                        fuse(address, utxo, getMetadata(req.params.id)[availableBubz[index].index], index); // call the mint method

                        utxos[utxo.txHash] = false;
                    } else { //handle refund
                        const refundValue = utxo.value.lovelace;

                        refunds = [
                            ...refunds,
                            { address: address, value: refundValue, txHash: utxo.txHash },
                        ];

                        makeRefund(address, refundValue, utxo, req.params.id);

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

const fuse = function (receiver, utxo, _metadata, index) {

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
        txOut: createFuseTxOut(receiver, ASSET_ID, cardanocliJs.toLovelace(fusePrice), Object.keys(utxo.value)[1]), // create transaction out method that've created before
        mint: [
            { action: "mint", quantity: 1, asset: ASSET_ID, script: mintScript }, // note the mintScript
        ],
        metadata, // note the metadata here
        witnessCount: 3
    };

    const raw = cardanocliJs.transactionBuildRaw(txInfo); //build the transaction raw

    const fee = cardanocliJs.transactionCalculateMinFee({ // calculates the fee
        ...txInfo,
        txBody: raw,
        witnessCount: 3,
    });

    txInfo.txOut[0].value.lovelace -= fee; // value minus fee

    const tx = cardanocliJs.transactionBuildRaw({ ...txInfo, fee }); // build the actual transaction

    const txSigned = cardanocliJs.transactionSign({ // sign the transaction
        txBody: tx,
        signingKeys: [drop.payment.skey, fuseWallet.payment.skey],
    });

    const txHash = cardanocliJs.transactionSubmit(txSigned); // send the transaction to the blockchain

    if (txHash) { // if the transaction ocurred without error then it sets the bub unavailable
        set_unavailable(index).then( ()=> {
        })
    }
};

const testHandler = function (req, res) {
    res
        .status(200)
        .json({ collection: req.params.id});
}



module.exports = { autoMintHandler, fuseHandler, testHandler }