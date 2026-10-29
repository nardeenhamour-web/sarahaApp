import z from "zod"
import { GenderEnum } from "./user.types.js"


//validation by zod
//strict object علشان يرفض ان حد يدخل متغيرات زيادة عن البرنامج عايزها

export const signupSchema = {
    body: z.strictObject({

        // defult is reqired if want to optional .optional

        fullname: z.string(),
        email: z.email(),
        phone: z.string().min(10).max(15),
        password: z.string(),
        age: z.number().optional(),

        //enum not number but male ,female

        gender: z.enum(GenderEnum),
        userName: z.string(),
        bio: z.string().optional(),
        //check confirm password by validation to equal password
        confirmPassword:z.string()
    })//refine seeing all schema to compare if confirm password==password
    //arg is object
    .refine((arg)=>arg.password==arg.confirmPassword,{
        error:"password mismatch",
        path:["password","confirmPassword"]
    })//,

    //query: z.strictObject({
     //  id: z.string()
   // })
}

//signupSchema.body
export const resetPasswordSchema={
    body:z.strictObject({
        email:z.email(),
        otp:z.string().min(6).max(6),
        password:z.string(),
        confirmPassword:z.string(),

    })
    .refine((arg)=>arg.password==arg.confirmPassword,{
        error:"password mismatch",
        path:["password","confirmPassword"]
    })//,

}
//Object.keys(signupSchema).map(ele=>{
    //signupSchema[ele].safeParse(req[ele])
//});