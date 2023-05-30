const mongoose=require('mongoose')

const logreg = new mongoose.Schema({
    names:{
        type:String,
        required:[true,'please provide a name']
    },
    email:{
        type:String,
        required:[true,'please provide a EMAIL']
    },
    password:{
        type:String
    },
    confirmPassword:{
        type:String
    },
    phoneNumber:{
        type:Number
    }

})

const otpSchema = new mongoose.Schema({
    token: {
        type: String,
        required:true
    },
    otp:{
        type:Number,
        required:true
    },
    
     createdAt: { type: Date, expires: 5000, default: Date.now }  
})

const Otp = mongoose.model('otp',otpSchema)

const User = mongoose.model('collection_03',logreg)

module.exports = {
    Otp,
    User
}