import React, { useEffect } from 'react'
import './login.css'
import { Link, Navigate, useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { CartContext } from '../../context';

export default function Login() {
   
  const {getCartitems,setisLoggedin,getUser,user} = useContext(CartContext)
  const navigate = useNavigate();
  const[emailisvalid,setemailisValid] = useState(true)
  const[otpsent,setotpsent] = useState(false)
  const[loading,setLoading] = useState(false)
  const[showBox,setShowbox] = useState(false)
  let [count,setCount] = useState(30)
  const [state,setState] = useState({
    user:{
      email:'',
      password:''
    }
  })

  useEffect(() => {
  if (count > 0) {
    const timer = setTimeout(() => {
      setCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer); // cleanup
  }
}, [count]);

  function update(e){

    if(e.target.name=='email'){
      let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      regex.test(e.target.value) || e.target.value=='' ?
      setemailisValid(true)
      :
      setemailisValid(false)
    }

     setState({
      user:{
        ...state.user,
        [e.target.name] : e.target.value
      }
     })
  }

  function Submit(e){
    if(!state.user.email||!state.user.password){
      toast.error(`please fill the required field`)
    }
    else{
      e.preventDefault()
      axios.post('http://127.0.0.1:7000/user_api/login',state.user).then((res)=>{

        if(res.data.user){
           localStorage.setItem('token',res.data.token)
      localStorage.setItem('user',JSON.stringify(res.data.user))
        
        toast.success(`login successfully`)
        setState({
          user:{
            email:'',
            password:''
          }
        })
        setisLoggedin(!!localStorage.getItem('user'))
        getCartitems()
        navigate('/')

        }
        else if(res.data.msg){
          toast.error(res.data.msg)
        }
        
})
      .catch((error)=>{
       console.log(error);
       toast.error(`login failed`)
      })
    }
  }

  function sendOtp(){
     setLoading(true)
    if(state.user.email=='') toast.warn('enter email')
    let dataURL = 'http://127.0.0.1:7000/user_api/forget';
        
        axios.post(dataURL , {email:state.user.email}).then(async(res) => {
             toast.success(`an otp has been sent to your email`)
             setotpsent(true)
             setCount(30)
        }).catch((error) => {
          toast.error('cannot send otp')
            console.error(error);
        });

  }

function verify(){
          if(!state.user.otp) toast.error('enter the otp')
          
         axios.post('http://127.0.0.1:7000/user_api/verify_frgt_pass',state.user).then((res)=>{
            if(res.data.msg==='otp has been varified'){
              toast.success(res.data.msg)
              navigate(`/resetPassword/${res.data.user}`)
             }
             else  toast.info(res.data.msg)
         })
         .catch((error)=>{
          console.log(error)
         })
        }

  return (
    
    <div>
      <header className="header">
          <span className="login-icon">

            <i className="fa fa-sign-in" />
          </span>
          Login Here
        </header>
      <div className="login-container">
        <div className="login-box">
          <div className="login1">
            <h2>Login</h2>
          </div>
          <div className="loginregister">
            <input onChange={update} value={state.user.email} name='email' type="email" placeholder="Email" className={emailisvalid?'input-field':'invalid-field'} />
            <input
            value={state.user.password}
            onChange={update}
             name='password'
              type="password"
              placeholder="Password"
              className="input-field"
            />
            <button onClick={Submit} className="login-button">LOGIN</button>
          </div>

          <p className="register-text">
            New To Brains Kart ? </p>
            <p href="#" className="register-link">
             <Link to={'/Register'}> Register or </Link>
            </p>
            <p style={{cursor:'pointer'}} onClick={()=>setShowbox(true)} href="#" className="register-link">
              Forget Password? 
            </p>
          <div className="footer-logo">BRAINSKART</div>
        </div>
        { showBox&&
         <div className='forgetbox'>
        <header className='header'>Recover Here</header>
          <input onChange={update} value={state.user.email} name='email' type="email" placeholder="Enter email" /><br/>
          {
          otpsent&&<>
          <input onChange={update} name='otp' type='text' placeholder='Enter Otp'/>
          <button onClick={verify}>verify</button>
          {count!=0?<Link>Resend otp in {count} sec</Link>:<Link onClick={sendOtp}>Resend Otp</Link>}
          </>
          }
          {!otpsent&&<><button onClick={sendOtp}  className=''>{loading?<>loading..</>:<>sent otp</>}</button><br/></>}
      </div> 
     }
      </div>
    </div>
  );
}