import mongoose from "mongoose"
import  Joi  from 'joi';

const reportSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{
        type: String,
        required: true,
        enum : ["murder", "robbery", "assault", "vandalism", "theft", "other"]
        
    },
    description:{
        type: String,
        required: true
    },
    location:{
        latitude:{type: Number},
        longitude: {type: Number},
    },
    status:{
        type: String,
        default: 'pending',
        enum: ["pending", "accepted", "investigating", "resolved", "rejected"]
    },
    media:[],
    
    isActive:{
      type: Boolean,
      default: true,
      
    }
}, {timestamps: true})

function validateReport (data){
    const schema = Joi.object({
        user: Joi.string()
          .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
              return helpers.error("any.invalid");
            }
            return value;
          }, "ObjectId validation")
          .required(),
      
        type: Joi.string().min(3).max(100).required(),
      
        description: Joi.string().min(5).max(1000).required(),
      
        status: Joi.string()
          .valid("pending", "accepted", "investigating", "resolved", "rejected")
          .default("pending")
      });

    const {error} = schema.validate(data)
    return error?.message
}

const reportModel = mongoose.model("Report", reportSchema)

export default {reportModel, validateReport}

