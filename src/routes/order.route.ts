import express, { Request, Response, Application } from 'express'
import orderController from '~/controllers/order.controller'
import MiddleWareController from '~/middlewares/auth'
const router = express.Router()
router.post('/create', MiddleWareController.isAuthenticated, orderController.createOrder)
router.post('/get-all', MiddleWareController.isAuthenticated, orderController.getAllOrder)

export default router
