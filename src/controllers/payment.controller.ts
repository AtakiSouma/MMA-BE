import HttpStatusCodes from '~/constants/HttpStatusCodes'
import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import ErrorHandler from '~/utils/errorHandler'
import { NextFunction, Request, Response } from 'express'
import Stripe from 'stripe'
import {
  sendSuccessResponse,
  sendSuccessResponseString,
  sendSuccessResponseWithMessage
} from '~/constants/successResponse'
import paymentServices from '~/services/payment.services'
const paymentController = {
  IntentOrder: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body /*  */
    try {
      const tripe_secret_key =
        process.env.STRIPE_SECRET_KEY ||
        'sk_test_51P7cvEFCzIlVME0T0H4KhsmaQDgwd9aI7hExN9KmyYj1c2UAAJdY5B57RYvd6CkB14VFMG88t7rNvLT57zfQhrki00YznFBn5r'
      const stripeInstance = new Stripe(
        'sk_test_51P7cvEFCzIlVME0T0H4KhsmaQDgwd9aI7hExN9KmyYj1c2UAAJdY5B57RYvd6CkB14VFMG88t7rNvLT57zfQhrki00YznFBn5r'
      )
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true
        }
      })
      return sendSuccessResponseString(res, HttpStatusCodes.CREATED, paymentIntent.client_secret)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  SendPublicKey: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      return sendSuccessResponseString(
        res,
        HttpStatusCodes.CREATED,
        'pk_test_51P7cvEFCzIlVME0TNnsPXwmr2bqsPeeVLEGHaYbLOD8eNOpHQrZQBbjzjh5v4smwpceeceZtoWUJkDtS5tbPej4K000oJm7MxD'
      )
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  createCoursePaymentUrl: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vnpUrl = await paymentServices.createCoursePaymentUrl(req, res, next)
      if (vnpUrl) {
        return sendSuccessResponse(res, HttpStatusCodes.OK, vnpUrl)
      }
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getReturnPaymentUrl: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await paymentServices.getReturnPaymentUrl(req, res, next)
      if (updatedUser) {
        return sendSuccessResponseWithMessage(res, HttpStatusCodes.OK, 'Save successfully')
      } else {
        return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
      }
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  })
}
export default paymentController
