const express = require('express')
const User = require('../models/UserModel')
const generateToken = require('../config/generateToken')
const router = express.Router()

 
router.post('/users', async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      image: req.body.image||'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
      role:req.body.role
    });

    user = await user.save(); 

    const token = generateToken(user._id); 

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
})

router.post('/login',async(req,res)=>{
    try{
     const {email,password} = req.body

   let user = await User.findOne({email})

    if(user&&(await user.matchPassword(password))){

      const token  = generateToken(user.id)

        res.status(200).json({user,token})
    }
    }
    catch(error){
        res.status(500).json({msg:error.message})
    }
   
})

router.get('/user/:id',async(req,res)=>{
  try{
   let id = req.params.id
  let user = await User.findById(id)
  res.status(200).json(user)
  }
  catch(error){
    res.status(500).json({msg:error.message});
    
  }
})

router.put('/user/:id',async(req,res)=>{
  try{
    let id = req.params.id
    let newUser={
      name:req.body.name,
      image:req.body.image,
      email:req.body.email,
      adress:{
        street:req.body.street,
        pincode:req.body.pincode,
        city:req.body.city,
        country:req.body.country
      }
    }
    let user = await User.findByIdAndUpdate(id,{
      $set:newUser
    },{new:true})
    res.status(200).json({msg:"updated"})
  }
  catch(error){
    res.status(500).json({msg:error.message})
  }
})

router.patch('/user/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // returns the updated document
    );
    res.status(200).json({updatedUser});
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});



module.exports  = router