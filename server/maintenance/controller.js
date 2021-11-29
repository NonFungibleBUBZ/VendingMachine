const { cardano } = require('../utils/cardano.js')

// made in 11/29/2021 by LRovaris -> Github or contact me in Discord LRovaris#4065
// this script should set things easier

const tokenPrice = cardano.toLovelace(25); // in order to modify tokenPrice just edit the value in ADA
const fusionPrice = cardano.toLovelace(25) // same for fusion
const amountToDev = cardano.toLovelace(1) // in order to be 0 there's additional needing to remove the part from the txOut build (for both mint and fuse txOut) in ../mint/autoMint.js
const percentToCharity = 0.4 // 1 = 100% so 0.4 == 40% //please avoid % too low, if its less than 1 ADA it might return error building the transaction
const isCharity = false // that sets the charity drop :3
const dropWallet = 'addr1q97e2wqsyr74nyevdwcq9e2wfwj05h7kr5py5rdmu5afzewp5ap2lz9pvc56knkmfdun4mlymyfe3hvty7vwzmuvyces57l40z'
const charityWallet = 'addr1qyclw869kkev2sxyr3z200cx4gx99dl6m5jfurnu6948zwmh6yy93vcm3s9p26puz63zs8u9ugy8q7c5ggjp3ly8pd4qkq4tz4'


const MaintenanceObj = function () {
    return {
        tokenPrice,
        fusionPrice,
        amountToDev,
        percentToCharity,
        isCharity,
        dropWallet,
        charityWallet
    }
}
module.exports = { MaintenanceObj };