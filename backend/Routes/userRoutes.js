const express = require('express')
const User = require('../models/UserModel')
const generateToken = require('../config/generateToken')
const router = express.Router()
const sendOTP = require('../config/sendOtp')
const AuthUser = require('../models/autUser')
const bcrypt = require('bcryptjs')
 
router.post('/users', async (req, res) => {
  try {

    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    let otpExpiry = new Date(Date.now() + 5 * 60000);

    let user = {
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      image:req.body.image,
      role:req.body.email==='n4181330@gmail.com'?'Admin':'',
      otp:otp,
      otpExpiry:otpExpiry
    }

    userExist = await User.findOne({ email: req.body.email })

    if(userExist) res.status(200).json({msg:'user exists'})
    else{
     await sendOTP(req.body.email,otp)
     user = new AuthUser(user)
     user = await user.save()
     res.status(200).json({msg:'an otp has been send to your email'})
       } 
     
    
       
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
})

router.post('/verify', async (req, res) => {
  const {name,image,password, email, otp } = req.body;

  try {
    const user = await AuthUser.findOne({ email });

    if (!user) return res.status(400).json({ msg: 'User not found' });

    if (user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ msg: 'OTP has expired' });
    }

    await AuthUser.deleteMany({});

  
    let newUser = new User({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      image:req.body.image,
      role:req.body.email=='n4181330@gmail.com'?'Admin':''
    })
    newUser = await newUser.save()

    res.status(200).json({ msg: 'Verification successful' });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ msg: error.message });
  }
});


router.post('/login',async(req,res)=>{
    try{
     const {email,password} = req.body

   let user = await User.findOne({email})

    
    if(user&&(await user.matchPassword(password))){

      const token  = generateToken(user.id)

        res.status(200).json({user,token})
    }
    else if(!user) res.status(200).json({msg:'user is not registered'})
    else if(!await (user.matchPassword(password))) res.status(200).json({msg:'password did not matched'})
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
      password:req.body.password,
      email:req.body.email,
      adress:{
        street:req.body.street,
        pincode:req.body.pincode,
        city:req.body.city,
        country:req.body.country
      }
    }

    if(req.body.password){
      let salt = await bcrypt.genSalt(10)
      let hashedpass = await bcrypt.hash(req.body.password,salt)
      newUser.password = hashedpass
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

router.post('/forget',async(req,res)=>{
  try{
    let {email} = req.body
   let otp = Math.floor(100000 + Math.random() * 900000).toString();
    let otpExpiry = new Date(Date.now() + 5 * 60000);

    let user = await User.findOne({email})
    if(user){
      await sendOTP(req.body.email,otp)
      let temp_user = {
      email:email,
      otp:otp,
      otpExpiry:otpExpiry
    }
     
    if(await AuthUser.find()) await AuthUser.deleteMany({})
     let authUser = new AuthUser(temp_user)
     authUser = await authUser.save()
     res.status(200).json({msg:'an otp has been send to your email'})
    }

  }
  catch(error){
    res.status(500).json({msg:error.message})
  }
})

router.post('/verify_frgt_pass',async(req,res)=>{
  let {otp,email} = req.body
  try{
    let user1 = await User.findOne({email})
    let user = await AuthUser.findOne({email})
    if(!user) res.json({msg:'user not found'})
    if(user.otpExpiry<new Date()) res.json({msg:'otp has been expired'})
    if(user.otp!==otp) res.json({msg:'invalid otp'})
    
   await AuthUser.deleteMany({})   
   res.json({msg:'otp has been varified',user:user1._id})
  }
  catch(error){
    res.json({msg:error.message})
  }
})
module.exports  = router