/* eslint-disable prefer-const */
import { NextFunction, Response, Request } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import userModel from '~/models/users.model'
import { UserLoginParams, tokenGenerate } from '~/types/auth.types'
import ErrorHandler from '~/utils/errorHandler'
import jwtServices from './jwt.services'
import bcryptModule from '~/utils/bcryptModule'
import jwt from 'jsonwebtoken'
import { sendSuccessResponse } from '~/constants/successResponse'
import { access } from 'fs'
class authServices {
  // private async verifyGoogle(idToken: string) {
  //   const decodedUser: UserRecord = await verifyToken(idToken)

  //   const user = {
  //     email: decodedUser.email,
  //     name: decodedUser.displayName,
  //     avatar: decodedUser.photoURL
  //   }

  //   return user
  // }
  private getJsonWebToken = async (email: string, id: string) => {
    const payload = {
      email,
      id
    }
    const secret_key = process.env.SECRET_KEY || 'my_secret_key'
    const token = jwt.sign(payload, secret_key, {
      expiresIn: '7d'
    })

    return token
  }
  private generateResponse(input: tokenGenerate, accessToken: string, link: string, next: NextFunction) {
    if (!input.id || !accessToken || !input.email) {
      return next(new ErrorHandler('Invalid data', HttpStatusCodes.CONFLICT))
    }
    return {
      user: input,
      access_token: accessToken,
      link: link
    }
  }
  private setRefreshToken(res: Response, refreshToken: string, uid: string) {
    res.cookie('refresh_token', refreshToken, {
      domain: 'localhost',
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.cookie('uid', uid, {
      domain: 'localhost',
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
  }
  public async newToken(id: string, res: Response, next: NextFunction) {
    const user = await userModel.findById({ _id: id })
    if (!user) {
      return next(new ErrorHandler('You are not authenticated', HttpStatusCodes.UNAUTHORIZED))
    }
    const tokenGenerated: tokenGenerate = {
      id: user.id,
      avatar: user.avatar.public_id,
      name: user.name,
      role: user.role,
      email: user.email,
      photoUrl: user.photoUrl
    }
    let link = ''
    const { accessToken, refreshToken } = jwtServices.generatePairToken(tokenGenerated)
    // administrator
    if (String(user.role) === '66153c6d09d7c5006797e0a3') {
      link = '/dashboard'
    }
    // staff
    if (String(user.role) === '6615426373f8eddb58cfe6b2') {
      link = '/accounts'
    }
    // instructors
    if (String(user.role) === '6615424b73f8eddb58cfe6ac') {
      link = '/dashboard'
    }
    this.setRefreshToken(res, refreshToken, user.id)
    return this.generateResponse(tokenGenerated, accessToken, link, next)
  }

  // login function
  public async login({ email, password }: UserLoginParams, res: Response, next: NextFunction) {
    const user = await userModel.findOne({
      email: email
    })
    if (!user || !user.password) {
      return next(new ErrorHandler('User is not registered', HttpStatusCodes.UNAUTHORIZED))
    }
    if (user.status === false) {
      return next(new ErrorHandler('User is forbidden', HttpStatusCodes.FORBIDDEN))
    }
    if (user.isBlocked === true) {
      return next(new ErrorHandler('User is Blocked', HttpStatusCodes.FORBIDDEN))
    }
    const compare = await bcryptModule.compare(password, user.password)
    if (compare === false) {
      return next(new ErrorHandler('Password is not correctz', HttpStatusCodes.FORBIDDEN))
    }
    const tokenGenerated: tokenGenerate = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl || 'https://i.pinimg.com/originals/67/41/93/6741938a381b6ba51fd7d4ed10c1bbf1.jpg',
      avatar:
        user.avatar.url ||
        'https://64.media.tumblr.com/c8c06b57c16fc199ce6c791621e1d43d/8369c5657db09dce-8c/s1280x1920/d3b0217fb96b061f652724267adb94c55f42a46a.png'
    }
    const { accessToken, refreshToken } = jwtServices.generatePairToken(tokenGenerated)
    let link = ''
    if (String(user.role) === '66153c6d09d7c5006797e0a3') {
      link = '/dashboard'
    }
    // staff
    if (String(user.role) === '6615426373f8eddb58cfe6b2') {
      link = '/accounts'
    }
    // instructors
    if (String(user.role) === '6615424b73f8eddb58cfe6ac') {
      link = '/dashboard'
    }
    this.setRefreshToken(res, refreshToken, user.id)
    return this.generateResponse(tokenGenerated, accessToken, link, next)
  }
  public async logout(res: Response, next: NextFunction) {
    try {
      res.clearCookie('refresh_token')
      return 'Logged out successfully'
    } catch (error) {
      return next(new ErrorHandler('Can not logout', HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
  }
  public async handleLoginWithGoogleWithMobile(req: Request, next: NextFunction) {
    const userInfo = req.body
    let user: any
    const existingUser = await userModel.findOne({ email: userInfo.email })
    if (existingUser) {
      await userModel.findByIdAndUpdate(existingUser.id, {
        updateAtLogin: Date.now()
      })
      user = { ...existingUser }
      user.accesstoken = await this.getJsonWebToken(userInfo.email, userInfo.id)
      if (user) {
        const data = {
          accesstoken: user.accesstoken,
          id: existingUser._id,
          email: existingUser.email,
          photo: existingUser.photoUrl,
          name: existingUser.name
        }
        return data
      } else {
        return next(new ErrorHandler('Error login', HttpStatusCodes.NOT_FOUND))
      }
    } else {
      const newUser = new userModel({
        email: userInfo.email,
        name: userInfo.name,
        photoUrl: userInfo.photo,
        role: '6615425973f8eddb58cfe6af',
        ...userInfo
      })
      await newUser.save()
      user = { ...newUser }
      user.accesstoken = await this.getJsonWebToken(userInfo.email, newUser.id)
      if (user) {
        const data = {
          accesstoken: user.accesstoken,
          id: user._id,
          email: user.email,
          photo: user.photoUrl,
          name: user.name
        }
        return data
      } else {
        return next(new ErrorHandler('Error login', HttpStatusCodes.NOT_FOUND))
      }
    }
  }
  public async loginWithGoogle(email: string, name: string, photo: string, next: NextFunction, res: Response) {
    const user = await userModel.findOne({ email: email })
    if (user) {
      await userModel.updateOne(
        {
          updateAtLogin: Date.now()
        },
        { new: true }
      )
      const tokenGenerated: tokenGenerate = {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl || 'https://i.pinimg.com/originals/67/41/93/6741938a381b6ba51fd7d4ed10c1bbf1.jpg',
        avatar:
          user.avatar.url ||
          'https://64.media.tumblr.com/c8c06b57c16fc199ce6c791621e1d43d/8369c5657db09dce-8c/s1280x1920/d3b0217fb96b061f652724267adb94c55f42a46a.png'
      }
      let link = ''
      if (String(user.role) === '66153c6d09d7c5006797e0a3') {
        link = '/dashboard'
      }
      // staff
      if (String(user.role) === '6615426373f8eddb58cfe6b2') {
        link = '/accounts'
      }
      // instructors
      if (String(user.role) === '6615424b73f8eddb58cfe6ac') {
        link = '/dashboard'
      }
      const { accessToken, refreshToken } = jwtServices.generatePairToken(tokenGenerated)
      this.setRefreshToken(res, refreshToken, user._id)
      return this.generateResponse(tokenGenerated, accessToken, link, next)
    } else {
      // create new user with this email
      const newUser = new userModel({
        name: name,
        email: email,
        photoUrl: photo,
        role: '66153c6d09d7c5006797e0a3'
      })
      await newUser.save()
      const tokenGenerated: tokenGenerate = {
        id: newUser.id,
        role: newUser.role,
        email: newUser.email,
        name: newUser.name,
        photoUrl: newUser.photoUrl || 'https://i.pinimg.com/originals/67/41/93/6741938a381b6ba51fd7d4ed10c1bbf1.jpg',
        avatar:
          newUser.avatar.url ||
          'https://64.media.tumblr.com/c8c06b57c16fc199ce6c791621e1d43d/8369c5657db09dce-8c/s1280x1920/d3b0217fb96b061f652724267adb94c55f42a46a.png'
      }
      let link = ''
      if (String(newUser.role) === '66153c6d09d7c5006797e0a3') {
        link = '/dashboard'
      }
      // staff
      if (String(newUser.role) === '6615426373f8eddb58cfe6b2') {
        link = '/accounts'
      }
      // instructors
      if (String(newUser.role) === '6615424b73f8eddb58cfe6ac') {
        link = '/dashboard'
      }
      const { accessToken, refreshToken } = jwtServices.generatePairToken(tokenGenerated)
      this.setRefreshToken(res, refreshToken, newUser._id)
      return this.generateResponse(tokenGenerated, accessToken, link, next)
    }
  }
}

export default new authServices()
