import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import HomePage from '../HomePage/HomePage'
import Navbar from '../Navbar/Navbar'
import { CartContext } from '../../context'
import Cart from '../Cart/Cart'

function WomensWear() {

  const [products,setProducts] = useState([])
  const {addToCart} = useContext(CartContext)

  useEffect(()=>{
     axios.get('http://127.0.0.1:7000/api/products')
    .then((res)=>{
      setProducts(res.data.product.filter((item)=>item.category=='Women'))
    }
    )
    .catch((error)=>console.log(error))
  },[])
   
    function update(id){
      const item = products.find((product)=>product.id==id)  
      if(item){
         addToCart(item)   
      }
      
    }

  return (
    <>
   <header className="header1">
          <span className="login-icon">
          </span>
          Women's Collection
        </header>
    <div className='container3'>
    {products.map((product)=>(
      <div key={product._id} className="card">
       <img className="card-img-top" src={product.image} alt="Card image cap"/>
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
            <p className="card-text">Rs.{product.price}</p>
            <button onClick={()=>update(product.id)} href="#" className="btn1 btn-primary">Add to Cart</button>
         </div>
        </div>
        
    ))}
    </div>
    </>
  )
}

export default WomensWear