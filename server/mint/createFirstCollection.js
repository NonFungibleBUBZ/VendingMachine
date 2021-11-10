const db = require('./db')

let create = async function () {
   await db.set_unavailable(0,'firstCollection')
    await db.update_collection('firstCollection')
}

try {
    create().then( () => {
        console.log('done')
    })
} catch (err) {
    console.log(err)
}
