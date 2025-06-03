import React from 'react'
import "./UploadProduct.css"
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Link, useNavigate } from 'react-router'

function UploadProduct() {
   
    const navigate = useNavigate()
    const[state,setState] = useState({
        Product:{
           title:'',
           price:'',
           image:'',
           brand:'',
           info:'',
           category:''
        }
    })

    function update(e){
      setState({
          Product:{
            ...state.Product,
            [e.target.name]:e.target.value
          }
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
        setState({
          Product:{
             ...state.Product,
             image : base64Image 
          }
                
        });
    };

    function submit(){
        const { title, price, image, brand, info, category } = state.Product;

      if (!title || !price || !image || !brand || !info || !category) {
       toast.error("Please fill in all fields");
  }
    else{
        axios.post('http://127.0.0.1:7000/api/products',state.Product).then(()=>{
          toast.success('product has been added')
          navigate('/AdminPanel').catch(()=>{
            toast.error('failed')
          })
        })
    }
    }

  return (
    <>
    <header className="header1">
          Upload new Product
        </header>
    <div className="updatecontainer">
      <div className="update-from">
            <input onChange={update} placeholder='Name'  name='title'  type='text'  className='input-fields'/>
            <input onChange={update}  placeholder='price' name='price' type="text" className='input-fields'/>
            <input
              placeholder='brand'
              name='brand'
              onChange={update}
              type="text"
              className='input-fields' 
            />
            <input
              onChange={update}  
              placeholder='info'
              name='info'
              className='input-fields'
            />
            <select onChange={update} id="category" name="category" className='input-fields'>
              <option value="">--Select Category--</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
           </select><br/>
           {
            state.Product.image&&
            <label style={{border:'none'}} className='input-fields'><img src={state.Product.image} width={40} height={60}/></label>
           }
            <input onChange={updateImage}  style={{border:'none'}} type='file' className='input-fields' /> <br/>

            <button onClick={submit}  className="Add_btn">Add</button>
          </div>
        </div>
        </>
  )
}

export default UploadProduct