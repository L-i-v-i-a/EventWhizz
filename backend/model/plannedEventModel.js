const mongoose = require("mongoose");

const PlannedEventsSchema = new mongoose.Schema({
    images:[String],
    date:Date,
    eventType:String,
    description:String,
    serviceProvider:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"ServiceProvider"
    },
    location:String,
})
const PlannedEvents = mongoose.model("PlannedEvents",PlannedEventsSchema);
module.exports = {PlannedEvents};