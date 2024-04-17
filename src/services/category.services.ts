import { NextFunction } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import categoryModel from '~/models/categories.model'
import GenerateSlug from '~/utils/GenerateSlug'
import ErrorHandler from '~/utils/errorHandler'

class CategoryServices {
  public async CreateNewCategory(title: string, next: NextFunction) {
    const existCategory = await categoryModel.findOne({
      slug: GenerateSlug(title)
    })
    if (existCategory) {
      return next(new ErrorHandler('Category already exists', HttpStatusCodes.CONFLICT))
    }
    const newCategory = await categoryModel.create({
      title: title,
      slug: GenerateSlug(title)
    })
    return newCategory
  }
  public async UpdateCategory(id: string, title: string, next: NextFunction) {
    const existCategory = await categoryModel.findById(id)
    if (!existCategory) {
      return next(new ErrorHandler('Category not found', HttpStatusCodes.NOT_FOUND))
    }
    if (title === existCategory.title) {
      return next(new ErrorHandler('Category not change', HttpStatusCodes.NOT_FOUND))
    }
    existCategory.title = title
    await existCategory.save()
    return existCategory
  }
  public async getAllCategory() {
    const allCategory = await categoryModel.find()
    return allCategory
  }
  public async getOneCategory(id: string, next: NextFunction) {
    const existCategory = await categoryModel.findById(id)
    if (!existCategory) {
      return next(new ErrorHandler('Category not found', HttpStatusCodes.NOT_FOUND))
    }

    return existCategory
  }
  public async DeleteOneCategory(id: string, next: NextFunction) {
    const existCategory = await categoryModel.findById(id)
    if (!existCategory) {
      return next(new ErrorHandler('Category not found', HttpStatusCodes.NOT_FOUND))
    }
    await categoryModel.findByIdAndDelete(id)
  }
}

export default new CategoryServices()
