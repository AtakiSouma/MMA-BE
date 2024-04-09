import { NextFunction } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import roleModel from '~/models/role.model'
import { RoleParams } from '~/types/roles.types'
import GenerateSlug from '~/utils/GenerateSlug'
import ErrorHandler from '~/utils/errorHandler'

class authServices {
  public async createRole({ title }: RoleParams, next: NextFunction) {
    const existingRole = await roleModel.findOne({ title: title })
    if (existingRole) {
      return next(new ErrorHandler('Role is exist', HttpStatusCodes.CONFLICT))
    }
    const newRole = await roleModel.create({
      title: title,
      slug: GenerateSlug(title)
    })
    return newRole
  }
  public async getAllRole() {
    const roles = await roleModel.find({}, { _id: 1, title: 1, slug: 1 })
    return roles
  }
}

export default new authServices()
