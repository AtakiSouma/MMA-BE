import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '~/utils/errorHandler'
import { Http2ServerRequest } from 'http2'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import authServices from '~/services/auth.services'
import { sendSuccessResponse } from '~/constants/successResponse'

const authController = {
  resetToken: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = res.locals.payload
      console.log(payload)
      const user = await authServices.newToken(payload.id, res, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, user)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  login: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.NOT_FOUND))
      }
      const user = await authServices.login({ email, password }, res, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, user)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),

  loginWithGoogleMobile: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authServices.handleLoginWithGoogleWithMobile(req, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, user)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),

  loginWithGoogleWebDashboard: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, photo } = req.body
      const user = await authServices.loginWithGoogle(email, name, photo, next, res)
      console.log(user)
      return sendSuccessResponse(res, HttpStatusCodes.OK, user)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  })
}
export default authController
