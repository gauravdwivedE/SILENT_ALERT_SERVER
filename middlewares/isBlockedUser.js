export const isBlockedUser = (req, res, next) => {
    try {
        let isBlocked = req.user.isBlocked  
        if(isBlocked) return res.status(403).json({message : "User is blocked"})
       
        next()

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

