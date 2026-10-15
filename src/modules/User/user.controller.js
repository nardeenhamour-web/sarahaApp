import { Router } from "express";
import { suceessRes } from "../../utils/success.res.js";
import { loginService, refreshToken, signupService } from "./user.service.js";
import jwt from "jsonwebtoken";
import { userModel } from "../../DB/models/user.model.js";
import {auth, authorization, tokenEnum} from "../../middlewares/auth.middleware.js"
import { roleEnum } from "./user.types.js";
import { signupSchema } from "./user.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";
const router=Router()

export const routes={
    base:"/users",
    signup:"/signup",//post
    login:"/login",//post
    me:"/me",//get
    refreshToken:"/refresh-token"//post
}

router.post(routes.signup,validation(signupSchema),async(req,res)=>{
//validation
 const validationRes=signupSchema.safeParse(req.body)



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
//if you not want to user   write roleEnum.admin only
router.get(routes.me,auth,authorization(roleEnum.user,roleEnum.admin),async(req,res)=>{
   const user=req.user
   suceessRes({res,data:{user}})
})
router.post(routes.refreshToken,async(req,res)=>{
     const authorization= req.headers.authorization
     const{}=await refreshToken(authorization)
     return suceessRes({
        res,
        data
     })
})
export default router