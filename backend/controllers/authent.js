import mongoose, { Schema } from "mongoose";

const auth=new Schema({
    email:{
        require:true,
        type:String,
        unique:true
    },
    password:{
        require:true,
        type:String,
    }
});

export const authent =mongoose.model('authent',auth);