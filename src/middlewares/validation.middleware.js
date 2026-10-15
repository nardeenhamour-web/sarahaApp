


export const validation=(Schema)=>{
return(req,res,next)=>{
    const validationErrors=[]
Object.keys(Schema).map(ele=>{
   const validationRes= Schema[ele].safeParse(req[ele])


if(!validationRes.success){
    //throw new Error(validationRes.error.issues  );
    validationErrors.push({
        [ele]:validationRes.errors.issues
    })
}
})
if(validationErrors.length){
throw new Error("validation errors");

}


next()
}
}