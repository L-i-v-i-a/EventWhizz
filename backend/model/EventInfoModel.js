const mongoose = require("mongoose")

const EventInfoSchema = new mongoose.Schema({
    eventType:String,
    time:String,
    date:Date,
    description:String,
    city:String,
    state:String,
    country:String
})

const EventInfo = mongoose.model("EventInfo",EventInfoSchema);
module.exports = {EventInfo}