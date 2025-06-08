import mongoose, { Schema } from "mongoose";

const auth=new Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'authent'
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'authent'
    },
    message:{
        require:true,
        type:String
    }
})

export const messages =mongoose.model('messages',auth);