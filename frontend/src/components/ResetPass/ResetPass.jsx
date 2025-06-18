import React, { useState } from 'react'
import './ResetPass.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router'

function ResetPass() {
    const[password,setPassword] = useState('')
    const navigate = useNavigate()
    let {id} = useParams()

function submit(){
    if(!password){
        toast.error('please enter the password')
        return
    }
    axios.put(`http://127.0.0.1:7000/user_api/user/${id}`,{password:password}).then((res)=>{
        toast.success(res.data.msg)
        navigate('/Login')
    })
    .catch((error)=>{
        console.log(error);
        
    })
}
  return (
    <>
    <pre>{JSON.stringify(password)}</pre>
    <div className='resetpasscont'>
        <div className="reset_form">
            <header className='pas_head'>Reset Password</header>
            <input className='reset_input' onChange={(e)=>setPassword(e.target.value)} placeholder='enter new password'/><br/>
            <input className='reset_input' placeholder='confirm password'/><br/>
            <button onClick={submit} className='subbtn'>ok</button>
        </div>
    </div>
    </>
  )
}

export default ResetPass