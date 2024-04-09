import mongoose from 'mongoose'
import HttpStatusCodes from '../constants/HttpStatusCodes'
import ErrorHandler from './errorHandler'
import { NextFunction } from 'express'

const validateMongoDBId = (id: string, next: NextFunction) => {
  const isValid = mongoose.Types.ObjectId.isValid(id)
  if (!isValid) {
    return next(new ErrorHandler('This is invalid MongoDB ID', HttpStatusCodes.CONFLICT))
  }
}
export default validateMongoDBId
