import   dotenv from "dotenv"
import {app }from "./app.js"
import connectDB from "./db/index.js"
import cors from "cors"
dotenv.config({path:'./.env'})
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Set your allowed origin here
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true, // Allow credentials if needed
}));
connectDB().then(()=>{
   app.listen(process.env.PORT,()=>{
    console.log(`app is running on the port ${process.env.PORT}`)
   })

}).catch((error)=>{
    console.log(`express app not running `,error)
})
