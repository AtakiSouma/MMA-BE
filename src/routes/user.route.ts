import express, { Request, Response, Application } from 'express'
import userController from '~/controllers/user.controller'
import MiddleWareController from '~/middlewares/auth'
const router = express.Router()
router.post('/', userController.register)
router.put('/user-info', MiddleWareController.isAuthenticated, userController.updateUserInfo)
router.post('/get-all', MiddleWareController.isAuthenticated, userController.getAllUser)
router.put('/password', MiddleWareController.isAuthenticated, userController.updatePassword)

export default router
