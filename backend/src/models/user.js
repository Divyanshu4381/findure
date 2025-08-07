import mongoose from "mongoose";

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        index: true,                          //searching easy bnata hai 
    },

    email: {

        type: String,
        unique: true,
        required: true,
        unique: true,
        trim: true,
        lowercase: true                             // isem index nhi rkha jaata hai note*


    },

    password: {
        type: String,
        required: [true, 'Password is requird'],
    },
    // Owner photo
    
    avatar: {
        type: String,     //cloudinary url
        // required: true,
        
    },
    otp:{
        type:String,

    },
    otpExpiry:{
        type:String,

    },
    refreshToken: {
        type: String,
    },


}, { timestamps: true })


//   ye function ek middleare hai   ku ki agar arraow function denge callback directly to this keyword ko acces nhi kar paenge
//jaise hi save hoga data  password ko hash kar dega 
//ye tbhi hash karega jab mere paswword jab bhi modify hoga 

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    //agar paswword me kuch bhi modify nhi hua  hai  to return karo next matlab agala function perform karo 
    this.password = await bcrypt.hash(this.password, 10)

    next()
})

// ham apan ek method bna rahe ar user schema me ye method add kar rahe .methods() kw trough // paswword correct hai ya nhi 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)

}
//nya method  to generate access token
//  jwt.sign() user ka data leke ek secure, time-limited token banata hai jo frontend aur backend ke beech auth ka kaam karta hai — bina password baar-baar bhejne ke.

userSchema.methods.generateAcessToken = function () {

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username

    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}
//refersh token  

userSchema.methods.generateRefreshToken = function () {

    return jwt.sign({
        _id: this._id,

    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}
/**
 * @type {import("mongoose").Model}
 */



export const User = mongoose.model("User", userSchema);