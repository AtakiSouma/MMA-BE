import { tokenGenerate } from '~/types/auth.types'
import { NextFunction, Request } from 'express'
import HttpStatusCodes from '../constants/HttpStatusCodes'
import jwt from 'jsonwebtoken'
import ErrorHandler from '~/utils/errorHandler'

class JwtService {
  public generatePairToken(input: tokenGenerate) {
    const secret_key = process.env.SECRET_KEY || 'my_secret_key'

    const accessToken = jwt.sign(input, secret_key, {
      subject: input.id,
      expiresIn: 60 * 60 * 1000,
      algorithm: 'HS256'
    })
    const refreshToken = jwt.sign(input, secret_key, {
      subject: input.id,
      expiresIn: 60 * 60 * 24 * 7 * 1000,
      algorithm: 'HS256'
    })
    return { accessToken, refreshToken }
  }
  public verifyToken(token: string, next: NextFunction) {
    const secret_key = process.env.SECRET_KEY || 'my_secret_key'

    try {
      const payload = jwt.verify(token, secret_key)
      return payload
    } catch (err) {
      console.log(err)
      return next(new ErrorHandler('You are not authenticated', HttpStatusCodes.UNAUTHORIZED))
    }
  }
  public getUidFromCookie(req: Request, next: NextFunction) {
    const uid = req.header('uid')
    if (!uid) {
      return next(new ErrorHandler('You are not authenticated', HttpStatusCodes.UNAUTHORIZED))
    }
    return uid
  }
}
export default new JwtService()
