import { NextFunction } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import roleModel from '~/models/role.model'
import userModel from '~/models/users.model'
import { RoleParams } from '~/types/roles.types'
import { UserParams } from '~/types/user.types'
import GenerateSlug from '~/utils/GenerateSlug'
import ErrorHandler from '~/utils/errorHandler'
import bcryptModule from '../utils/bcryptModule'

class userServices {
  public async createNewUser({ confirmPassword, email, name, password }: UserParams, next: NextFunction) {
    const existUser = await userModel.findOne({ email: email })
    if (existUser) {
      return next(new ErrorHandler('Email is exist', HttpStatusCodes.CONFLICT))
    }
    if (password !== confirmPassword) {
      return next(new ErrorHandler('Password is not matching!', HttpStatusCodes.CONFLICT))
    }
    const pwd = await bcryptModule.getHash(password)
    const newUser = await userModel.create({
      email: email,
      password: pwd,
      name: name,
      avatar: null,
      role: '6615425973f8eddb58cfe6af'
    })
    return newUser
  }
}

export default new userServices()
