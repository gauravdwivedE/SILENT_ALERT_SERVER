import mongoose from "mongoose";

const connectDB = async () =>{
    try {
       await mongoose.connect(process.env.MONGO_URI)
       console.log("config/mongoose.js - Connected to database");
       
    } catch (err) {
        console.error('config/mongoose.js - ', err.message || err.response.data)
    }
}

export default connectDB