import logUtils from '../models/log.model.js'
const { logModel } = logUtils

export const createLog = async (userId, description) => {
   const log = await logModel.create({user: userId, description })
   return log 
}

export const getLogs = async (req, res) => {
    try {
        const logs = await logModel.find().populate({path: 'user', select: 'email name'}).sort({createdAt :-1})
        if (!logs.length) return res.status(404).json({ error: "logs not found" })

        res.status(200).json({
            message: "logs fetched",
            logs
        })
    } catch (err) {
        res.status(500).json(err)
        console.log(err.message);      
    }
}

