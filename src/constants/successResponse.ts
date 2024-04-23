import { Response } from 'express'
import HttpStatusCodes from './HttpStatusCodes'

export const sendSuccessResponse = (res: Response, status: HttpStatusCodes, data: object | undefined | void | null | number ) => {
  return res.status(200).json({ success: true, status, data })
}

export const sendSuccessResponseWithMessage = (res: Response, status: HttpStatusCodes, message: string) => {
  return res.status(200).json({ success: true, status, message })
}

export const sendSuccessResponseNotFound = (res: Response, status: HttpStatusCodes, data: object | undefined) => {
  return res.status(200).json({ success: true, status, data })
}

export const sendSuccessResponseWithStatusCode = (res: Response, status: HttpStatusCodes) => {
  return res.status(200).json({ success: true, status })
}
export const sendSuccessResponseBoolean = (res: Response, status: HttpStatusCodes, data: boolean | null) => {
  return res.status(200).json({ success: true, status, data })
}
export const sendSuccessResponseString = (res: Response, status: HttpStatusCodes, data: string | null) => {
  return res.status(200).json({ success: true, status, data })
}
export const sendSuccessResponseCanNull = (res: Response, data: object | null) => {
  return res.status(200).json({ success: true, data })
}

export const sendSuccessResponseOnly = (res: Response) => {
  return res.status(200).json({ success: true })
}
