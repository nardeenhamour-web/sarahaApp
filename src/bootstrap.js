import express from "express"
import chalk from   "chalk"
import userRouter, {routes as userRoutes } from "./modules/User/user.controller.js"
import { DBconnection } from "./DB/DB.connection.js"
import { userModel } from "./DB/models/user.model.js"
import { errorRes } from "./utils/error.handle.js"
import cors from "cors"
import { sendEmail } from "./utils/email/sendEmail.js"
import createEmailTemplate from "./utils/email/emailTemplate.js"
import { nanoid } from "zod"
import { customAlphabet } from "nanoid"
import { random } from "./utils/email/createOtp.js"

const bootstrap=async()=>{
    const app=express()
    const port =process.env.PORT
    app.use(cors({
        origin:"*"
    }))
    app.use(express.json())
    await DBconnection()

    app.get("/",(req,res)=>res.send("hello world"))
   // const otp=random()
    // await sendEmail({to:"nardeenhamour@gmail.com",subject:"confirm email",html:createEmailTemplate({otp,subject:"confirm email"})})

//to image appear to user
    app.use("/uploads",express.static("./uploads"))


    app.use(userRoutes.base,userRouter)

    //await sendEmail()
  // await userModel.create({
      //  fullname:"anas mohamed",
       // email:"anas@gmail.com",
       // password:"123456878",
       // firstName:"anas",
       // lastName:"mohamed",
       // userName:"anas ",
       // phone:"01102346789889"
     //console.log(Math.random()*10);
          // console.log(nanoid(6));
        // const random =customAlphabet("012345678",6)
         // console.log(random());
           
        
   // })
    app.use((err,req,res,next)=>{
        const statuesCode=err.cause?.statuesCode||500
        res.status(statuesCode).json({
            errmsg:err.message,
            status:statuesCode,
            errOptions:err.cause?.options
        })
    })

 //  console.log(process.env);
    //.log(Math.round()*console10);
    

    app.listen(port,()=>console.log(chalk.green(`example app listing `)))
}

export default bootstrap