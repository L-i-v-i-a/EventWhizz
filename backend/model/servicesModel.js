const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema({
     name:String,
     description:String,
     price:Number,
     serviceCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category"
     },
     images:[String],
     avaliable:Boolean,
     serviceProvider:  {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ServiceProvider"
        }
});

const Service = mongoose.model("Service",ServiceSchema);
module.exports={Service}