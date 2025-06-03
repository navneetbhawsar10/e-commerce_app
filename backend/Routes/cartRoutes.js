const express = require('express')
const router = express.Router()
const Cart = require('../models/CartModel')
const Product = require('../models/Product')

router.get('/cart/:userId',async(req,res)=>{
    try{
        let userId = req.params.userId
        let cart = await Cart.findOne({userId}).populate('items.productId')
        res.status(200).json(cart || {items:[]})
    }
    catch(error){
        res.status(500).json({msg:error.message})
    }
})

router.post('/add', async (req, res) => {
  const { userId, productId, qty } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].qty += qty;
      } else {
        cart.items.push({ productId, qty });
      }
      await cart.save();
    } else {
      cart = new Cart({
        userId,
        items: [{ productId, qty }]
      });
      await cart.save();
    }

    res.status(200).json({ message: 'Cart updated', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/remove/:userId/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();

    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/updateQty', async (req, res) => {
  const { userId, productId, action } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.toString() === productId);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (action === 'inc') {
      item.qty += 1;
    } else if (action === 'dec') {
      item.qty = Math.max(1, item.qty - 1); // Don't go below 1
    }

    await cart.save();

    await cart.populate('items.productId');

    res.json({ message: 'Quantity updated', items: cart.items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/cart',async(req,res)=>{
  try{
   await Cart.deleteMany({})
  res.status(200).json({msg:'carts has been deleted'})
  }
 catch(error){
  res.status(500).json({msg:error.message})
 }
})
module.exports = router