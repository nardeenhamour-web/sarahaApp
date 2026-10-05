import { userModel } from "../../DB/models/user.model.js"
import jwt from "jsonwebtoken"


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
    fullname,email,password,gender,phone,bio,age,userName
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
if(user.password!=password){
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


