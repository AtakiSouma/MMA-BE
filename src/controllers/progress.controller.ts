import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import { sendSuccessResponse } from '~/constants/successResponse'
import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import progressServices from '~/services/progress.services'
import ErrorHandler from '~/utils/errorHandler'
import validateMongoDBId from '~/utils/validateMongoDbID'

const progressController = {
  createProgress: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { courseContentId, courseId, userId } = req.body
    validateMongoDBId(courseContentId, next)
    validateMongoDBId(courseId, next)
    validateMongoDBId(userId, next)
    try {
      const progress = await progressServices.createCourseContentProgress({ courseContentId, courseId, userId }, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, progress)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getAllProgress: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, userId } = req.body
    validateMongoDBId(courseId, next)
    validateMongoDBId(userId, next)
    try {
      const progress = await progressServices.getCourseContentProgress({ courseId, userId }, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, progress)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  })
}
export default progressController
