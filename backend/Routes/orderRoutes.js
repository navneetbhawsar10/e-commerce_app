const express = require('express')
const Razorpay = require('razorpay')
const { route } = require('./cartRoutes')
const router = express.Router()
const crypto = require("crypto");
const Order = require('../models/orderHistory');

router.post('/order',async(req,res)=>{
   const razorpay = new Razorpay({
    key_id:'rzp_test_aFt9kKQCYZ36sW',
    key_secret:'lgXUwNkXkL5lX7RN5iZW3P0J'
   })

   const options = {
    amount:req.body.amount,
    currency:req.body.currency,
    receipt:"receipt@1",
    payment_capture:1
   }

   try{
    const response = await razorpay.orders.create(options)
    res.status(200).json({
        order_id:response.id,
        currency:response.currency,
        amount:response.amount
    })
   }
   catch(error){
    res.status(500).json({msg:error.message})
   }
})

router.get('/payments/:paymentId',async(req,res)=>{
    const {paymentId} = req.params

    const razorpay = new Razorpay({
    key_id:'rzp_test_aFt9kKQCYZ36sW',
    key_secret:'lgXUwNkXkL5lX7RN5iZW3P0J'
   })
 
   try{
    const response = await razorpay.payments.fetch(paymentId)

    if(!response) res.status(400).json('some error occured')
    
        res.status(200).json({
            status: response.status,
            method:response.method,
            amount:response.amount,
            currency:response.currency,
            order_id:response.order_id
        })
   }
   catch(error){
    res.status(500).json({msg:error.message})
   }
})


router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", 'lgXUwNkXkL5lX7RN5iZW3P0J')
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // ✅ Payment is verified
    res.json({ success: true, message: "Payment verified" });
  } else {
    // ❌ Invalid payment
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

router.post('/orders',async(req,res)=>{
    try{
      let order = {
        customer_name:req.body.customer_name,
        products:[...req.body.products],
        orderID:req.body.orderID,
        paymentID:req.body.paymentID,
        amount:req.body.amount,
        method:req.body.method
      }

      order = new Order(order)
      order = await order.save()

      res.status(200).json({order})

    }
    catch(error){
      res.status(500).json({msg:error.message})
    }
})

router.get('/orders',async(req,res)=>{
   try{
    let orders = await Order.find()
    res.status(200).json({orders})
   }
   catch(error){
    res.status(500).json({msg:error.message})
   }
})

module.exports = router