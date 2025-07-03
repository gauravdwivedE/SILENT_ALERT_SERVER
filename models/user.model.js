import mongoose from "mongoose"
import Joi  from 'joi'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: Number
    },
    address:{
        type: String
    },
    adhaar:{
        type: Number
    },
    password:{
        type: String,
    },
    type:{
        type:String,
        default:"normal"
    },
    role: {
        type: String,
        enum: ["admin", "superAdmin", "user", "inspector"],
        default:"user"
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    image:{
        type: String,
        default:"https://res.cloudinary.com/dwnlb6xgt/image/upload/v1749889591/360_F_1128725045_1Xv5xuXLcAEW9Sm0ToMJEeTgYFPOUV1r_sztymh.jpg"
    }
}, {timestamps: true})

function validateUser (data){

    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        address: Joi.string().max(255).optional(),

        phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .message("Phone number must be exactly 10 digits")
        .optional(),

        adhaar: Joi.string()
        .pattern(/^[0-9]{12}$/)
        .message("Aadhaar must be exactly 12 digits")
        .optional(), 

        password: Joi.string().min(4).max(1024).required(),

        image: Joi.string().uri().optional()

    })
    const {error} = schema.validate(data)
    return error?.message
}

const userModel = mongoose.model("User", userSchema)

export default {userModel, validateUser}