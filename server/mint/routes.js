const express = require('express');
const router = express.Router();
const { autoMintHandler, fuseHandler } = require('./controllers/autoMint')

// sending an get request to  104.154.208.48:3000/mint should return "Message":"mint working", you can try on PostMan
router.get ('/', (req,res) => {
    return res.status(200).json({"message":"mint working"});
})

// this is the autoMint service, this method is called everytime you send an http request to 104.154.208.48:3000/mint/autoMint
// every time its called, it looks trough the project wallet if there's any money in it, if there's a transaction with exactly 25Ada it creates an mint transaction
// sending ada to an desired addres and the NFT to the sender of the 25Ada
// if there's a different value than 25Ada it gets refunded
router.get("/autoMint", autoMintHandler);

// fuse system, works like autoMint, but checks if there's a token from the project policy id, if doesn't the value is refunded
// but if does, it's disposal the nft and mint one random with a bigger rarity based on the assetID
router.get("/fuse", fuseHandler)

module.exports = router;
