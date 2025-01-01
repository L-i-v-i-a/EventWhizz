const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema({
    name:String,
    streetName:String,
    city:String,
    state:String,
    country:String
})

const Address = mongoose.model("Address",AddressSchema);
module.exports = {Address}