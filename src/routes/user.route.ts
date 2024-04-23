import express, { Request, Response, Application } from 'express'
import userController from '~/controllers/user.controller'
import MiddleWareController from '~/middlewares/auth'
const router = express.Router()
router.post('/', userController.register)
router.put('/user-info', MiddleWareController.isAuthenticated, userController.updateUserInfo)
router.post('/get-all', MiddleWareController.isAuthenticated, userController.getAllUser)
router.put('/password', MiddleWareController.isAuthenticated, userController.updatePassword)
router.get('/instructor/:id', MiddleWareController.isAuthenticated, userController.getInstructorInformationById)
router.get('/dashboard/instructorsCount', MiddleWareController.isAuthenticated, userController.getInstructorsCount)
router.get('/dashboard/customersCount', MiddleWareController.isAuthenticated, userController.getCustomersCount)
router.put('/instructor/postCerts/:id', MiddleWareController.isAuthenticated, userController.postInstructorCerts)
router.put('/instructor/accept/:id', MiddleWareController.isAuthenticated, userController.acceptInstructor)
router.put('/instructor/reject/:id', MiddleWareController.isAuthenticated, userController.rejectInstructor)
export default router
