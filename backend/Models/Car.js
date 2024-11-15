const mongoose=require("mongoose")

const CarSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    tags:[
        {type:String}
    ],
    images:[
        {type:String}],
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     }   
},{timestamps:true})

module.exports=mongoose.model("Car",CarSchema)