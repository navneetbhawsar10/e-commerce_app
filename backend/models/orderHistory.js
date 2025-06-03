const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customer_name:{type:String,required:true},
    products:[
          {
            productId: {
                _id: {type:String,required:true},
                title: {type:String,required:true},
                price: {type:Number,required:true},
                brand: {type:String,required:true},
                image: {type:String,required:true},
                info: {type:String,required:true},
                category: {type:String,required:true},
            },
               qty:{type:Number,required:true}
        }
    ],
    orderID:{type:String,required:true},
    paymentID:{type:String,required:true},
    amount:{type:Number,required:true},
    method:{type:String,required:true}

},{timestamps:true})

let Order = mongoose.model("Order",orderSchema)
module.exports = Order