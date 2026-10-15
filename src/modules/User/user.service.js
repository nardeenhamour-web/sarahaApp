import { userModel } from "../../DB/models/user.model.js"
import jwt from "jsonwebtoken"
import { decodeToken, tokenEnum } from "../../middlewares/auth.middleware.js";
import { comparehash, createhash } from "../../utils/secuirty/hash.js";


export const signupService=async({fullname,email,password,gender,phone,bio,age,userName})=>{
   // const isEmailExists=Promise.all([])
   const isExist=await userModel.findOne({
    $or:[
        {email},
        {userName}
    ]
   })
   if(isExist){
    throw new Error("email or username already exists");
    
   }
   const user=await userModel.create({
    fullname,email,password: await createhash(password),gender,phone,bio,age,userName
   })
   return{
    data:user
   }
}

export const loginService=async(identifier,password)=>{
const user=await userModel.findOne({
    $or:[
        {email:identifier},
        {userName:identifier}
    ]
})
if(!user){
    throw new Error("invalid credentials")
}
const ispasswordmatch=await comparehash(password,user.password)
if(!ispasswordmatch){
    throw new Error("invalid credentials")
}
 const accessToken =jwt.sign({
    _id:user._id,
    email:user.email
},process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:"15Min"
})

const refreshToken=jwt.sign({
    _id:user._id,
    email:user.email
},process.env.REFRESH_TOKEN_SECRET,{
expiresIn:"7d"
})
return{
    data:{
        accessToken,
        refreshToken
    }
}
}


export const refreshToken=async(authorization)=>{
const {user}=await decodeToken({authorization,tokenType:tokenEnum.refresh})
const accessToken=jwt.sign({
    _id:user._id,
    email:user.email
},process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:"30D"
})
return{
data:{
    accessToken
}
}
}