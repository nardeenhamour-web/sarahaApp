import nodemailer from "nodemailer"

import createEmailTemplate from "./emailTemplate.js"




export const sendEmail=async({to,subject,html})=>{
    const transporter=nodemailer.createTransport({
        auth:{
            user:process.env.USER,
            pass:process.env.PASS
        },
        service:"gmail",

    })

     const info=await transporter .sendMail({
        from:"saraha app <sarahaapp@gmail.com>",
        to,
        subject,
        html
     })
     console.log(info.accepted);
     

}