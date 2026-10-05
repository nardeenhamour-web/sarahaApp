import { model, Schema } from "mongoose";
import { GenderEnum, providerEnum, roleEnum } from "../../modules/User/user.types.js";





const userSchema =new Schema({
firstName:{
    type:String,
    required:true
},
lastName:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
age:Number,
profileImage:{
    type:String

},
gender:{
    type:Number,
    enum:Object.values(GenderEnum)
},
provider:{
    type:Number,
    enum:Object.values(providerEnum),
    default:providerEnum.system
},
role:{
    type:Number,
    enum:Object.values(roleEnum),
    default:roleEnum.user
},
boi:String,
userName:{
    type:String,
    required:true,
    unique:true
},
confirmedAt:{
    type:Date
},
BlockedAt:Date,
phone:{
    type:String,
    required:true
}

},{
    timestamps:true,
    strict:true,
    strictQuery:true,
    optimisticConcurrency:true,
    toJSON:{
        virtuals:true,
        getters:true,
        transform(doc,ret){
            delete ret.id
            delete ret.password

            return ret
        }
    },
    toObject:{
        virtuals:true,
        getters:true,
        transform(doc,ret){
       //ديه علشان متخليش ال يظهر لل  userمن بره id
            delete ret.id
            return ret
            
        }
    },
    virtuals:{
        fullname:{
            get(){
                return this.firstName+" "+this.lastName
            },set(value){
                const [firstName,lastName]=value.split(" ")
                if(!firstName||!lastName){
                    throw new Error("in-valid fullname")
                }
                this.set("firstName",firstName)
                this.set("lastName",lastName)
            }
        }
    }
})

export const userModel=model("User",userSchema)