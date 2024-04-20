import HttpStatusCodes from '~/constants/HttpStatusCodes'
import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import ErrorHandler from '~/utils/errorHandler'
import { NextFunction, Request, Response } from 'express'
import Stripe from 'stripe'
import { sendSuccessResponse, sendSuccessResponseString } from '~/constants/successResponse'
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
  })
}
export default paymentController
