import  jwt  from 'jsonwebtoken';
export const authenticate = (req, res, next) => {
    try {
        
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token) return res.status(401).json({error : "token is missing"})
                       
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        
         next()

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

export const isAdmin = (req, res, next) => {
    try {
        const role = req.user.role
        if(role !== 'admin') return res.status(403).json({error : "you do not have permission to access this resource"})

        next()

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}