const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    image:{type:String,default:'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'},
    role:{type:String,default:''},
    address: {
     street: { type: String , default:''},
     pincode: { type: String,default:'' },
    city: { type: String ,default:''},
    country: { type: String ,default:''}
        }

},{timestamps:true})

userSchema.methods.matchPassword = async function(enteredpassword) {
     return await bcrypt.compare(enteredpassword,this.password)
}  

userSchema.pre('save',async function(next){
    if(!this.isModified) next()
     const salt =await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)   
})

const User = mongoose.model('User',userSchema)
module.exports = User