import Joi from "joi";
import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'pending',
        enum: ["pending", "accepted", "rejected"]
    },
    isActive:{
        type: Boolean,
        default: true
    }

}, {timestamps: true})

function validateSupport(data) {
    const schema = Joi.object({
        user: Joi.string().required(),
        message: Joi.string().required(),
        status: Joi.string().required().valid("pending", "accepted", "rejected")
    })

    const { error } = schema.validate(data)
    return error?.message
}

const supportModel = mongoose.model("Support", supportSchema)

export default { supportModel, validateSupport }