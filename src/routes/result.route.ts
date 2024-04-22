import express, { Request, Response, Application } from 'express'
import paymentController from '~/controllers/payment.controller'
import resultController from '~/controllers/result.controller'
import roleController from '~/controllers/role.controller'
import MiddleWareController from '~/middlewares/auth'
const router = express.Router()
router.post('/', MiddleWareController.isAuthenticated, resultController.createResult)
router.post('/get-all', MiddleWareController.isAuthenticated, resultController.getAllResult)
router.put('/reply', MiddleWareController.isAuthenticated, resultController.ReplyResult)
export default router
