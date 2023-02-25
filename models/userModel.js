const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    Profile_picture: String,
    Name: String,
    Bio: String,
    Phone: Number,
    Email: String,
    Password: String
})

const UserModel = mongoose.model("user", userSchema)

module.exports = { UserModel }