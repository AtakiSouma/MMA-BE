import { NextFunction, Request } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import roleModel from '~/models/role.model'
import userModel from '~/models/users.model'
import { RoleParams } from '~/types/roles.types'
import { UserParams, UserUpdateParams, UserUpdatePassword } from '~/types/user.types'
import GenerateSlug from '~/utils/GenerateSlug'
import ErrorHandler from '~/utils/errorHandler'
import bcryptModule from '../utils/bcryptModule'
import { PaginationParams } from '~/types/type'
import jwtServices from './jwt.services'
import cloudinary from 'cloudinary'

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
  public async getOneUser(id: string, next: NextFunction) {
    const user = await userModel.findById(id)
    if (!user) {
      return next(new ErrorHandler('use not found', HttpStatusCodes.NOT_FOUND))
    }
    return user
  }
  public async updateUserInfo({ avatar, name, school }: UserUpdateParams, next: NextFunction, req: Request) {
    const uid = jwtServices.getUidFromCookie(req, next)
    const user = await userModel.findByIdAndDelete(uid)
    if (!user) {
      return next(new ErrorHandler('User not found', HttpStatusCodes.NOT_FOUND))
    }
    if (name && user) {
      user.name = name
    }
    if (school && user) {
      user.school = name
    }
    if (avatar && user) {
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)
        const myCloud = await cloudinary.v2.uploader.upload(
          avatar,
          {
            folder: 'avatars',
            width: 150
          },
          (error) => console.log(error)
        )
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        }
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(
          avatar,
          {
            folder: 'avatars',
            width: 150
          },
          (error) => console.log(error)
        )
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        }
      }
    }
    await user.save()
    return user
  }

  public async updatePassword(
    { newPassword, oldPassword, confirmPassword }: UserUpdatePassword,
    next: NextFunction,
    req: Request
  ) {
    const uid = jwtServices.getUidFromCookie(req, next)
    const user = await userModel.findByIdAndDelete(uid)
    if (!user) {
      return next(new ErrorHandler('User not found', HttpStatusCodes.NOT_FOUND))
    }
    const compare = await bcryptModule.compare(oldPassword, user.password)
    if (!compare) {
      return next(new ErrorHandler('Wrong old password!', HttpStatusCodes.CONFLICT))
    }
    if (newPassword !== confirmPassword) {
      return next(new ErrorHandler('Password is not match!', HttpStatusCodes.CONFLICT))
    }
    const compareConflict = await bcryptModule.compare(newPassword, user.password)
    if (!compareConflict) {
      return next(new ErrorHandler('Password not Change!', HttpStatusCodes.CONFLICT))
    }
    const pwd = await bcryptModule.getHash(newPassword)
    // const userUpdated = await userModel.findByIdAndUpdate(
    //   { _id: user.id },
    //   {
    //     password: newPassword
    //   },
    //   {
    //     new: true
    //   }
    // )
    user.password = pwd
    await user.save()
    return user
  }
}

export default new userServices()
