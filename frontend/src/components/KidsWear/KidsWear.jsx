import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import HomePage from '../HomePage/HomePage'
import Navbar from '../Navbar/Navbar'
import { CartContext } from '../../context'
import Cart from '../Cart/Cart'

function KidsWear() {

  const [products,setProducts] = useState([])
  const[allproducts,setAllProducts] = useState([])
  const {addToCart} = useContext(CartContext)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(allproducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = allproducts.slice(startIndex, startIndex + itemsPerPage);
  

  useEffect(()=>{
     axios.get('http://127.0.0.1:7000/api/products')
    .then((res)=>{
      setProducts(res.data.product.filter((item)=>item.category=='Kids'))
      setAllProducts(res.data.product.filter((item)=>item.category=='Kids'))
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

function Search(text){
        if(text=='') setProducts(allproducts) 
        else{
       const sorted = allproducts.filter((product)=>product.title.toLowerCase().includes(text.toLowerCase()))
       setProducts(sorted)
        }
    }

  return (
    <>
   <header className="header1">
          <span className="login-icon">
          </span>
          Kid's Collection
        </header>
        <input onChange={(e)=>Search(e.target.value)} className="header12" placeholder='Search Products....'/>
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
    <div className='footer'>
        <button className='previous_btn' onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button className='next_btn' onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </>
  )
}

export default KidsWear