import HttpStatusCodes from '~/constants/HttpStatusCodes'
import { sendSuccessResponse } from '~/constants/successResponse'
import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import ErrorHandler from '~/utils/errorHandler'
import validateMongoDBId from '~/utils/validateMongoDbID'
import { NextFunction, Request, Response } from 'express'
import resultServices from '~/services/result.services'
const resultController = {
  createResult: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, userId, image, message } = req.body
    validateMongoDBId(courseId, next)
    validateMongoDBId(userId, next)
    try {
      const result = await resultServices.createResult({ courseId, image, message, userId }, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, result)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getAllResult: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { instructorId, search, page, limit } = req.body
    validateMongoDBId(instructorId, next)
    try {
      const result = await resultServices.getAllResultByInstructors(instructorId, { limit, page, search }, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, result)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  ReplyResult: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { instructorId, resultId, replyMessage } = req.body
    validateMongoDBId(instructorId, next)
    validateMongoDBId(resultId, next)
    try {
      const result = await resultServices.replyMessage(instructorId, resultId, replyMessage, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, result)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  })
}
export default resultController
