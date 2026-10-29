import multer, { diskStorage, memoryStorage } from "multer"

export const uploadFile=(dest="/generall"//options in multer is dest
    )=>{

        //const storage=memoryStorage() //not take name or any thing // هخزن فى الرام
        // disk storage({}) // in hardDisk //take  file name ,destination هتخزنه فين
        const storage=diskStorage({
            destination:"./uploads"+ dest,
            //(req,file,cb)=>{
                //const userid=req.user._id
                //const foldername=`${dest}_${userid}`
              //  cb(null,foldername)
                //}
            filename:(req,file,cb//call back
                )=>{
                
                    const username=req.user.username
                    const filename=username+"_"+Date.now()+"_"+file.originalname
                    cb(null,filename)

            }
        })
    return multer({
        storage,
        //limits:{
         //   fieldSize:5*2040,
       // },
    //    fil
    dest
    
    })
}

 export const callback=(err,name)=>{
    if(err){
        throw new Error(err)
    }
    log("hello"+name)
}
//uploadFile().single("image")
