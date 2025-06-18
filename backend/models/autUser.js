const mongoose = require('mongoose')

const authUserSchema = new mongoose.Schema({
    email:{type:String},
    otp:{type:String},
    otpExpiry:{type:Date},
    isVarified:{type:Boolean,default:false}  
},{timestamps:true})

const AuthUser = mongoose.model('AuthUser',authUserSchema)
module.exports = AuthUser