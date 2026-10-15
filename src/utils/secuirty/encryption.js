import crypto from "node:crypto"
// intial vector (iv)like salt,secretkey ,algorthim 
// connect by length between them 


const secretKey= Buffer.from("asdfghjkloiuytrewqzxcvbnmlkjhgfd")//32 return as buffer

export const encryption=(data)=>{
    //intial fector (iv)=1/2 length secretKey 16
    const iv=crypto.randomBytes(16)
//algorthim 
const cipher=crypto.createCipheriv("aes-256-cbc",secretKey,iv)
let cipherText=cipher.update(data,"utf-8","hex")// data ,typeofdata(utf8) return data as hexa
 cipherText+= cipher.final("hex")//word is final return as hexa

 return `${iv.toString("hex")}:${cipherText}`
}

export const decryption =(encryptedvalue)=>{
const [iv,cipherText]=encryptedvalue.split(":")
if(!iv||!cipherText){
throw new Error("invalid encrypted value ")
}
const binaryiv=Buffer.from(iv,"hex")
const deciper=crypto.createDecipheriv("aes-256-cbc",secretKey,binaryiv)
let plaintext=deciper.update(cipherText,"hex","utf-8")
plaintext+=deciper.final("utf8")
return plaintext
}
