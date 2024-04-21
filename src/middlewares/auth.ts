import { NextFunction, Request, Response } from 'express'
import { CatchAsyncError } from './catchAsyncError.'
import ErrorHandler from '~/utils/errorHandler'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import jwt, { JwtPayload } from 'jsonwebtoken'
import jwtServices from '~/services/jwt.services'

const MiddleWareController = {
  isAuthenticated: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization')
      if (!token) {
        return next(new ErrorHandler('Please login to access this resources', HttpStatusCodes.UNAUTHORIZED))
      }
      const accessToken = token.split(' ')[1]
      const payload = jwtServices.verifyToken(accessToken, next) as JwtPayload
      if (!payload) {
        return next(new ErrorHandler('You are not authenticated', HttpStatusCodes.UNAUTHORIZED))
      }
      res.locals.payload = payload
      next()
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  requestReFreshToken: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refresh_token
      if (!token) {
        return next(new ErrorHandler('You are not authenticated', HttpStatusCodes.UNAUTHORIZED))
      }
      const payload = jwtServices.verifyToken(token, next) as JwtPayload
      if (!payload) {
        return next(new ErrorHandler('You are not authenticated', HttpStatusCodes.UNAUTHORIZED))
      }
      res.locals.payload = payload
      next()
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  })
}
export default MiddleWareController
