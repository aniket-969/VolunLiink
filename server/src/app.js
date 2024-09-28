import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

const app = express()

const limiter = rateLimit({
    windowMs:5*60*1000,
    max:100, 
    handler: (req, res) => {
        res.status(429).json({
            message: "Too many requests, please try again later."
        });
    }
})

app.use(limiter)

app.use(cors({ 
    origin:process.env.CORS_ORIGIN,
    credentials:true 
}))

app.use(express.json({limit:"16kb"}))
 
app.use(express.urlencoded({extended:true ,limit:"16kb"}))
  
app.use(express.static("public"))

app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import volunteerRouter from './routes/volunteerPost.routes.js'

app.use("/api/v1/users",userRouter)
app.use("/api/v1/volunteers",volunteerRouter)

export {app}