import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { CartContext } from '../../context'
import './AllProducts.css'
import { toast } from 'react-toastify'

function AllProducts() {

  const [products,setProducts] = useState([])
  const [allproducts,setAllProducts] = useState([])
  const {addToCart} = useContext(CartContext)



  useEffect(()=>{
     axios.get('http://127.0.0.1:7000/api/products')
    .then((res)=>{
      setProducts(res.data.product)
      setAllProducts(res.data.product)
    }
    )
    .catch((error)=>console.log(error))
  },[])
   
    function update(id){

      const item = products.find((product)=>product._id==id)  
      if(item){
         addToCart(item) 
           
      }
      
    }

    function Search(text){
        if(text=='') setProducts(allproducts) 
        else{
       const sorted = allproducts.filter((product)=>product.title.toLowerCase().includes(text.toLowerCase()))
       setProducts(sorted)
        }
    }

  return (
    <>
   <input onChange={(e)=>Search(e.target.value)} className="header12" placeholder='Search Products....'/>
    <div className='container3'>
    {products.map((product)=>(
      <div key={product._id} className="card">
       <img className="card-img-top" src={product.image} alt="Card image cap"/>
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
            <p className="card-text">Rs.{product.price}</p>
            <button onClick={()=>update(product._id)} href="#" className="btn1 btn-primary">Add to Cart</button>
         </div>
        </div>
        
    ))}
    </div>
    </>
  )
}

export default AllProducts