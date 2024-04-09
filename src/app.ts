import cookieParser from 'cookie-parser'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'
import { ErrorMiddleWare } from './middlewares/error'
import connectDB from './config/connectDB'
import { route } from "./routes";

dotenv.config()
const app = express()
app.use(express.json({ limit: '50mb' }))

app.use(
  cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// route
route(app)
// unknown route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} does not exist`) as any
  err.statusCode = 404
  next(err)
})
// connect db
connectDB()
// middleware
app.use(ErrorMiddleWare)
export default app
