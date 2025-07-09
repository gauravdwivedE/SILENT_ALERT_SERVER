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


