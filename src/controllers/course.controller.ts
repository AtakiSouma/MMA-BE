import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import { sendSuccessResponse } from '~/constants/successResponse'

import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import courseServices from '~/services/course.services'
import ErrorHandler from '~/utils/errorHandler'

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
  })
}

export default courseController
