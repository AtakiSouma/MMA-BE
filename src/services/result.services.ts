import { NextFunction } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import CourseModel from '~/models/courses.model'
import resultModel, { IResult } from '~/models/result.model'
import userModel from '~/models/users.model'
import ErrorHandler from '~/utils/errorHandler'
import cloudinary from 'cloudinary'
import { IResultType } from '~/types/result.types'
import { PaginationParams } from '~/types/type'
import ejs from 'ejs'
import path from 'path'
import { sendEmail } from '~/utils/sendMail'
import { messaging } from 'firebase-admin'
class resultServices {
  public async createResult({ userId, courseId, message, image }: IResultType, next: NextFunction) {
    const course = await CourseModel.findById({ _id: courseId })

    if (!course) {
      return next(new ErrorHandler('Course not found', HttpStatusCodes.NOT_FOUND))
    }
    const user = await userModel.findById({ _id: userId })
    if (!user) {
      return next(new ErrorHandler('User not found', HttpStatusCodes.NOT_FOUND))
    }
    if (image) {
      const myCloud = await cloudinary.v2.uploader.upload(
        image,
        {
          folder: 'results'
        },
        (error) => console.log(error)
      )
      image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    }
    const result = await resultModel.create({
      courseId: courseId,
      userId: userId,
      image: image,
      message: message
    })
    return result
  }
  public async getAllResultByInstructors(
    instructorId: string,
    { limit, page, search }: PaginationParams,
    next: NextFunction
  ) {
    const instructors = await userModel.findOne({ _id: instructorId, role: '6615424b73f8eddb58cfe6ac' })
    if (!instructors) {
      return next(new ErrorHandler('not found', HttpStatusCodes.NOT_FOUND))
    }
    const courses = await CourseModel.find({ instructor: instructorId })
    if (!courses) {
      return next(new ErrorHandler('not found', HttpStatusCodes.NOT_FOUND))
    }
    const courseIds = courses.map((course) => course._id)
    const query = {
      courseId: { $in: courseIds },
      message: { $regex: new RegExp(search, 'i') }
    }

    const resultList = await resultModel
      .find(query)
      .populate({
        path: 'courseId',
        select: '_id name'
      })
      .sort({ createdAt: -1 })
      .populate({
        path: 'userId',
        select: '_id name'
      })
      .skip((page - 1) * limit)
      .limit(limit)
    const totalCount = await resultModel.countDocuments(query)
    const data = resultList.map((result) => ({
      id: result.id,
      user: result.userId,
      course: result.courseId,
      message: result.message,
      image: result.image,
      createdAt: result.createdAt,
      status: result.status
    }))
    const response = {
      data,
      totalCount,
      pageCount: Math.ceil(totalCount / limit)
    }
    return response
  }
  public async replyMessage(instructorId: string, resultId: string, replyMessage: string, next: NextFunction) {
    const instructors = await userModel.findOne({ _id: instructorId, role: '6615424b73f8eddb58cfe6ac' })
    if (!instructors) {
      return next(new ErrorHandler('not found', HttpStatusCodes.NOT_FOUND))
    }
    const result = await resultModel.findById({ _id: resultId })
    if (!result) {
      return next(new ErrorHandler('not found', HttpStatusCodes.NOT_FOUND))
    }
    if (replyMessage) {
      result.replyMessage = replyMessage
      result.status = true
    }
    const children = await userModel.findOne({ _id: result.userId })
    if (!children) {
      return next(new ErrorHandler('not found', HttpStatusCodes.NOT_FOUND))
    }
    const data = {
      childrenName: children.name,
      replyMessage: replyMessage,
      email: instructors.email,
      image: result.image.url,
      question: result.message
    }
    const html = await ejs.renderFile(path.join(__dirname, '../mails/replyMessgage.ejs'), data)
    try {
      await sendEmail({
        email: children.email,
        subject: 'Message Reply',
        template: 'replyMessgage.ejs',
        data
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, HttpStatusCodes.INTERNAL_SERVER_ERROR))
    }
    await result.save()

    return result
  }
}

export default new resultServices()
