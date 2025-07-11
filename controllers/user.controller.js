import userUtils from '../models/user.model.js';
import { createLog } from '../controllers/log.controller.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import axios from 'axios'

const { userModel, validateUser } = userUtils;

export const signup = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Request body is missing' });
        }
        const {name , email, password } = req.body
        
        const error = validateUser({name, email, password})
        if(error) return res.status(400).json(error)

        let user = await userModel.findOne({email})
        if(user) return res.status(409).json({
            error: 'user already exists',
            field: 'email'
        })
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

         user = await userModel.create({name, email, password: hashedPassword})
         const { password: _, ...userWithoutPassword } = user.toObject()

         const token = jwt.sign(
            userWithoutPassword,
            process.env.JWT_SECRET,
            {expiresIn: '2d'}
        ) 

        res.status(201).json({
            message: "user created successfully",
            token,
            user: userWithoutPassword
        })
    } 
    catch (err) {
        res.status(500).json(err) 
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        const error = validateUser({name:"test", email, password})
        if(error) return res.status(400).json(error)

        const user = await userModel.findOne({email})
        if(!user) return res.status(401).send("invalid email or password")

        if(user.type == 'google') return res.status(401).send("invalid email or password")

        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid) return  res.status(401).send("invalid email or password")
        
        const { password:_, ...userWithoutPassword } = user.toObject()
        const token = jwt.sign(
            userWithoutPassword,
            process.env.JWT_SECRET,
            {expiresIn: '2d'}
        ) 
        const allowedRoles = ['admin', 'inspector', 'superAdmin']
        if(allowedRoles.includes(user.role)){
        let logDescription = 'Logged in'
        createLog(userWithoutPassword._id, logDescription)
        }
        res.status(200).json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
         });
    } 
    catch (err) {
        res.status(500).json(err)
    }
}

export const oAuthLogin = async (req, res) => {
    try {
        
        const {accessToken} = req.body
        if(!accessToken) return res.status(400).json({error: "refresh token is required"}) 
        
        const {data} = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        
        const {name, email, picture: image} = data
        
        const error = validateUser({name, email, image, password:"test1234"})
        if(error) res.status(400).json(error)

        let user = await userModel.findOne({email})

        if(!user){
            user = await userModel.create({name, email, image, type:'google'})
        }
        const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {expiresIn: '2d'})

        let logDescription = 'Logged in'
        createLog(user._id, logDescription)

        res.status(200).json({
            message: "login successful", 
            token,
            user
        })

    } catch (err) {
        res.status(500).json(err)
    }
} 

export const getLoginUser = async (req, res) => {
    try {
        
        const {_id} = req.user
        
        let user = await userModel.findById(_id)
        if(!user) {
            return res.status(401).send("unauthorized")
        }
    
        const { password:_, ...userWithoutPassword } = user.toObject()

        res.status(200).json({
            user: userWithoutPassword
         });
    } 
    catch (err) {
        res.status(500).json(err)
    }
}

export const updateProfile = async (req, res) => {
    try {
         const {name, phone} = req.body
         
         const {_id} = req.user
         const phoneRegex = /^\+?1?\s*(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/;        
            
         if(!name){
             return res.status(400).send("name is required")
         }
         if(phone){
            if (!phoneRegex.test(phone)) {
                return res.status(400).send("invalid phone number");
            }
         }
         
         let user = await userModel.findByIdAndUpdate(_id, {name, phone}, {new: true})
         
         if(!user) {
             return res.status(404).send("user not found")
         }
    
        const { password:_, ...userWithoutPassword } = user.toObject()

         res.status(200).json({
            user: userWithoutPassword
        });
    } 
    catch (err) {
        res.status(500).json(err)
    }
}

export const updateUserStatus = async (req, res) => {
    try {
         const loggedInUserId = req.user._id
         const userId = req.params.id 
         const {status} = req.body
            
         if(status == undefined) return res.status(400).send("status is required")
        
         let user = await userModel.findByIdAndUpdate(userId, {isBlocked: status}, {new: true})
         
         if(!user)  return res.status(404).send("user not found")
         
        let logDescription = `${status ? 'Blocked': 'Unblocked'} the user, id: ${user._id}, email ${user.email} `
        createLog(loggedInUserId, logDescription)

         res.status(200).json({
            message:"user status updated",
            isBlocked: user.isBlocked
        });
    } 
    catch (err) {
        res.status(500).json(err)
    }
}

export const getUserById = async (req, res) => {
    try {
        const {_id} = req.user
         const userId = req.params.id 
         if(_id == userId) return res.status(400).send("try with another user id") 
            
         const user = await userModel.findById(userId)
         if(!user) return res.status(404).send("user not found")
         
         const {password:_, ...userWithoutPassword} = user.toObject()

         res.status(200).json({
           user: userWithoutPassword
        });
    } 
    catch (err) {
        res.status(500).json(err)
        console.log(err.message)
    }
}

export const updateUserRole = async (req, res) => {
    try {
         const loggedInUserId = req.user._id
         const userId = req.params.id 
         const {role} = req.body

         const user = await userModel.findByIdAndUpdate(userId, {role}, {new: true, runValidators: true})
         if(!user) return res.status(404).send("user not found")
         
        let logDescription = ` Updated the user role  as ${role}, id: ${user._id}, email ${user.email} `
        createLog(loggedInUserId, logDescription)

         const {password:_, ...userWithoutPassword} = user.toObject()

         res.status(200).json({
           message: "user role updated",
           user: userWithoutPassword
        });
    } 
    catch (err) {
        res.status(500).json(err)
    }
}

export const usersSummary = async (req, res) => {
    try {
         
        const counts = await userModel.aggregate([
            
            {
              $group: {
                _id: '$role',
                count: { $sum: 1 }
              }
            }
        ]);
        
        const blockedUserCount = await userModel.countDocuments({isBlocked: true})

        const summary = {
            totalUsers:0,
            blockedUser: blockedUserCount,
            superAdmin:0,
            user:0,
            admin:0,
            inspector:0,
          };
                    
         counts.forEach(item => {
            summary.totalUsers += item.count
            summary[`${item._id}`] = item.count
         });

         res.status(200).json({
           summary
        });
    } 
    catch (err) {
        res.status(500).json(err)
        console.log(err);
        
    }
}
