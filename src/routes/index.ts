import express from 'express'
import roleRouter from './role.route'
import userRouter from './user.route'
import authRouter from './auth.route'
import categoryRouter from './category.route'
import courseRouter from './course.route'
import paymentRouter from './payment.route'
import orderRouter from './order.route'
import progressRouter from './progress.route'
export function route(app: express.Express) {
  app.use('/api/v1/role', roleRouter)
  app.use('/api/v1/user', userRouter)
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/course', courseRouter)
  app.use('/api/v1/category', categoryRouter)
  app.use('/api/v1/payment', paymentRouter)
  app.use('/api/v1/order', orderRouter)
  app.use('/api/v1/progress', progressRouter)
}
