const { get_availableBubz } = require( "../controller" );


const reportHandler = async function (req, res) {

    let returnAvailablebubz = await get_availableBubz()
    setTimeout( ()=> {
        res
            .status(200)
            .json({ message: "report test", data: returnAvailablebubz});
    },0)
}

module.exports = { reportHandler }