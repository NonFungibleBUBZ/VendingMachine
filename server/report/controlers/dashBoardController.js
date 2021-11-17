const { get_availableBubz } = require( "../controller" );


const reportHandler = async function (req, res) {

    let returnAvailablebubz = await get_availableBubz
    res
        .status(200)
        .json({ message: "report test", data: JSON.stringify(returnAvailablebubz) });
}

module.exports = { reportHandler }