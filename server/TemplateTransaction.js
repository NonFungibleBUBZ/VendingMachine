const { cardanocliJs } = require("./cardano");

let sender;

sender = cardanocliJs.wallet("woa"); // DEFINES THE POLICYID

const mintScript = {
    keyHash: cardanocliJs.addressKeyHash(sender.name),
    type: "sig",
};

const POLICY_ID = cardanocliJs.transactionPolicyid(mintScript);

const mintAsset = function (value, addressToSend) {

    uxtoArray = cardanocliJs.queryUtxo(sender.paymentAddr);

    let txIn = uxtoArray.find( // if receive any error relating to "undefined" it's because the value wasn't found in the wallet
        (element) => element.value.lovelace.toString() === value.toString()
    );


    const metadata1 = {
        721: {
            [POLICY_ID]: {
                ['assetName1']: {}, // you can put any asset name you want, in this case i'm getting from the _metadata
            },
        },
    };
    const metadata2 = {
        721: {
            [POLICY_ID]: {
                ['assetName2']: {}, // you can put any asset name you want, in this case i'm getting from the _metadata
            },
        },
    }; // in order to increase add one more line of these

// FIRST METADATA

    metadata1["721"][`${POLICY_ID}`]['assetName1'] =

        {
        files: [
            {
                mediaType: "video/mp4",
                src: "ipfs://QmPDzun94v9NFqw3wyhNXDbYQ2DvyW6qJN9rQwGuUVi8eX"
            }
        ],
        image: "ipfs://QmYsgUn1KnYVNimx5AWTcTajM6u5X458rUJk7Td4geqZWL",
        type: "image/gif",
        name: "Wonder Ada 3",
        Ticker: "WA01003",
        Collection: "Wonder ADA",
        Edition: "[ORI]",
        Costume: "Black Costume",
        Model: "1",
        Website: "https://www.nonfungiblebubz.com/",
    }


    //SECOND METADATA

    metadata2["721"][`${POLICY_ID}`]['assetName2'] =

        {
        files: [
            {
                mediaType: "video/mp4",
                src: "ipfs://QmPDzun94v9NFqw3wyhNXDbYQ2DvyW6qJN9rQwGuUVi8eX"
            }
        ],
        image: "ipfs://QmYsgUn1KnYVNimx5AWTcTajM6u5X458rUJk7Td4geqZWL",
        type: "image/gif",
        name: "Wonder Ada 4",
        Ticker: "WA01004",
        Collection: "Wonder ADA",
        Edition: "[ORI]",
        Costume: "Black Costume",
        Model: "1",
        Website: "https://www.nonfungiblebubz.com/",
    }


    const ASSET_ID1 = `${POLICY_ID}.wonderAda3`;
    const ASSET_ID2 = `${POLICY_ID}.wonderAda4`; // in order to increase add one more line of these

    let txInfo = {};

    txInfo = {
        txIn: [txIn],
        txOut: [
            {
                address: addressToSend,
                value: {
                    lovelace: value,
                    [ASSET_ID1]: 1,
                    [ASSET_ID2]: 1 // in order to increase add one more line of these
                },
            },
        ],
        mint: [
            { action: "mint", quantity: 1, asset: ASSET_ID1, script: mintScript },
            { action: "mint", quantity: 1, asset: ASSET_ID2, script: mintScript }, // in order to increase add one more line of these
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
}; // edit in order to make a new transaction

mintAsset(4, '')

