const mongoose = require('mongoose')
const passport = require('passport')
const Schema = mongoose.Schema

//this will add password and username itself with hashing and salt
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', userSchema);