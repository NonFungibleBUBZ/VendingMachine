const { get_availableBubz } = require( "../controller" );
const { get_collection } = require( "../../mint/db" );


const reportHandler = async function (req, res) {

    let collections = await get_collection()
    setTimeout( ()=> {
        res
            .status(200)
            .json({ message: "Success", data: collections});
    },0)
}

module.exports = { reportHandler }