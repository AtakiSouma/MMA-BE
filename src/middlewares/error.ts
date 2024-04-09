import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import ErrorHandler from '~/utils/errorHandler'

export const ErrorMiddleWare = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error'
  // wrong mongodb
  if (err.name === 'CastError') {
    const message = `Resource not found . Invalid : ${err.path}`
    err = new ErrorHandler(message, HttpStatusCodes.BAD_REQUEST)
  }
  // duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} centered`
    err = new ErrorHandler(message, HttpStatusCodes.BAD_REQUEST)
  }
  // wrong jwt error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Json Web Token is invalid  try again',
      err = new ErrorHandler(message, HttpStatusCodes.BAD_REQUEST)
  }
  if (err.name === 'TokenExpiredError') {
    const message = 'Json Web Token is expired  try again'
    err = new ErrorHandler(message, HttpStatusCodes.BAD_REQUEST)
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message
  })
}
