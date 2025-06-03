import React, { useContext, useState } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router'
import { CartContext } from '../../context'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

function Navbar() {
  const{getCartitems,cartItems,user} = useContext(CartContext)
  const {isLoggedin,setisLoggedin} = useContext(CartContext)
  const navigate = useNavigate()
 
  useEffect(()=>{
    if(localStorage.getItem('user')){
   getCartitems()
    }
  },[cartItems])

  function logout(){
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setisLoggedin(!!localStorage.getItem('user'))
    navigate('/')
    toast.success(`logged out`)
  }
 
  return (
    <>
      <div className='container'>
        <ul className='ul-1'>
           <li className='logo'>BRAINSKART</li>
           <li><Link to={'/AllProducts'} style={{ textDecoration: 'none',color: 'antiquewhite' }}>All Products</Link> </li>
           <li><Link to={'/MensWear'} style={{ textDecoration: 'none',color: 'antiquewhite' }}>Men's Wear</Link> </li>
           <li><Link to={'/KidsWear'} style={{ textDecoration: 'none',color: 'antiquewhite' }}>Kid's Wear</Link></li>
           <li><Link to={'/WomensWear'} style={{ textDecoration: 'none',color: 'antiquewhite' }}>Women's Wear</Link></li>
           <li> <Link to={'/Cart'}><i className="fa-solid fa-cart-shopping " style={{ color: 'antiquewhite' }}></i>
           </Link><span style={{background:'green'}}>{JSON.parse(localStorage.getItem('user'))&&cartItems.length}</span></li>
          {isLoggedin&& <li><Link to={"/orderHistory"} style={{textDecoration:'none',color:'antiquewhite'}}>Orders</Link></li> }
        </ul>
        {
          isLoggedin?
          JSON.parse(localStorage.getItem('user')).role==="Admin"?
          <ul className='ul-2'>
           <Link  to={`UserDetails/${JSON.parse(localStorage.getItem('user'))._id}`} style={{textDecoration:'none'}}> <li className='profile'><img width={25} height={25} src={JSON.parse(localStorage.getItem('user')).image} alt="" />
            <span>{JSON.parse(localStorage.getItem('user')).name}(Admin)</span>
            </li> </Link>
            <li onClick={logout}>Logout</li>
          </ul>
          
          :

          <ul className='ul-2'>
           <Link to={`UserDetails/${JSON.parse(localStorage.getItem('user'))._id}`}> <li className='profile'><img width={25} height={25} src={JSON.parse(localStorage.getItem('user')).image} alt="" />
            <span>{JSON.parse(localStorage.getItem('user')).name}</span>
            </li>
            </Link>
            <li onClick={logout}>Logout</li>
          </ul>
          :
           <ul className='ul-2'>
            <li><i className="fa-solid fa-right-to-bracket" style={{color: '#ffffff'}}></i><Link  to={'/Login'}  style={{ textDecoration: 'none' }}><span style={{color:'antiquewhite'}}>Login</span></Link></li>
            <li><i className="fa-solid fa-user" style={{color: '#ffffff'}}></i><Link to={'/Register'}  style={{ textDecoration: 'none' }}><span style={{color:'antiquewhite'}}>Register</span></Link></li>
        </ul>
        }
       
      </div>
    </>
  )
}

export default Navbar