import mongoose from "mongoose"
import  Joi  from 'joi';

const mediaSchema = new mongoose.Schema({
    reportId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
        required: true
    },

    media:{
        type: String
    },


}, {timestamps: true})

function validateMedia (data) {
    const schema = Joi.object({
        userId: Joi.string()
          .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
              return helpers.error("any.invalid");
            }
            return value;
          }, "ObjectId validation")
          .required(),
      
        media: Joi.string()
          .uri()
          .optional()
      })
    const {error} = schema.validate(data)
    return error?.message
}

const mediaModel = mongoose.model("Media", mediaSchema)

export default {mediaModel, validateMedia}