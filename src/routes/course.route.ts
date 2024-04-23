import express, { Request, Response, Application } from 'express'
import { copyFile } from 'fs'
import courseController from '~/controllers/course.controller'
import MiddleWareController from '~/middlewares/auth'
import courseServices from '~/services/course.services'
const router = express.Router()
router.post('/get-all', courseController.getAllCourse)
router.post('/generate-url', courseController.generateNewVideoUrl)
router.post('/', MiddleWareController.isAuthenticated, courseController.createCourse)
router.put('/:id', MiddleWareController.isAuthenticated, courseController.updateCourse)
router.get('/course-detail/:courseId', MiddleWareController.isAuthenticated, courseController.getOneCourse)
router.post('/get-all/instructor', MiddleWareController.isAuthenticated, courseController.getAllCourseByIntructors)
router.put('/update-statuss', MiddleWareController.isAuthenticated, courseController.ChangeStatusToActiveCourseByAdmin)
router.put('/toggle-block', MiddleWareController.isAuthenticated, courseController.ToggleBlockCourse)
router.get('/get-all-courses', MiddleWareController.isAuthenticated, courseController.getAllCourseInMobile)
router.get('/getCoursesCount', MiddleWareController.isAuthenticated, courseController.getCoursesCount)
router.get('/get-all/bought/:userId', MiddleWareController.isAuthenticated, courseController.getAllCourseBoughtByUser)
router.post('/add-question', MiddleWareController.isAuthenticated, courseController.AddANewQuestion)
router.post("/add-answer" , MiddleWareController.isAuthenticated , courseController.NewAnswer)
export default router
