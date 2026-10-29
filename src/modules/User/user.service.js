import { userModel } from "../../DB/models/user.model.js"
import jwt from "jsonwebtoken"
import { decodeToken, tokenEnum } from "../../middlewares/auth.middleware.js";
import { comparehash, createhash } from "../../utils/secuirty/hash.js";
import { OAuth2Client } from "google-auth-library";
import { providerEnum } from "./user.types.js";
import { errorRes } from "../../utils/error.handle.js";
//import { random } from "nanoid";
//import { random1 } from "../../utils/email/createOtp.js";
import { sendEmail } from "../../utils/email/sendEmail.js";
import createEmailTemplate from "../../utils/email/emailTemplate.js";
import { random } from "../../utils/email/createOtp.js";

//من هنا اقدر افك بيه ال token
const  googleclient= new OAuth2Client()
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

// هخزن ال اوتبى علشان اقارنه اللى راح ايه وااللى دخلى ايه
 const otp=random()

 const expireIn=new Date(Date.now()+5*60*100)
await sendEmail({
    to:email,
    subject:"confirm email",
    html:createEmailTemplate({otp,subject:"confirm email"})
})




   const user=await userModel.create({
    fullname,email,password: await createhash(password),gender
    ,otp:{
        otp,
        expireIn
    },
    phone,bio,age,userName
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
    accessToken,
    refreshToken
}
}
}

export const googlelogin=async(token)=>{
const ticket=await googleclient.verifyIdToken({
    idToken:token,
    audience:process.env.CLIENT_ID
})

 const {email,name,picture}=ticket.getPayload()
let user =await userModel.findOne({email})
if(user){
if(user.provider != providerEnum.google){
   errorRes({
    msg:`use  your provider`
})
}
}else{
   user=await userModel.create({
    email,
    fullname:name,
    profileImage:picture,
    provider:providerEnum.google,
    confirmedAt:Date.now()
   })
}
//console.log({userData});




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



export const confirmEmail=async(email,otp)=>{
const user=await userModel.findOne({
    email,confirmedAt:{
        $exists:false
}})
if(!user){
errorRes({
    msg:"user not found",
    statusCode:404
})
}
await checkOtp(user,otp)

user.confirmedAt=Date.now()
await user.save()
}

export const forgetPassSendotp=async(email)=>{
    const user=await userModel.findOne({email})
    if(!user){
        return
    }
    //لو لسه بعتله اوتبى ولسه مش اكسبير يستنى شوية لحد ما اكسبير 
    if(user.otp.expireIn>Date.now()){
        return 
    }
    const otp=random(6)
    //hash otp in database
    user.otp.otp=await createhash(otp)
    user.otp.expireIn=Date.now()+5*60*1000
    await user.save()
    sendEmail({
        to:email,
        subject:"forget password",
        html:createEmailTemplate({
            otp,
            subject:"forget password"
        })
    })

    return{
        data:{}
    }
}



export const resetPassword=async(email,otp,password)=>{
    const user=await userModel.findOne({email})
if(!user){
errorRes({
    msg:"user not found",
    statusCode:404
})
}

await checkOtp(user,otp)

user.password=await createhash(password)
await user.save()


return{
    data:{}
}

}

export const checkOtp=async(user,otp)=>{
    if( !user.otp||user.otp.expireIn<Date.now()){
 errorRes({
    msg:"otp expired ",
    statusCode:404
 })
}
if (!await comparehash(otp,user.otp.otp)){
errorRes({
    msg:"invalid otp",
    statusCode:400
})
}


}