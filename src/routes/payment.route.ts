import express, { Request, Response, Application } from 'express'
import paymentController from '~/controllers/payment.controller'
import roleController from '~/controllers/role.controller'
import MiddleWareController from '~/middlewares/auth'
const router = express.Router()
router.post('/intents', MiddleWareController.isAuthenticated, paymentController.IntentOrder)
router.get('/publish_key', MiddleWareController.isAuthenticated, paymentController.SendPublicKey)
export default router
