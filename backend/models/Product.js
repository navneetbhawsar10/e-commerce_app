const mongoose  = require('mongoose')

const productSchema = new mongoose.Schema({
    title:{type:String,requried:true},
    price:{type:Number,requried:true},
    brand:{type:String,requried:true},
    image:{type:String,requried:true},
    info:{type:String,requried:true},
    category:{type:String,requried:true},
    qty:{type:Number,required:true}
},{timestamps:true})

const Product = mongoose.model('Product',productSchema)

module.exports = Product 