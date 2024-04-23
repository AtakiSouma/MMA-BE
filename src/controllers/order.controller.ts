import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import { sendSuccessResponse } from '~/constants/successResponse'
import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import orderServices from '~/services/order.services'
import ErrorHandler from '~/utils/errorHandler'

const orderController = {
  createOrder: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payment_info, courseId, userId } = req.body
      const order = await orderServices.createOrder(next, userId, courseId, payment_info)
      return sendSuccessResponse(res, HttpStatusCodes.OK, order)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getAllOrder: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page, limit } = req.body
      const orderList = await orderServices.getAllOrder({ search, page, limit })
      return sendSuccessResponse(res, HttpStatusCodes.OK, orderList)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getAllOrderByUser: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params
      const orderList = await orderServices.getAllOrderByUserKid(userId, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, orderList)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  })
}
export default orderController
