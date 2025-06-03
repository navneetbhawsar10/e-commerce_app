import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../context'
import './Cart.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

function Cart() {
  const navigate = useNavigate()
  const {getCartitems,setCartItems,cartItems,grandTotal,setGrandTotal} = useContext(CartContext)

  useEffect(()=>{
   getCartitems()
  },[cartItems])

  const totalPrice = cartItems.reduce((acc, item) => {
  return acc + item.productId.price * item.qty;
      }, 0); 
     

  function updateQty(productId,action){
    let userId = JSON.parse(localStorage.getItem('user'))._id 
    axios.patch('http://127.0.0.1:7000/cart_api/updateQty',{userId,productId,action}).then(()=>{
      setCartItems(resizeBy.data.items)
    })
    .catch((error)=>{
       console.log(error);
       
    })
  }

  function remove(id){
    let userId = JSON.parse(localStorage.getItem('user'))._id
    let productId = id
     axios.delete(`http://127.0.01:7000/cart_api/remove/${userId}/${productId}`).then(()=>{
      toast.success('1 item deleted')
     })
     .catch((error)=>{
      console.log(error);
      
     })
  }

function checkoutCom(){
   setGrandTotal(totalPrice+(totalPrice*0.1))
  navigate('/Checkout')
}

  return(
    <>
    {cartItems.length!=0 && localStorage.getItem('user') ? (
     <>
      <header className="header1">
          <span className="login-icon">
          </span>
          My Cart
     </header>
    <div className='cartContainer'>
      <div className='divTable'>
        <header className='carthead'>Your Cart Item</header>
        <table className='itemTable'>
        <thead>
          <tr className='headRow'>
            <th>Image</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
           cartItems.map((item)=>(
             <tr className='productRow' key={item.productId._id}>
              <td className=''><img src={item.productId.image} width={40} height={50}/></td>
              <td>{item.productId.title}</td>
              <td>
                <i onClick={()=>updateQty(item.productId._id,'dec')} className="fa fa-minus bg-danger" aria-hidden="true"></i>
                  {item.qty}
                <i onClick={()=>updateQty(item.productId._id,'inc')} className="fa fa-plus bg-success" aria-hidden="true"></i>
              </td>
              <td>Rs.{item.productId.price}</td>
              <td><button onClick={()=>remove(item.productId._id)} className='actionButton'>DELETE</button></td>
              
             </tr>  
           ))
          }
        </tbody>
        </table>
      </div>
      <div className="total">
        <header className='totalhead'>
          Your Total
        </header>
        <table className='totalTable'>
          <tbody>
            <tr>
              <td><span style={{fontWeight:'bold'}}>Total:</span>{totalPrice}</td>
            </tr>
            <tr>
              <td><span style={{fontWeight:'bold'}}>Tax:</span>{totalPrice*0.1}</td>
            </tr>
            <tr>
              <td><span style={{fontWeight:'bold'}}>Grand Total:</span>{totalPrice+(totalPrice*0.1)}</td>
            </tr>
          </tbody>
        </table>
        <div className='btndiv'>
          <button onClick={checkoutCom} className='checkbtn'>checkout</button>
          <button onClick={()=>navigate('/AllProducts')} className='shopbtn'>Shop More</button>
        </div>
      </div>
    </div>

  </>
    ):(
   <>
     <h1 className='emptynote'>CART IS EMPTY!...</h1>
   </>
    )}
    </>
  )
}

export default Cart