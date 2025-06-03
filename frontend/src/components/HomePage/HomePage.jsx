import React from 'react'
import './HomePage.css'
import { CartContext } from '../../context'
import { useContext } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

function HomePage() {
 const {isLoggedin} = useContext(CartContext)
 const navigate = useNavigate()

  function update() {
  if (isLoggedin) {
    navigate('/AllProducts');
  } else {
    toast.error('Please login first');
    navigate('/Login');
  }
}


  return (
    <>
      <div className='container1'>
        <div className='inner'>
            <div className='content'>
                <p className='head'>Welcome to BrainsKart</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur numquam, reprehenderit dolorum repellat, hic eius aliquam magni, asperiores nihil incidunt assumenda repellendus. Dolorum vitae omnis adipisci reiciendis recusandae asperiores error soluta consequatur molestiae eligendi nam repellendus ipsum vel nihil et, voluptas ex iste consectetur beatae at quisquam ut! Natus, deserunt.</p>
                <button onClick={update} className='btn'>SHOP NOW</button>
            </div>
        </div>
      </div>
    </>
  )
}

export default HomePage