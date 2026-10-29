import { Router } from "express";

import { suceessRes } from "../../utils/success.res.js";

import {
    confirmEmail,
    forgetPassSendotp,
    googlelogin,
    loginService,
    refreshToken,
    resetPassword,
    signupService
} from "./user.service.js";

import {
    auth,
    authorization
} from "../../middlewares/auth.middleware.js";

import { roleEnum } from "./user.types.js";

import { resetPasswordSchema, signupSchema } from "./user.validation.js";

import { validation } from "../../middlewares/validation.middleware.js";

import { errorRes } from "../../utils/error.handle.js";
import { success } from "zod";
import multer from "multer";
import { uploadFile } from "../../utils/multer.js";
import { isAsync } from "zod/v3";


const router = Router();


// ==================== ROUTES ====================

export const routes = {
    base: "/users",
    signup: "/signup",
    login: "/login",
    me: "/me",
    refreshToken: "/refresh-token",
    googleSignup: "/signup/gmail",
    confirmEmail:"/confirme-email",
    forgetPassword:"/forget-password",//patch
    resetPassword:"/reset-password",//patch
    uploadFile:"/upload-file",//get

};


// ==================== SIGNUP ====================

router.post(
    routes.signup,
    validation(signupSchema),
    async (req, res, next) => {
        try {
            const { data } = await signupService(req.body);

            return suceessRes({
                res,
                status: 201,
                data
            });

        } catch (error) {
            return next(error);
        }
    }
);


// ==================== LOGIN ====================

router.post(
    routes.login,
    async (req, res, next) => {
        try {
            const { identifier, password } = req.body;

            if (!identifier || !password) {
                errorRes({
                    msg: "Identifier and password are required",
                    statusCode: 400
                });
            }

            const result = await loginService(
                identifier,
                password
            );

            if (!result) {
                errorRes({
                    msg: "Login service did not return a result",
                    statusCode: 500
                });
            }

            return suceessRes({
                res,
                data: result.data
            });

        } catch (error) {
            return next(error);
        }
    }
);


// ==================== GET MY PROFILE ====================

router.get(
    routes.me,
    auth,
    authorization(roleEnum.user, roleEnum.admin),
    async (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                errorRes({
                    msg: "User not found",
                    statusCode: 404
                });
            }

            return suceessRes({
                res,
                data: { user }
            });

        } catch (error) {
            return next(error);
        }
    }
);


// ==================== REFRESH TOKEN ====================

router.post(
    routes.refreshToken,
    async (req, res, next) => {
        try {
            const authorizationHeader = req.headers.authorization;

            if (!authorizationHeader) {
                errorRes({
                    msg: "Authorization header is required",
                    statusCode: 401
                });
            }

            const result = await refreshToken(
                authorizationHeader
            );

            return suceessRes({
                res,
                data: result.data
            });

        } catch (error) {
            return next(error);
        }
    }
);


// ==================== GOOGLE SIGNUP / LOGIN ====================

router.post(
    routes.googleSignup,
    async (req, res, next) => {
        try {
            const { idToken } = req.body;

            if (!idToken) {
                errorRes({
                    msg: "Google ID token is required",
                    statusCode: 400
                });
            }

            const { data } = await googlelogin(idToken);

            return suceessRes({
                res,
                data
            });

        } catch (error) {
            return next(error);
        }
    }
);


router.patch(routes.confirmEmail,async(req,res)=>{
const{email,otp}=req.body

const {data}=await confirmEmail(email,otp)
suceessRes({
    res,
    data
})

})

//==========forgetPassword=============
router.patch(routes.forgetPassword,async(req,res)=>{
    const{email}=req.body
    await forgetPassSendotp(email)



    return suceessRes({
        res,
        msg:"otp sent to email if exist"
    })
})
// before go to reset new password
//router.patch("/check-email",async(req,res)=>{
    //const {email,otp }=req.body
    
//})


//هيبعتلى بقى هو الحاجة ديه تانى بقى الاتوبى
// reset password
router.patch(routes.resetPassword,validation(resetPasswordSchema),async(req,res)=>{
    const {email,otp,password }=req.body
    await resetPassword(email,otp,password)

    suceessRes({res})
})
 
router.get(routes.uploadFile,auth,//.any().
   uploadFile("general"// file add in vs name of file 

   ).single("image")
,async(req,res)=>{//.array("images",2)
//any accept any thing in file  .any()
//single detected some files accept one file by multer and write what file in postman  is detected   .single("image")
// array  like single but accept more files  by multer .array("images") but filed one contain more than one image
// images contain more than one image
//array take field images cotain more than image and the most number (the max number)of images
//fields([]) more fields contain array of objects  {name of filed,max count}
//[{name :image1,maxcount:3}x,{name:image2,maxcount:2}]
// none not accept any files
console.log({
    body:req.body,
    files:req.file// to image print size of image and other things of images
});
req.user. profileImage=req.file.path
await req.user.save()


    suceessRes({res})
})





export default router;