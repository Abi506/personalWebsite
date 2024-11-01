const mongoose=require('mongoose')
const encrypt=require("mongoose-encryption")

const contactSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
        min:10,
        max:10
    },
    vipConnections:{
        type:Boolean,
        default:false
    },
    groups:[]

})

const encryptionKey=process.env.encryption_key
const signatureKey=process.env.sign_key


contactSchema.plugin(encrypt,{encryptionKey:encryptionKey,signingKey:signatureKey,encryptedFields:["name","phoneNumber"]})

const Contact=mongoose.model("Contact",contactSchema)
module.exports=Contact