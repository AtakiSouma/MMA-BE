import express from 'express'
import roleRouter from './role.route'
import userRouter from './user.route'
import authRouter from './auth.route'
import courseRouter from './course.route'
export function route(app: express.Express) {
  app.use('/api/v1/role', roleRouter)
  app.use('/api/v1/user', userRouter)
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/course', courseRouter)
}
