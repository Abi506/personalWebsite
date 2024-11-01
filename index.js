const express=require("express")
const app=express()
const mongoose=require("mongoose")
const dotenv=require("dotenv")
app.use(express.json())
dotenv.config()

const contactRoute=require("./route/contact")
const taskPrioriterRoute=require("./route/taskPrioriter")
const videoWatchLaterRoute=require("./route/videoWatchLater")

mongoose.connect("mongodb+srv://abinandhan:hqzzdU3vLepl8gY8@cluster0.2x76hsn.mongodb.net/personalData")
.then(()=>console.log("Mongodb connected successfully"))
.catch((error)=>console.log("Error while connecting mongoDb",error))

app.use('/contact',contactRoute)
app.use("/taskPrioriter",taskPrioriterRoute)
app.use('/videoWatchLater',videoWatchLaterRoute)

app.listen(3000,()=>{
    console.log("Server is running in localhost:3000")
})