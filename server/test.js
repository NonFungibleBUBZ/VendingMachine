const { cardanocliJs } = require("./utils/cardano");

const run = async function() {
    const sender = cardanocliJs.wallet('fake-wallet-0');

    const txInfo = {
        txIn: [0],
        txOut: [
            {
                address: cardanocliJs.wallet('testWallet'),
                value: {
                    lovelace: cardanocliJs.toLovelace(25),
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
    console.log(txHash)
}

run()

module.exports = {run}