import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import './UserDetails.css'
import { toast } from 'react-toastify';



function UserDetails() {
  const navigate = useNavigate()
    const[show,setShow] = useState(false)
     const [user,setUser] = useState()
     const[nameisvalid,setnameisValid] = useState(true)
     const[emailisvalid,setemailisValid] = useState(true)
     const [data,setData] = useState({
        name:'',
        email:'',
        image:'',
     })
    const {id} = useParams()
 
    function getUser(){
        axios.get(`http://127.0.0.1:7000/user_api/user/${id}`).then((res)=>{
          setUser(res.data)
        })
       .catch((error)=>{
          console.log(error);
          
       })
    }

    useEffect(()=>{
        getUser()
    },[])

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

        setData({
            ...data,
            [e.target.name]:e.target.value
        })
    }

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
        setData({
                ...data,
                image : base64Image
        });
    };

    function submit(){
       const updatedData = {
        ...data,
    image: !data.image?user.image:data.image,
    email:!data.email?user.email:data.email,
    name:!data.name?user.name:data.name
  };

        axios.put(`http://127.0.0.1:7000/user_api/user/${id}`,updatedData).then(()=>{
          toast.success('updated successfully')
          setShow(false)

        })
        .catch((error)=>{
          console.log(error);
          
        })
       
    }

    function removePic(){
      axios.put(`http://127.0.0.1:7000/user_api/user/${id}`,{...user,image:'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}).then(()=>{
        toast.info('profile pic romoved')
        getUser()
      }).catch((error)=>{
         console.log(error);
         
      })
    }

    if (!user) return <p>Loading user details...</p>

  return (
    
    <>
    <header className="header1">
          <span className="login-icon">
            <i class="fa-solid fa-user" ></i>
          </span>
          User's Profile
        </header>
    <div className='userDetailsContainer'>
    <div className="box">
        <div className="image">
           <img width={400} height={270} src={user.image} /><br/>

           {
            user.image!='https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
            &&
            <button onClick={removePic} className='removebtn'>Remove pic</button>
           }
           
        </div>
        <div className="details">
        <table>
          <tbody>
           <tr><td><strong>Name:</strong>{user.name}</td></tr>
            <tr><td><strong>Email:</strong>{user.email} </td></tr>
          {
            user.role=='' ? <tr><td> <strong>Role:</strong>User</td></tr>
            :
           <tr><td><strong>Role:</strong>Admin </td></tr>
          }
          </tbody>
        </table>
        <Link to={`/resetPassword/${user._id}`}>Reset Password</Link><br/>
         <button onClick={()=>setShow(true)} className='edit-btn'>Edit Profile</button>
         {user.role=="Admin"&&<button onClick={()=>navigate('/AdminPanel')} className='action-btn'>Admin Actions</button>}
        </div>
    </div>
     {
        show&&
         <div className="userInfo">
        <form action="" className='detailsForm'>
            <label htmlFor="username">name: </label>
            <input className={nameisvalid?'input-field':'invalid-field'} onChange={update} name='name' type='text' value={data.name}/><br/>
            <label>Email:</label>
            <input className={emailisvalid?'input-field':'invalid-field'} onChange={update} type='email' name='email' value={data.email}/><br/>
            <label><img width={30} height={30} src={data.image}/></label><br/>
            <input onChange={updateImage} type='file'/><br/>
            <button onClick={submit} className='okbtn'>Ok</button>
        </form>
     </div>
     }
    
    </div>
    </>
  )
}

export default UserDetails