import React from 'react'
import './OrderHistory.css'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useContext } from 'react'


function OrderHistory() {

const [ordersData,setOrders] = useState([])
const user = JSON.parse(localStorage.getItem('user'))
const [toDate,setToDate] = useState('')
const [fromDate,setFromDate] = useState('')
const isAdmin = user.role=="Admin"
const visibleData = isAdmin?ordersData:ordersData.filter(i=>i.customer_name==user.name)


useEffect(()=>{
  axios.get('http://127.0.0.1:7000/order_api/orders').then((res)=>{
    setOrders(res.data.orders)
    })

  .catch((error)=>{
    console.log(error);
    
  })
},[])



  return (
    <>
    <header className='head12'>Order History</header>
    <div className='orderCotainer'>
        <div className="date-filters">
         <label>
            From:
          <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)}/>
          </label>
        <label>
             To:
         <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)}/>
          </label>
</div>

    { ordersData.filter(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    if (user.role !== 'Admin' && order.customer_name !== user.name) return false;
    if (fromDate && orderDate < fromDate) return false;
    if (toDate && orderDate > toDate) return false;
    return true;
  }).map((order)=>(
        <div key={order._id} className='orderdetails'>
           <strong>Cutomer's Name: </strong>{order.customer_name}
           <table>
            <thead>
                <tr>
                    <th>product</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                </tr>
            </thead>
            <tbody>
           {
            order.products.map((product)=>(
              <tr key={product._id}>
                <td><img height={50} width={50} src={product.productId.image}/></td>
                <td>{product.productId.title}</td>
                <td>Rs.{product.productId.price}</td>
                <td>{product.qty}</td>
              </tr>
            ))
           }
           </tbody>
           </table>
           <div  className='downdiv'>

               <strong>Amount Paid:</strong>Rs. {order.amount/100}<br/>
               <strong>OrderId: </strong>{order.orderID}<br/>
               <strong>PaymentId:</strong>  {order.paymentID}<br/>
               <strong>Method:</strong>  {order.method}<br/>
               <strong>Date:</strong>  {new Date(order.createdAt).toLocaleDateString()}<br/>
               <strong>Time:</strong>  {new Date(order.createdAt).toLocaleTimeString([],{
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    })}<br/>
         </div>
         </div>
    ))
     }
    </div>
    </>
  )
}

export default OrderHistory