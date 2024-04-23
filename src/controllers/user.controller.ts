import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import ErrorHandler from '~/utils/errorHandler'
import userServices from '~/services/user.services'
import { sendSuccessResponse } from '~/constants/successResponse'

const userController = {
  register: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, confirmPassword } = req.body
      if (!name || !password || !confirmPassword || !email) {
        return next(new ErrorHandler('Invalid Input', HttpStatusCodes.NOT_FOUND))
      }
      const user = await userServices.createNewUser(
        {
          confirmPassword,
          email,
          name,
          password
        },
        next
      )
      if (user) sendSuccessResponse(res, HttpStatusCodes.CREATED, user)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getAllUser: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page, limit } = req.body
      const user = await userServices.getAllUsers({ limit, search, page })
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  updateUserInfo: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar, name, school } = req.body
      const user = await userServices.updateUserInfo({ avatar, name, school }, next, req)
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  updatePassword: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newPassword, oldPassword, confirmPassword } = req.body
      const user = await userServices.updatePassword({ confirmPassword, newPassword, oldPassword }, next, req)
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getInstructorInformationById: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const user = await userServices.getInstructorInformationById(id, next)
      if (user) sendSuccessResponse(res, HttpStatusCodes.OK, user)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getInstructorsCount: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const instructorsCount = await userServices.getUsersCount('Instructor', next)
      if (instructorsCount) sendSuccessResponse(res, HttpStatusCodes.OK, instructorsCount)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getCustomersCount: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customersCount = await userServices.getUsersCount('Customer', next)
      if (customersCount) sendSuccessResponse(res, HttpStatusCodes.OK, customersCount)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  postInstructorCerts: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listCerts } = req.body
      const { id } = req.params
      if (!listCerts || !id) {
        return next(new ErrorHandler('Invalid Input', HttpStatusCodes.NOT_FOUND))
      }
      const updatedUser = await userServices.postInstructorCerts(id, listCerts, next)
      return sendSuccessResponse(res, HttpStatusCodes.CREATED, updatedUser)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  acceptInstructor: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const updatedUser = await userServices.acceptInstructor(id, next)
      return sendSuccessResponse(res, HttpStatusCodes.CREATED, updatedUser)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  rejectInstructor: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const updatedUser = await userServices.rejectInstructor(id, next)
      return sendSuccessResponse(res, HttpStatusCodes.CREATED, updatedUser)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  })
}
export default userController
