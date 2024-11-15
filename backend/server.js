require("dotenv").config()
const express = require("express");
const cors=require("cors");
const connectDB = require("./Config/db");
const app=express()

app.use(cors())
app.use(express.json())
connectDB()
const PORT=process.env.PORT||4000

app.use("/api/auth",require("./Routes/authRoutes"))
app.use("/api/cars",require("./Routes/carRoutes"))

app.get("/",(req,res)=>{
    res.send("hello")
})

app.listen(PORT,()=>console.log(  `server is running at ${PORT}`))