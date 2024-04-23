import express, { Request, Response, Application } from 'express'
import progressController from '~/controllers/progress.controller'
import MiddleWareController from '~/middlewares/auth'
const router = express.Router()
router.post('/', MiddleWareController.isAuthenticated, progressController.createProgress)
router.post('/get-progress', MiddleWareController.isAuthenticated, progressController.getAllProgress)

export default router
