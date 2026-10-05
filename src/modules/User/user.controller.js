import { Router } from "express";
import { suceessRes } from "../../utils/success.res.js";
import { loginService, signupService } from "./user.service.js";
import jwt from "jsonwebtoken";
import { userModel } from "../../DB/models/user.model.js";
import {auth} from "../../middlewares/auth.middleware.js"
const router=Router()

export const routes={
    base:"/users",
    signup:"/signup",//post
    login:"/login",//post
    me:"/me",//get
    refreshToken:"/refresh-token"//post
}

router.post(routes.signup,async(req,res)=>{
    const{data}=await signupService(req.body)
    return suceessRes({
        res,
        status:201,
        data
    })
})

router.post(routes.login,async(req,res)=>{
    //بيانات الللى جايه من المستخدم من بره ومحتاج اتاكد منها
    const{ identifier,password}=req.body
    //هنا بتاكد من الابيانات واعمل الtoken 
    const{data}=await loginService(identifier,password)
    return suceessRes({
        res,
        data
    })
})
router.get(routes.me,auth,async(req,res)=>{
   const user=req.user
   suceessRes({res,data:{user}})
})
router.post(routes.refreshToken,async(req,res)=>{
     const authorization= req.headers.authorization
        
        console.log({authorization});
        if(!authorization||!authorization.startsWith("Bearer")){
            throw new Error("invalid token ")
        }
        //delete word baerer to get token only
        const token=authorization.split(" ")[1]
        const payload=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
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
      
})
export default router