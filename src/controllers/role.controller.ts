import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '~/utils/errorHandler'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import roleServices from '~/services/role.services'
import { sendSuccessResponse } from '~/constants/successResponse'

const roleController = {
  // function : create new Role
  // POST api/v1/role/
  createNewRole: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body
    try {
      if (!title) {
        return next(new ErrorHandler('Invalid Input', HttpStatusCodes.NOT_FOUND))
      }
      const newRole = await roleServices.createRole({ title }, next)
      return sendSuccessResponse(res, HttpStatusCodes.CREATED, newRole)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  // function : get all roles
  // GET api/v1/role/
  getAllRoles: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await roleServices.getAllRole()
      return sendSuccessResponse(res, HttpStatusCodes.OK, roles)
    } catch (error) {
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  // function : check role
  checkRoles: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await roleServices.checkRole(req, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, roles)
    } catch (error: any) {
      return next(new ErrorHandler('Internal Server Error', error))
    }
  })
}
export default roleController
