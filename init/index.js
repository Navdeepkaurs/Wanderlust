const mongoose = require('mongoose')
const initdata = require('./data')

const Listing = require('../models/listing');

//Database Connection
main()
    .then(() => {
        console.log("connection made to Database..")
    })
    .catch((err) => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});// delte all which are before
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: '673ec1866f11f9cf4426b274'
    }))

    await Listing.insertMany(initdata.data);

    console.log("data initialized")
}
initDB();