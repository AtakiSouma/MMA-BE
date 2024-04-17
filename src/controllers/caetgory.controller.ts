import { CatchAsyncError } from '~/middlewares/catchAsyncError.'
import { NextFunction, Request, Response } from 'express'
import { sendSuccessResponse, sendSuccessResponseWithMessage } from '~/constants/successResponse'
import categoryModel from '~/models/categories.model'
import categoryServices from '~/services/category.services'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import ErrorHandler from '~/utils/errorHandler'

const CategoryController = {
  getAllCategory: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryServices.getAllCategory()
      return sendSuccessResponse(res, HttpStatusCodes.OK, categories)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  getOneCategory: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const categories = await categoryServices.getOneCategory(id, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, categories)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  createCategory: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title } = req.body
      const categories = await categoryServices.CreateNewCategory(title, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, categories)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  updateCategory: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { title } = req.body
      const categories = await categoryServices.UpdateCategory(id, title, next)
      return sendSuccessResponse(res, HttpStatusCodes.OK, categories)
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }),
  deleteCategory: CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await categoryServices.DeleteOneCategory(id, next)
      return sendSuccessResponseWithMessage(res, HttpStatusCodes.OK, 'Delete category successfully')
    } catch (error) {
      console.log(error)
      return next(new ErrorHandler('Internal Server Error', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  })
}

export default CategoryController
