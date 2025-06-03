const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')


dotenv.config({path:'.env'})

const port = process.env.PORT || 6000

app.use(express.json())
app.use(cors())
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('database connected succcessfully');
    
}).catch((error)=>{
    console.log(error);
}
)

app.use('/api',require('./Routes/productRoutes'))
app.use('/user_api',require('./Routes/userRoutes'))
app.use('/cart_api',require('./Routes/cartRoutes'))
app.use('/order_api',require('./Routes/orderRoutes'))


app.listen(port,()=>{
  console.log(`server started on ${port}`)
})