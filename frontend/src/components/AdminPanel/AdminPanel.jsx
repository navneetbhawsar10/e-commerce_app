import React, { useEffect, useState } from 'react'
import './AdminPanel.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router'

function AdminPanel() {
    const[products,setProducts]=useState([])
    const[allproduct,setAllproducts] = useState([])
    const[show,setShow]=useState(false)
    const[target,setTarget] = useState({})
    const[state,setState] = useState({
      updatedProduct:{
           title:'',
           price:'',
           image:'',
           brand:'',
           info:'',
           qty:'',
           category:''
      }
     
    })

    function getAllProduct(){
      axios.get('http://127.0.0.1:7000/api/products').then((res)=>{
        setProducts(res.data.product)
        setAllproducts(res.data.product)
      })
      .catch((error)=>{
        console.log(error);
        
      })  
    }
    useEffect(()=>{
         getAllProduct()
    },[])

    function update(id){
     setShow(true)
     let selected = ( products.find((i)=>i._id==id))
     setTarget(selected)
     setState({
      updatedProduct:{
           title:selected.title,
           price:selected.price,
           image:selected.image,
           brand:selected.brand,
           info:selected.info,
           qty:selected.qty,
           category:selected.category
      }
     })
     
    }

  function search(e){
    if(e.target.value=='') setProducts(allproduct)
    else setProducts(products.filter((i)=>i.title.toLowerCase().includes(e.target.value.toLowerCase())))
  }

  function remove(id){
     axios.delete(`http://127.0.0.1:7000/api/products/${id}`).then((res)=>{
       let deleted = res.data.product.title
        toast.info(`${deleted} product deleted`)
        getAllProduct()
     })
     .catch((error)=>{
         console.log(error);
         
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
          updatedProduct:{
             ...state.updatedProduct,
             image : base64Image 
          }
                
        });
    };

  function updateInfo(e){

     setState({
         updatedProduct:{
          ...state.updatedProduct,
        [e.target.name]:e.target.value
      }
    })
  }

  function submit(){

    let id = target._id
    axios.put(`http://127.0.0.1:7000/api/product/${id}`,state.updatedProduct).then(()=>{
      toast.success('product has been updted')
      setShow(false)
      getAllProduct()
      
    })
    .catch((error)=>{
      console.log(error);
      toast.error("updation failed")
      
    })
  }

function deleteaAllProduct(){
  axios.delete('http://127.0.0.1:7000/api/products').then(()=>{
    toast.success('all products deleted')
    getAllProduct()
  })
  .catch((error)=>{
    console.log(error);
    
  })
}

  return (
    <>
      <header className="header1">
          Admin panel
        </header>
        {
            !show?
            <>
              <div className="btndiv">
            <input onChange={search} className='searchbar' placeholder='Search Product'/>
        </div>
        <div className='adminContainer'>
          <div className="btndiv2">
            <Link to='/UploadProduct'><button className='uploadbtn'>Upload Product</button></Link>
          <button onClick={deleteaAllProduct} className='del-btn'>Delete All Products</button>
          </div>
          
        <div className='divTable'> 
        <header className='carthead'>Products</header>
        {
          products?
          <table className='itemTable'>
        <thead>
          <tr className='headRow'>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
           products.map((item)=>(
             <tr className='productRow' key={item.id}>
              <td className=''><img src={item.image} width={40} height={60}/></td>
              <td>{item.title}</td>
              <td>Rs.{item.price}</td>
              <td><button onClick={()=>update(item._id)} className='updatebtn'>Update</button><button onClick={()=>remove(item._id)} className='actionButton'>DELETE</button></td>
              
             </tr>  
           ))
          }
        </tbody>
        </table>
        :
        <h1>No Products....!</h1>
        }
        
      </div>
      </div>  
    </>
             
      :
      <div className="updatecontainer">
      <div className="update-from">
        <img height={200} width={200} src={target.image}/><br/>
            <input onChange={updateInfo} name='title'  type='text' value={state.updatedProduct.title} className='input-fields'/>
            <input onChange={updateInfo} name='price' type="text" value={state.updatedProduct.price} className='input-fields'/>
            <input
              onChange={updateInfo}
              name='brand'
              type="text"
              value={state.updatedProduct.brand}
              className='input-fields' 
            />
            <input
            onChange={updateInfo}
              name='info'
              value={state.updatedProduct.info}
              className='input-fields'
            />
            <select value={state.updatedProduct.category} onChange={updateInfo} id="category" name="category" className='input-fields'>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
           </select><br/>
            <label style={{border:'none'}} className='input-fields'><img width={40} height={60} src={state.updatedProduct.image}/></label>
            <input onChange={updateImage} style={{border:'none'}} type='file' className='input-fields' /> <br/>

            <button onClick={submit} className="update_btn">Update</button>
          </div>
        </div>
        }
       
    </>
  )
}

export default AdminPanel