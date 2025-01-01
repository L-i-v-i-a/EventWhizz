const mongoose = require("mongoose");

const ServiceProviderSchema = mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    businessName: String,
    description:String,
    address:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Address"
    },
    bookings:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Bookings"
            }
    ],
    numRating:Number,
    contactInformation:{},
    openingHours: String,
    images:[String],
    registrationDate:{
        type:Date,
        default:Date.now,
    },
    open:Boolean,
    services:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Service"
        }
    ]
});

const ServiceProvider = mongoose.model("ServiceProvider",ServiceProviderSchema);
module.exports = {ServiceProvider};