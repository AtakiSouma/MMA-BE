import express, { Request, Response, Application } from 'express'
import roleController from '~/controllers/role.controller'
import MiddleWareController from '~/middlewares/auth'
const router = express.Router()
router.get('/get-role/:id', MiddleWareController.isAuthenticated, roleController.checkRoles)
router.post('/', MiddleWareController.isAuthenticated, roleController.createNewRole)
router.get('/', MiddleWareController.isAuthenticated, roleController.getAllRoles)
export default router
