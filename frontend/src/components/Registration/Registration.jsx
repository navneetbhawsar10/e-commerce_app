import React, { useRef, useState } from 'react'
import './Registration.css'
import { Link } from 'react-router'
import { toast } from 'react-toastify';
import axios from 'axios'
import { useNavigate } from 'react-router';


function Registration() {
  const navigate = useNavigate()
  const [nameisvalid,setnameisValid] = useState(true)
  const [emailisvalid,setemailisValid] = useState(true)
  const [confirmpasswordisvalid,setconfirmpasswordisValid] = useState(true)
  const[verification,setVerification] = useState(false)
  const [loading,setLoading] =  useState(false)
  const [count,setCount] = useState(30)
  const [state,setState] =  useState({
    user:{
      name:'',
      email:'',
      image:'',
      password:'',
      otp:''
    }
  })

let convertBase64String = (imageFile) => {
    
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.addEventListener('load', () => {
                if(fileReader.result){
                    resolve(fileReader.result);
                }
                else {
                    reject('Error Occurred');
                }
            })
        });
    };

     // updateImage
    let updateImage = async (event) => {
    
        let imageFile = event.target.files[0];
        let base64Image = await convertBase64String(imageFile);
        setState({
            user : {
                ...state.user,
                image : base64Image
            }
        });
    };

  function update(e){

    if(e.target.name=='name'){
      let regex = /^[a-zA-Z0-9_]{3,16}$/
      regex.test(e.target.value) || e.target.value=='' ?
      setnameisValid(true)
      :
      setnameisValid(false)
    }

    if(e.target.name=='email'){
      let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      regex.test(e.target.value) || e.target.value=='' ?
      setemailisValid(true)
      :
      setemailisValid(false)
    }


    setState({
      user:{
        ...state.user,
        [e.target.name]:e.target.value
      }
    })
  }


  function onSubmit(e){ 
     
       if(!state.user.email||!state.user.name||!state.user.password){
        toast.error(`please fill the required field`)
       }
       else
       {
         setLoading(true)
        let dataURL = 'http://127.0.0.1:7000/user_api/users';
        
        axios.post(dataURL , state.user).then((res) => {
          if(res.data.msg=='user exists'){
           toast.warn(res.data.msg)
           setLoading(false)
          }
          else{
             toast.success(`an otp has been sent to your email`)
             setLoading(false)
              setVerification(true)
          }  
        
        }).catch((error) => {
          toast.error('registration failed')
            console.error(error);
        });
       }
       
      
      
    }

    function checkPassword(e){
      e.target.value==state.user.password || e.target.value==''
      ? 
      setconfirmpasswordisValid(true) 
      : 
      setconfirmpasswordisValid(false)
    }

    function verify(){
      setLoading(true)
      axios.post('http://127.0.0.1:7000/user_api/verify',state.user)
      .then((res)=>{
         if(res.data.msg==='Verification successful'){
           toast.success(res.data.msg) 
            navigate('./Login')
         }
          else{
           setLoading(false)
          toast.error(res.data.msg)
          }
        })
        .catch((error)=>{
          console.log(error);
          
        })

    }


  return (
    <>
    <header className="header">
          <span className="login-icon">

            <i class="fa-solid fa-user" ></i>
          </span>
          Register Here
        </header>
    <div className='ragistrationbox'>
      <div className="login-container">
        <div className="login-box">
          <div className="login1">
            <h2>Register</h2>
          </div>
          <div className="loginregister">
            <input onChange={update} name='name' value={state.user.name} type='text'  placeholder='Name' className={nameisvalid?'input-field':'invalid-field'}/>
            <input onChange={update} name='email'value={state.user.email} type="email" placeholder="Email" className={emailisvalid?'input-field':'invalid-field'}/>
            <input
              onChange={update}
              name='password'
              type="password"
              placeholder="Password"
              className='input-field'
              value={state.user.password} 
            />
            <input
            onChange={checkPassword}
              type="password"
              placeholder="Confirm Password"
              className={confirmpasswordisvalid?'input-field':'invalid-field'}
            />
            <input onChange={updateImage} type='file' className='input-field' /> 

            <button onClick={onSubmit} className="login-button">{loading?<>...</>:<>Ragister</>}</button>
          </div>

          <p className="register-text">
            Already have an account ? </p>
            <p className="register-link">
              <Link to={'/Login'}>
              Login
              </Link>
            </p>
          <div className="footer-logo">BRAINSKART</div>
        </div>
      </div>
      {  verification&&
      <div className='otpbox'>
        <header className='header'>Email Verfication</header>
          <input onChange={update} name='otp' type="text" placeholder="Enter OTP" /><br/>
          <button onClick={verify} className='verifybtn'>{loading?<>verifying..</>:<>Verify</>}</button><br/>
      </div> 
         }
    </div>
    </>
  )
}

export default Registration