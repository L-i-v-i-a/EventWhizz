const mongoose = require("mongoose")

const BookingSchema = new mongoose.Schema({
    client:{
         type: mongoose.Schema.Types.ObjectId,
         ref:"User"
    },
     serviceProvider:{
          type: mongoose.Schema.Types.ObjectId,
          ref:"ServiceProvider"
     },
     totalAmount:Number,
     bookingStatus: {
          type: String,
          enum: ["pending", "confirmed", "completed", "cancelled"],
          default: "pending",
      },
     createdAt:{
        type:Date,
        default:Date.now
     },
    EventInfo:{
         type: mongoose.Schema.Types.ObjectId,
         ref:"EventInfo"
    },
    service:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"ServiceItem"
    }],
    totalItem:Number,
    totalPrice:Number,
})

const Booking = mongoose.model("Bookings",BookingSchema);
module.exports = {Booking}