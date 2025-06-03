import React from 'react'
import "./Checkout.css"
import { useContext } from 'react'
import { CartContext } from '../../context'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

function Checkout() {
    const[edit,setEdit] = useState(false)
    const navigate = useNavigate()
    const {user,cartItems,grandTotal,setUser} = useContext(CartContext)
    const[state,setState] = useState({
        address:{
            street:'',
            pincode:'',
            city:'',
            country:''
        }
    })

useEffect(()=>{
     let id = JSON.parse(localStorage.getItem('user'))._id
      axios.get(`http://127.0.0.1:7000/user_api/user/${id}`).then((res)=>{
        setUser(res.data)  
        })
      .catch((error)=>{
       console.log(error);
       
      })
},[user])

const getPaymentDetails =  async(res)=> {

  try {
    const fetchRes = await fetch(`http://127.0.0.1:7000/order_api/payments/${res.razorpay_payment_id}`);
    const data = await fetchRes.json();
    
    axios.post('http://127.0.0.1:7000/order_api/orders',{
     customer_name:user.name,
     products:[...cartItems],
     orderID:data.order_id,
     paymentID:res.razorpay_payment_id,
     amount:data.amount,
     method:data.method  
    }).then(()=>{
      toast.success(`Your order has been noted successfully`);
      axios.delete('http://127.0.0.1:7000/cart_api/cart').then(()=>{
         navigate('/orderHistory')
      })
       .catch((error)=>{
        console.log(error);
        
       })
    }).catch((error)=>{
      console.log();
      
    })

  } catch (err) {
    console.error("Error fetching payment details", err);
  }
}


 const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
   };

    const handlePayment = async (totalAmount) => {
    const res = await loadRazorpayScript();
    
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // 1️⃣ Call your backend to create the order
    const response = await fetch("http://127.0.0.1:7000/order_api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(totalAmount * 100), 
        currency: "INR",
      }),
    });

    const data = await response.json()

     if (!data) {
  console.error("Error from backend:", data);
  alert("Something went wrong while creating the Razorpay order.");
  return;
}


    

    // 2️⃣ Set up Razorpay options
    const options = {
      key: "rzp_test_aFt9kKQCYZ36sW", // Replace with your public test key
      amount: data.amount,
      currency:data.currency,
      name: "Acme Corp",
      description: "Test Transaction",
      order_id: data.order_id,
      handler: async function (response) {
        alert("Payment successful!");

        const verifyRes = await fetch("http://127.0.0.1:7000/order_api/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }),
  });

  const result = await verifyRes.json();
  if (!result.success) {
    alert("❌ Payment Verification Failed");
  }

        getPaymentDetails(response)
      },
      prefill: {
        name: "Navneet Bhawsar",
        email: "navneet@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Shivampuri Colony, Indore",
      },
      theme: {
        color: "#3399cc",
      },
    };

    // 3️⃣ Open Razorpay checkout
    const rzp = new window.Razorpay(options);
    rzp.open();

  };


    function update(e){
      setState({
        address:{
        ...state.address,
        [e.target.name]:e.target.value
      }
    })
    }

    function submit(e){
        e.preventDefault()
       if(state.address.street==""||state.address.pincode==""||state.address.city==""||state.address.country==""){
        toast.error('all field are required')
       }
       else{
        let id =JSON.parse(localStorage.getItem('user'))._id
        axios.patch(`http://127.0.0.1:7000/user_api/user/${id}`,{
            address:state.address
        }).then(()=>{
            toast.success('address updated')
            setEdit(false)
        })
        .catch((error)=>{
            console.log(error);
            
        })
       }
    }

    if(!user.address) return <p>Loading..</p>

  return (
    <>
    
     <header className="header1">
          Check out details
        </header>
      <div className="checkoutcontainer">
     {
        !edit?
         <div className="checkout-from">
          <header style={{color:'white'}} className='totalhead'>
          Billing address
        </header>
        <strong>Customer's Name:</strong>
           <p>{user.name}</p><br/>
            <strong htmlFor="">Address:</strong>
            <div>
                <p>{user.address.street}</p>
                <p>{user.address.pincode}</p>
                <p>{user.address.city}</p>
                <p>{user.address.country}</p>
            </div>

            <button onClick={()=>setEdit(true)} className="Add_btn">Edit Address</button>
          </div>
          :
          <div className='checkout-from'>
            <form className='submitform'>
            <input onChange={update} name='street' className='input-fields' placeholder='enter your street no. or name' type="text" />
            <input onChange={update} name='pincode' className='input-fields' placeholder='enter your pincode' type="text" />
            <input onChange={update} name='city' className='input-fields' placeholder='enter your city' type="text" />
            <input onChange={update} name='country' className='input-fields' placeholder='country' type="text" />
            <button onClick={submit} className='Add_btn'>Ok</button>
            </form>
         </div >
     }
          <div className='total_table'>
             <header className='totalhead'>
          Final Products
        </header>
        <table className='itemTable'>
        <thead>
          <tr className='headRow'>
            <th>Image</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {
           cartItems.map((item)=>(
             <tr key={item.productId._id}>
              <td><img src={item.productId.image} width={40} height={50}/></td>
              <td>{item.productId.title}</td>
              <td>{item.qty}</td>
              <td>Rs.{item.productId.price}</td>
              
             </tr>  
           ))
          }
        </tbody>
        </table>
        <strong>Total Amount:</strong>{grandTotal}<br/>
        <button className='paymentbtn' onClick={()=>handlePayment(grandTotal)}>Make Payment</button>
          </div>
        </div>
    
    </>
  )
}

export default Checkout