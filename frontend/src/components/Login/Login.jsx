import React from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { CartContext } from '../../context';

export default function Login() {
   
  const {getCartitems,setisLoggedin,getUser,user} = useContext(CartContext)
  const navigate = useNavigate();
  const[emailisvalid,setemailisValid] = useState(true)
  const [state,setState] = useState({
    user:{
      email:'',
      password:''
    }
  })


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
        
      localStorage.setItem('token',res.data.token)
      localStorage.setItem('user',JSON.stringify(res.data.user))

        toast.success(`login successfully`)
        setisLoggedin(!!localStorage.getItem('user'))
        getCartitems()
        navigate('/')

        setState({
          user:{
            email:'',
            password:''
          }
        })
})
      .catch((error)=>{
       console.log(error);
       toast.error(`login failed`)
      })
    }
  }

  return (
    
    <div>
      <div className="login-container">
        <header className="header">
          <span className="login-icon">

            <i className="fa fa-sign-in" />
          </span>
          Login Here
        </header>
        <div className="login-box">
          <div className="login1">
            <h2>Login</h2>
          </div>
          <div className="loginregister">
            <input value={state.user.email} onChange={update} name='email' type="email" placeholder="Email" className={emailisvalid?'input-field':'invalid-field'} />
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
            New To Brains Kart ?
            <p href="#" className="register-link">
             <Link to={'/Register'}> Register </Link>
            </p>
            
          </p>
          <div className="footer-logo">BRAINSKART</div>
        </div>
      </div>
    </div>
  );
}