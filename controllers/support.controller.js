import supportUtils from '../models/support.model.js'
const { supportModel, validateSupport } = supportUtils

export const createSupport = async (req, res) => {
    try {
        const userId = req.user._id
        const { message } = req.body
        const status = 'pending'

        const error = validateSupport({ user: userId, message, status })
        if (error) return res.status(400).json({ error })

        const support = await supportModel.create({ user: userId, message, status })

        res.status(201).json({
            message: "support created",
            support
        })
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const getAllSupports = async (req, res) => {
    try {
        const support = await supportModel.find().populate({path: "user", select: "-password"}).sort({createdAt : -1})
        res.status(200).json({
            message: "supports fetched",
            support
        })
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const getUsersSupport = async (req, res) => {
    try {
        const user = req.user.id
        const support = await supportModel.findOne({user,  $or: [{ status: 'pending' }, { status: 'rejected' }] }).sort({createdAt: -1})
        if(!support) return res.status(404).json({error: "support not found"})

        res.status(200).json({
            message: "support fetched",
            support
        })
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const updateSupportStatus = async (req, res) => {
    try {
        const supportId = req.params.id
        const {status} = req.body
        if(!status){ return res.status(400).json({error: "enter status"})}

        const support = await supportModel.findByIdAndUpdate(supportId, {status}, {runValidators: true, new:true})
        if(!support) return res.status(404).json({error: "support not found"})

        res.status(200).json({
            message: "support status updated",
        })
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}