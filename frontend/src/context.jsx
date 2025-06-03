import { createContext, useState } from 'react';
import MensWear from './components/MensWear/MensWear';
import { toast } from 'react-toastify'
import axios from 'axios';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const[grandTotal,setGrandTotal] = useState()
  const[user,setUser] = useState({})
  const [isLoggedin,setisLoggedin] = useState(!!localStorage.getItem('user'))

  function addToCart(item) {
  
  if(isLoggedin){
    let cart = {
      userId:JSON.parse(localStorage.getItem('user'))._id,
      productId:item._id,
      qty:item.qty
    }

    axios.post('http://127.0.0.1:7000/cart_api/add',cart).then((res)=>{
      toast.success('added to cart')
      
    })
      .catch((error)=>{
        console.log(error);
        toast.error('not added')
        
      })
    
  }
  else{
    toast.error('please login first')
  }
    
  getCartitems()
  
}


function getCartitems(){
    if(JSON.parse(localStorage.getItem('user'))){
      let id = JSON.parse(localStorage.getItem('user'))._id
       axios.get(`http://127.0.0.1:7000/cart_api/cart/${id}`).then((res)=>{
         setCartItems(res.data.items)
         
       })
       .catch((error)=>{
        console.log(error);
        
       })
}
}


  return (
    <CartContext.Provider value={{user,setUser,getCartitems, setCartItems,cartItems, addToCart ,isLoggedin,setisLoggedin,grandTotal,setGrandTotal}}>
      {children}
    </CartContext.Provider>
  );
}
