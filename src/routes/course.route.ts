import express, { Request, Response, Application } from 'express'
import courseController from '~/controllers/course.controller'
import MiddleWareController from '~/middlewares/auth'
import courseServices from '~/services/course.services'
const router = express.Router()
router.post('/', MiddleWareController.isAuthenticated, courseController.createCourse)
router.put('/:id', MiddleWareController.isAuthenticated, courseController.updateCourse)
export default router
