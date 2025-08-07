import express from "express";
import cors  from "cors"
import cookieParser from "cookie-parser";


const app =  express();

app.use(cors({
    origin:process.env.CORS_ORIGIN ,                   // KHA KHA SE ACCEPT KAREGA  REQUEST BACKEND 
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))    //url me jo data aarha wo encoded hota hai usko bhi accept karo 
app.use(express.static("public"))
app.use(cookieParser())       
                    

//import routers 
import userRouter from "./routes/user.js"




app.use("/api/v1/users",userRouter);

export {
    
    app
}