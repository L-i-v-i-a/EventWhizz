const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide your name"],
        trim:true,
        minlength:3,
        maxLength:40,
        index:true
    },
    username:{
        type:String,
        required:[true,"please provide your username"],
        trim:true,
        minlength:3,
        maxLength:10,
        index: true,
        unique: true
    },
    email:{
        type: String,
        required:[true,'please provide your valid email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Please provide a valid email"]
    },
    password:{
        type:String,
        required:[true,"please provide your password"],
        minlength:8,
        select:false,
        maxLength:15
    },
    passwordConfirm:{
        type:String,
        required:[true,"please confirm your password"],
        validate:{
            validator:function(el){
            return el === this.password
        },
        message: "password do not match"
    },
    },
    booking:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bookings"
    }],
    favourites:[{
        title:String,
        description:String,
        images:[]
    }],
    addresses:[{
         type:mongoose.Schema.Types.ObjectId,
        ref:"Address"
    }],
    profileImage: {
        type: String, 
        default: "../assets/17189998702389.jpg", 
      },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
        default:null
    },
    otpExpires:{
        type:Date,
        default: null
    },
    resetPasswordOTP:{
        type:String,
        default:null
    },
    resetPasswordOTPExpires:{
        type:Date,
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
},
    {
        timestamps:true
    }
);

userSchema.pre("save", async function (next){
    if(!this.isModified('password'))
        return next()

    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined
    next()
})

userSchema.methods.correctPassword = async function (password,userPassword) {
    return await bcrypt.compare(password, userPassword)
}

const User = mongoose.model("User",userSchema);
module.exports = {User};