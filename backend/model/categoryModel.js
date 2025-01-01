const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
    name:String,
    serviceProvider:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"ServiceProvider"
    }
});

const Category = mongoose.model("Category",CategorySchema);
module.exports = {Category}