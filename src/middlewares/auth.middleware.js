 import jwt from "jsonwebtoken"
 import { userModel } from "../DB/models/user.model.js";
 
 
 
 export const auth=async(req,res,next)=>{
     const authorization= req.headers.authorization
    
    console.log({authorization});
    if(!authorization||!authorization.startsWith("Bearer")){
        throw new Error("invalid token ")
    }
    //delete word baerer to get token only
    const token=authorization.split(" ")[1]
    const payload=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
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
    req.user=user
   next()
}