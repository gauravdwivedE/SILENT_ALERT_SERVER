import 'dotenv/config'
import app from './app.js';
import connectDB from './config/mongoose.js';

app.listen(process.env.PORT, () => {
    console.log(`Listining on http://localhost:${process.env.PORT}`);
    connectDB()
})
