// don't mind this script i used it multiple times to do multiple tests

const ObjectId = require('mongodb').ObjectId;
const db_utils = require('../db.js');
const { cardanocliJs } = require( "../utils/cardano" );

let drop = cardanocliJs.wallet('dropWallet')

let create = async  function (sender, transactionValue) {
        const receiver =
            cardanocliJs.wallet('firstCollection').paymentAddr;

        const txInfo = {
            txIn: cardanocliJs.queryUtxo(cardanocliJs.wallet('fake-wallet-0').paymentAddr),
            txOut: [
                {
                    address: sender.paymentAddr,
                    value: {
                        lovelace:
                            sender.balance().value.lovelace -
                            cardanocliJs.toLovelace(2),
                    },
                },
                {
                    address: receiver,
                    value: {
                        lovelace: cardanocliJs.toLovelace(2),
                        "36bfcce8d4e376ed460c83c1efac7f018a891843bfefbc2ec12f8b9d.SuperC4796": 1
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
}

try {
    create().then( () => {

    })
} catch (err) {
    console.log(err, ' a?')
}



/*
    let db_conn = await db_utils.get_db(); // db connection

    let allCollections = await db_conn.collection("collections").find({}).toArray(); // getting all the collections

    setTimeout( async () => { // setTimeout in javascript makes sure that it's content only happens after a desired time, in this case "0" , so this part
        // of the code runs on the next tick of the clock

        let firstCollection = allCollections.find(_collection_id => _collection_id.name === 'firstCollection') // looks for the collection parameter name, in the controller usage we set it as "firstCollection"

        if (firstCollection) {

            firstCollection.allBubz.forEach( (bub) => {
                bub.available = true
            })

            firstCollection.lastMinted = {}
            firstCollection.bubzInDispensary = []
            firstCollection.totalValueCollected = 0
            firstCollection.valueSentOut = 0
            firstCollection.ValueSentDeveloper = 0
            firstCollection.nftDroped = []
            firstCollection.totalMintingCost = 0
            firstCollection.totalSentDonation = 0
            firstCollection.availableBubz = firstCollection.allBubz

            let update = await db_conn.collection("collections").replaceOne({_id: new ObjectId(firstCollection._id)}, firstCollection, {
                w: "majority",
                upsert: false
            });

        }
    }, 0)
*/