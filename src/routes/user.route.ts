import express, { Request, Response, Application } from 'express'
import userController from '~/controllers/user.controller'
import MiddleWareController from '~/middlewares/auth'
const router = express.Router()
router.post('/', userController.register)
router.post('/get-all', MiddleWareController.isAuthenticated, userController.getAllUser)
export default router
