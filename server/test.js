const { cardanocliJs } = require("./utils/cardano");

const run = async function() {
    console.log(cardanocliJs.wallet('testWallet').balance().value)
}