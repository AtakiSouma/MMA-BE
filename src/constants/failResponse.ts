import { Response } from 'express'
import HttpStatusCodes from './HttpStatusCodes'

export const unAuthorizedResponse = (res: Response, status: HttpStatusCodes, error: object | undefined) => {
  return res.status(401).json({ success: false, status, error })
}

export const failResponseWithMessage = (res: Response, status: HttpStatusCodes, message: string) => {
  return res.status(status).json({ success: false, status, message })
}

export const failResponse = (res: Response, status: HttpStatusCodes, message: string) => {
  return res.status(status).json({ success: false, status, message })
}
