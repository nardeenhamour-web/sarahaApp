import chalk from "chalk";
import mongoose from "mongoose";


export const DBconnection =async()=>{
    try{
         await mongoose.connect(process.env.DB_URL,{
            serverSelectionTimeoutMS:5000
         })
         console.log(chalk.green("DB connection successfuly"));
         
    }catch(error){
        console.log(chalk.red("DB connection failed=>"),error);
        
    }
}