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
  })
}

export default courseController
