import express from "express"
import chalk from   "chalk"
import userRouter, {routes as userRoutes } from "./modules/User/user.controller.js"
import { DBconnection } from "./DB/DB.connection.js"
import { userModel } from "./DB/models/user.model.js"




const bootstrap=async()=>{
    const app=express()
    const port =process.env.PORT
    app.use(express.json())
    await DBconnection()

    app.get("/",(req,res)=>res.send("hello world"))

    app.use(userRoutes.base,userRouter)
  // await userModel.create({
      //  fullname:"anas mohamed",
       // email:"anas@gmail.com",
       // password:"123456878",
       // firstName:"anas",
       // lastName:"mohamed",
       // userName:"anas ",
       // phone:"01102346789889"

        
   // })
    app.use((err,req,res,next)=>{
        const statuesCode=err.cause
        res.status(500).json({
            errmsg:err.message,
            status:500
        })
    })

    console.log(process.env);
    

    app.listen(port,()=>console.log(chalk.green(`example app listing `)))
}

export default bootstrap