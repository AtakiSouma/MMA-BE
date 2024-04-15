import { NextFunction } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import roleModel from '~/models/role.model'
import userModel from '~/models/users.model'
import { RoleParams } from '~/types/roles.types'
import { UserParams } from '~/types/user.types'
import GenerateSlug from '~/utils/GenerateSlug'
import ErrorHandler from '~/utils/errorHandler'
import bcryptModule from '../utils/bcryptModule'
import { PaginationParams } from '~/types/type'

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
      avatar:
        'https://w7.pngwing.com/pngs/633/343/png-transparent-visual-novel-user-avatar-ren-py-dating-sim-yui-hirasawa-thumbnail.png',
      photoUrl:
        'https://w7.pngwing.com/pngs/633/343/png-transparent-visual-novel-user-avatar-ren-py-dating-sim-yui-hirasawa-thumbnail.png',
      role: '6615425973f8eddb58cfe6af'
    })
    return newUser
  }
  public async getAllUsers({ page, search, limit }: PaginationParams) {
    const query = {
      name: { $regex: new RegExp(search, 'i') }
    }
    const userList = await userModel
      .find(query)
      .populate({
        path: 'role',
        select: '_id slug'
      })
      .skip((page - 1) * limit)
      .limit(limit)

    const totalCount = await userModel.countDocuments(query)

    const data = userList.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      photoUrl: user.photoUrl
    }))
    const response = {
      data,
      totalCount,
      pageCount: Math.ceil(totalCount / limit)
    }
    return response
  }
}

export default new userServices()
