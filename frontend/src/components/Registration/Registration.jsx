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
  const [state,setState] =  useState({
    user:{
      name:'',
      email:'',
      image:'',
      password:'',
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
         e.preventDefault();
        let dataURL = 'http://127.0.0.1:7000/user_api/users';
        
        axios.post(dataURL , state.user).then((res) => {
        toast.success(`Registered successfully`)
        navigate('/login')
        setState({
          user:{
            name:'',
            email:'',
            password:'',
            image:''
          }
        })
        
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


  return (
    <>
    <div>
      <div className="login-container">
        <header className="header">
          <span className="login-icon">

            <i class="fa-solid fa-user" ></i>
          </span>
          Register Here
        </header>
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

            <button onClick={onSubmit} className="login-button">Register</button>
          </div>

          <p className="register-text">
            Already have an account ?
            <p className="register-link">
              <Link to={'/Login'}>
              Login
              </Link>
            </p>
            
          </p>
          <div className="footer-logo">BRAINSKART</div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Registration