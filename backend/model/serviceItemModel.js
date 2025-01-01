const mongoose = require("mongoose")

const ServiceItemSchema = new mongoose.Schema({
   service:[{
     type: mongoose.Schema.Types.ObjectId,
     ref:"Service"
   }],
   totalAmount:Number,
   totalPrice:Number,
})

const ServiceItem = mongoose.model("ServiceItem",ServiceItemSchema);
module.exports = {ServiceItem}