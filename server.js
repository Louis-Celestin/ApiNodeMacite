const express = require('express')
const fielUpload = require('express-fileupload')
const bodyParser = require('body-parser')
// const router = express.Router()
const userRouter = require('./routes/userRoute')
const propositionRouter = require('./routes/propositionsIdeesRoute')
const voteRouter = require('./routes/voteSondageRoute')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000


const app = express()
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(cors())
app.use(fielUpload())


app.use('/api', userRouter)
app.use('/api',propositionRouter)
app.use('/api',voteRouter)
app.listen(port,()=>{
    console.log(`This server is running on port : ${port}`)
})