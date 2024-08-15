const mongoose = require('mongoose')
const bcrypt = require("mongoose-bcrypt")
const timestamp = require("mongoose-timestamp")
const stringQuery = require("mongoose-string-query")
const EMAIL_REGEX = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

userSchema = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: EMAIL_REGEX,
        index: true
    },
    password: {
        required: true,
        type: String,
        bcrypt: true,
    },
    profile_picture: {
        type: String,
        default:
            "https://t3.ftcdn.net/jpg/00/64/67/80/240_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"
    },
})

userSchema.index({ name: "text" })
userSchema.plugin(bcrypt, { rounds: 8 })
userSchema.plugin(timestamp)
userSchema.plugin(stringQuery)

module.exports = mongoose.model('user', userSchema)