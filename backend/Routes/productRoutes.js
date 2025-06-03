const express = require('express')
const Product = require('../models/Product')
const { findByIdAndDelete } = require('../models/UserModel')
const router = express.Router()

router.post('/products',async(req,res)=>{
    try{
   let product = {
    title:req.body.title,
    brand:req.body.brand,
    image:req.body.image,
    category:req.body.category,
    price:req.body.price,
    info:req.body.info,
    qty:1
   }

   product = new Product(product)
   product = await product.save()

   res.status(200).json({msg:'product created'})

    }
  catch(error){
    res.status(500).json({msg:error.message})
  }


})

router.get('/products',async(req,res)=>{
  try{
    let product =  await Product.find()
    res.status(200).json({product})
  }
  catch(error){
    res.status(500).json({msg:error.message})
  }
})

router.delete('/products/:id',async(req,res)=>{
   try{
    let id = req.params.id
    let product=await Product.findByIdAndDelete(id)
    res.status(200).json({product})
   }
   catch(error){
    res.status(500).json({msg:error.message})
   }
})

router.put('/product/:id',async(req,res)=>{
  try{
    let id = req.params.id
    let newProduct = {
      title:req.body.title,
      price:req.body.price,
      info:req.body.info,
      brand:req.body.brand,
      category:req.body.category,
      image:req.body.image,
    }
    await Product.findByIdAndUpdate(id,{
      $set: newProduct
    },{new:true})
    res.status(200).json({msg:'product has been updated'})
  }
  catch(error){
    res.status(500).json({msg:error.message})
  }
})

router.delete('/products',async(req,res)=>{
  try{
    await Product.deleteMany({})
    res.status(200).json({msg:'all products deleted'})
  }
  catch(error){
    res.status(500).json({msg:error.message})
  }
})
 
module.exports = router