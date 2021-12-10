// don't mind this script i used it multiple times to do multiple tests
const db = require('./db');
const metadataArray = require('../mint/metadata/metadata_woa')
const { cardanocliJs } = require( "../utils/cardano" );


let create = async  function () {

    let db_conn = await db_utils.get_db(); // db connection

    let allCollections = await db_conn.collection("collections").find({}).toArray(); // getting all the collections

    setTimeout( async () => { // setTimeout in javascript makes sure that it's content only happens after a desired time, in this case "0" , so this part
        // of the code runs on the next tick of the clock

        let firstCollection = allCollections.find(_collection_id => _collection_id.name == undefined) // looks for the collection parameter name, in the controller usage we set it as "firstCollection"

        if (firstCollection) {

            firstCollection.name = 'woa'

            let update = await db_conn.collection("collections").replaceOne({_id: new ObjectId(firstCollection._id)}, firstCollection, {
                w: "majority",
                upsert: false
            });

        }
    }, 0)

}

try {
    create().then( () => {

    })
} catch (err) {
    console.log(err, ' a?')
}



/*

    let _allBubz = []

    metadataArray.forEach( (bub,i) => {
        _allBubz.push({name:bub.name, index:i, available:true})
    })

    setTimeout( ()=>{
        db.register_collection(
            {
                allBubz : _allBubz,
                lastMinted: {},
                totalValueCollected: 0,
                valueSentOut:0,
                ValueSentDeveloper:0,
                nftDroped:[],
                totalMintingCost:0,
                totalSentDonation:0,
                availableBubz: _allBubz
            }
        )
    },0)


addr_test1qrt2upfvr0rc3j0y2earhfzzx2sp5qcxr0lr63y2kjdzz7dtvnxf35e6yyg0fr2hvc035r6hgq9vdf09q37hqj7zqads2z0nr4


        const receiver =
            cardanocliJs.wallet('firstCollection');
    const  sender =
        cardanocliJs.wallet('fake-wallet-0');

        const txInfo = {
            txIn: sender.balance().utxo,
            txOut: [
                {
                    address: sender.paymentAddr,
                    value: {
                        lovelace:
                            sender.balance().value.lovelace -
                            cardanocliJs.toLovelace(35),
                    },
                },
                {
                    address: receiver.paymentAddr,
                    value: {
                        lovelace: cardanocliJs.toLovelace(35),
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

        txInfo.txOut[1].value.lovelace -= fee;


        const tx = cardanocliJs.transactionBuildRaw({ ...txInfo, fee });

        const txSigned = cardanocliJs.transactionSign({
            txBody: tx,
            signingKeys: [sender.payment.skey],
        });

        console.log('aaaaaaaaaaaa')

        const txHash = cardanocliJs.transactionSubmit(txSigned);

        console.log(txHash);

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