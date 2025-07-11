import mongoose from "mongoose"
import  Joi  from 'joi';

const logSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description:{
        type: String,
        required: true
    },  
}, {timestamps: true})


const logModel = mongoose.model("Log", logSchema)
export default {logModel}

