const db = require('./db')
const metadataArray = require('./metadata/metadata_first_collection')
const  mintController  = require('./controllers/mintController')
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
                    "72a347b015f5da23a00e5208f58bbff3c5a17f623386337308a5709f.SuperC3214": 1
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
