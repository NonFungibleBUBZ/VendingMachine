// don't mind this script i used it multiple times to do multiple tests


// don't mind this script i used it multiple times to do multiple tests
const db = require('./db')
const metadataArray = require('./metadata/metadata_first_collection')
const { cardanocliJs } = require( "../utils/cardano" );
const { fuseHandler } = require('../mint/controllers/autoMint')

let create = async function () {
    let sender = cardanocliJs.wallet('fake-wallet-0')
    console.log(sender.balance())
    //72a347b015f5da23a00e5208f58bbff3c5a17f623386337308a5709f.SuperC4405

    const receiver = "addr_test1qpdujke2ysnfs7xxglc2r3p5je6h6cffdfr3j6ltw4keu3v7f8ej7v5yx6g5wq7gvqe57accm7vv278l3hlfa86vrnlsxde8c9"
    const txInfo = {
        txIn: cardanocliJs.queryUtxo(sender.paymentAddr),
        txOut: [
            {
                address: sender.paymentAddr,
                value: {
                    lovelace: sender.balance().value.lovelace - cardanocliJs.toLovelace(25)
                }
            },
            {
                address: receiver,
                value: {
                    lovelace: cardanocliJs.toLovelace(25),
                    "72a347b015f5da23a00e5208f58bbff3c5a17f623386337308a5709f.SuperC5465": 1
                }
            }
        ]
    }

    const raw = cardanocliJs.transactionBuildRaw(txInfo)

    const fee = cardanocliJs.transactionCalculateMinFee({
        ...txInfo,
        txBody: raw,
        witnessCount: 1
    })

    txInfo.txOut[0].value.lovelace -= fee

    const tx = cardanocliJs.transactionBuildRaw({ ...txInfo, fee })

    const txSigned = cardanocliJs.transactionSign({
        txBody: tx,
        signingKeys: [sender.payment.skey]
    })

    const txHash = cardanocliJs.transactionSubmit(txSigned)


    console.log('ta chamando ne')
    //await fuseHandler()
}

try {
    create().then( () => {

    })
} catch (err) {
    console.log(err)
}


/* const db = require('./db')
const metadataArray = require('./metadata/metadata_first_collection')
const { cardanocliJs } = require( "../utils/cardano" );

let sender = cardanocliJs.wallet('fake-wallet-0')
let create = async function () {
    console.log(sender.balance())
    //72a347b015f5da23a00e5208f58bbff3c5a17f623386337308a5709f.SuperC4405

    const receiver = "addr_test1qru8huxjk8wna7aq8edp0w6dqkk7060jeruece5u233l8z27rh9l5kr8ewvl2xfm342dqnwkc4rdruzremf2v9yugysswrm7p4"
    const txInfo = {
        txIn: cardanocliJs.queryUtxo(sender.paymentAddr),
        txOut: [
            {
                address: sender.paymentAddr,
                value: {
                    lovelace: sender.balance().value.lovelace - cardanocliJs.toLovelace(1.5)
                }
            },
            {
                address: receiver,
                value: {
                    lovelace: cardanocliJs.toLovelace(1.5),
                    "72a347b015f5da23a00e5208f58bbff3c5a17f623386337308a5709f.SuperC0156": 1
                }
            }
        ]
    }

    const raw = cardanocliJs.transactionBuildRaw(txInfo)

    const fee = cardanocliJs.transactionCalculateMinFee({
        ...txInfo,
        txBody: raw,
        witnessCount: 1
    })

    txInfo.txOut[0].value.lovelace -= fee

    const tx = cardanocliJs.transactionBuildRaw({ ...txInfo, fee })

    const txSigned = cardanocliJs.transactionSign({
        txBody: tx,
        signingKeys: [sender.payment.skey]
    })

    const txHash = cardanocliJs.transactionSubmit(txSigned)

}

try {
    create().then( () => {

    })
} catch (err) {
    console.log(err)
}
*/