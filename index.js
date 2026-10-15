import bootstrap from "./src/bootstrap.js"
//import { GenderEnum } from "./src/modules/User/user.types.js";
import { decryption, encryption } from "./src/utils/secuirty/encryption.js";
//import jwt from "jsonwebtoken"
//import z, { email } from "zod"


bootstrap()
//console.log(jwt.verify("dfgujklzxcvbnmwertyiop",process.env.ACCESS_TOKEN_SECRET));
//console.log(encryption("anas"));
//validation by zod
//strict object علشان يرفض ان حد يدخل متغيرات زيادة عن البرنامج عايزها


// phoneSchema.parse(true)  (error)

//console.log(result.error);


const enc=encryption("anas")
console.log({enc});
console.log(decryption(enc));

