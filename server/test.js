const { cardanocliJs } = require("./utils/cardano");

const run = async function() {
    console.log(cardanocliJs.wallet('fake-wallet-0').balance())
}