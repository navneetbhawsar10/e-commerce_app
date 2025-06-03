
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
  items:[
    {
        productId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'Product'},
        qty:{type:Number,default:1}
    }
  ]
},{timestamps:true})
 
let Cart =  mongoose.model("Cart",cartSchema)
module.exports = Cart