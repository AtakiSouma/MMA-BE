import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import {
  sendSuccessResponse,
  sendSuccessResponseString,
  sendSuccessResponseWithMessage
} from '~/constants/successResponse'

import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import courseServices from '~/services/course.services'
import ErrorHandler from '~/utils/errorHandler'
import validateMongoDBId from '~/utils/validateMongoDbID'

const courseController = {
  createCourse: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body
      const newCourse = await courseServices.createCourse(data)
      return sendSuccessResponse(res, HttpStatusCodes.CREATED, newCourse)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  updateCourse: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = req.body
      const newCourse = await courseServices.updateCourseInfo(data, id)
      return sendSuccessResponse(res, HttpStatusCodes.CREATED, newCourse)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  generateNewVideoUrl: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body
      const newCourse = await courseServices.generateNewVideoUrl(videoId)
      return sendSuccessResponse(res, HttpStatusCodes.CREATED, newCourse)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getAllCourse: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page, limit } = req.body
      const allCourse = await courseServices.getAllCourse({ page, limit, search })
      return sendSuccessResponse(res, HttpStatusCodes.OK, allCourse)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getOneCourse: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params
      const course = await courseServices.getOneCourse(courseId, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, course)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getAllCourseByIntructors: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page, limit, instructorId } = req.body
      const course = await courseServices.getAllCourseByIntructors(instructorId, { search, page, limit })
      return sendSuccessResponse(res, HttpStatusCodes.OK, course)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  ChangeStatusToActiveCourseByAdmin: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params
      await courseServices.ChangeStatusToActiveCourseByAdmin(courseId, next)
      return sendSuccessResponseWithMessage(res, HttpStatusCodes.OK, 'Change status to active successfully')
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  ToggleBlockCourse: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params
      await courseServices.ToggleBlockCourse(courseId, next)
      return sendSuccessResponseWithMessage(res, HttpStatusCodes.OK, 'Change status to active successfully')
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getAllCourseInMobile: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await courseServices.getAllCourseInMobile()
      return sendSuccessResponse(res, HttpStatusCodes.OK, course)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getCoursesCount: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coursesCount = await courseServices.getCoursesCount()
      return sendSuccessResponse(res, HttpStatusCodes.OK, coursesCount)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getAllCourseBoughtByUser: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    try {
      const course = await courseServices.getCourseAreStudyingByUser(userId, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, course)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  AddANewQuestion: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { contentId, courseId, question, userId } = req.body
    validateMongoDBId(contentId, next)
    validateMongoDBId(contentId, next)
    validateMongoDBId(userId, next)
    try {
      const course = await courseServices.addQuestion({ contentId, courseId, question, userId }, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, course)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  NewAnswer: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { answer, contentId, courseId, questionId, userId } = req.body
    validateMongoDBId(contentId, next)
    validateMongoDBId(contentId, next)
    validateMongoDBId(userId, next)
    validateMongoDBId(questionId, next)
    try {
      const course = await courseServices.addAnswer({ contentId, courseId, questionId, answer, userId }, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, course)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  })
}

export default courseController
