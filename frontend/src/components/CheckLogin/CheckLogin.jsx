import React, { useEffect } from 'react'
import './CheckLogin'
import { toast } from 'react-toastify'
import { Outlet, useNavigate } from 'react-router'

function CheckLogin() {
    const navigate = useNavigate()
    let user = localStorage.getItem('user')
    
    useEffect(()=>{
        if(!user){
        toast.error('please login first')
        navigate('/Login')
    }
    },[])
    
  return (
    <Outlet/>
  )
}

export default CheckLogin