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
  })
}
export default userController
