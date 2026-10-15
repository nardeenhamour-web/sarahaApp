 import jwt from "jsonwebtoken"
 import { userModel } from "../DB/models/user.model.js";
 
 export const tokenEnum={
    access:"access",
    refresh:"refresh"
 }
 
 export const auth=async(req,res,next)=>{
     const{user}=await decodeToken({authorization:req.headers.authorization})
    req.user=user
   next()
}
// take token and type of token access or refresh token 
//defult is access token 

export const decodeToken=async({authorization,tokenType=tokenEnum.access})=>{
 //const authorization= req.headers.authorization
    
    console.log({authorization});
    if(!authorization||!authorization.startsWith("Bearer")){
        throw new Error("invalid token ")
    }
    //delete word baerer to get token only
    const token=authorization.split(" ")[1]
    const payload=jwt.verify(token,tokenType==tokenEnum.access?process.env.ACCESS_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET)
    console.log({payload});
    
    console.log({token});
    const user =await userModel.findById(payload._id)
    console.log({user});
    if(!user){
        throw new Error(" user not found")
    }
    if(!user.confirmedAt){
        throw new Error("confirm first ")
    }
    return{
        user
    }
}

// roles in array like user ,admin ,and others 
export const authorization=(...roles)=>{
    return(req,res,next)=>{
        console.log({roles,userRole:req.user.role});
        
    //console.log({roles,path:req.path});
    // if not contain user or admin otherwise look error unauthorization 
        if(!roles.includes(req.user.role)){
            throw new Error("unauthorization")
        }
    next()
    }

}