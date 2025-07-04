import express from 'express'
const app = express()
import limiter from './config/rateLimit.js';
import userRouter from './routes/user.route.js'
import reportRouter from './routes/report.route.js'
import supportRouter from './routes/support.route.js'

import cors from 'cors'
import fileUpload from 'express-fileupload';

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
/////////middleware for body missing error ////////

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)
// app.use(limiter)
app.use("/api/reports", reportRouter)
app.use("/api/users", userRouter)
app.use("/api/supports", supportRouter)

export default app