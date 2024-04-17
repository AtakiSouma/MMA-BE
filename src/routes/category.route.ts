import express, { Request, Response, Application } from 'express'
import CategoryController from '~/controllers/caetgory.controller'
import courseController from '~/controllers/course.controller'
import MiddleWareController from '~/middlewares/auth'
import courseServices from '~/services/course.services'
const router = express.Router()
router.get('/', MiddleWareController.isAuthenticated, CategoryController.getAllCategory)
router.get('/:id', MiddleWareController.isAuthenticated, CategoryController.getOneCategory)
router.post('/', MiddleWareController.isAuthenticated, CategoryController.createCategory)
router.put('/:id', MiddleWareController.isAuthenticated, CategoryController.updateCategory)
router.delete('/:id', MiddleWareController.isAuthenticated, CategoryController.deleteCategory)

export default router
