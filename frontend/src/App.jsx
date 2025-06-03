import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import HomePage from './components/HomePage/HomePage'
import Registration from './components/Registration/Registration'
import Login from './components/Login/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MensWear from './components/MensWear/MensWear'
import Cart from './components/Cart/Cart'
import { CartProvider } from './context'
import WomensWear from './components/WomensWear/WomensWear'
import KidsWear from './components/KidsWear/KidsWear'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllProducts from './components/AllProducts/AllProducts'
import UserDetails from './components/UserDetails/UserDetails'
import AdminPanel from './components/AdminPanel/AdminPanel'
import UploadProduct from './components/UploadProduct/UploadProduct'
import Checkout from './components/Checkout/Checkout'
import OrderHistory from './components/orderHistory/orderHistory'


function App() {
  

  return (
     <>
    <Router>
       <Navbar/>
       <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/Register' element={<Registration/>}/>
          <Route path='/AllProducts' element={<AllProducts/>}/>
          <Route path='/MensWear' element={<MensWear/>}/>
          <Route path='/WomensWear' element={<WomensWear/>}/>
          <Route path='/KidsWear' element={<KidsWear/>}/>
          <Route path='/Cart' element={<Cart/>}/>
          <Route path='/UserDetails/:id' element={<UserDetails/>}/>
          <Route path='/AdminPanel' element={<AdminPanel/>}/>
          <Route path='/UploadProduct' element={<UploadProduct/>}/>
          <Route path='/Checkout' element={<Checkout/>}/>
          <Route path='/orderHistory' element={<OrderHistory/>}/>
       </Routes>
    </Router>
    <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
