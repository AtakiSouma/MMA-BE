import { NextFunction } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import CourseModel from '~/models/courses.model'
import progressModel from '~/models/progress.model'
import userModel from '~/models/users.model'
import { progressListParams, progressParams } from '~/types/progress.types'
import ErrorHandler from '~/utils/errorHandler'

class progressServices {
  public async createCourseContentProgress({ courseContentId, courseId, userId }: progressParams, next: NextFunction) {
    const course = await CourseModel.findById({ _id: courseId })
    if (!course) {
      return next(new ErrorHandler('Course not found', HttpStatusCodes.NOT_FOUND))
    }
    const user = await userModel.findById({ _id: userId })
    if (!user) {
      return next(new ErrorHandler('User not found', HttpStatusCodes.NOT_FOUND))
    }
    const courseContent = course.courseContentData.find((content) => content._id.toString() === courseContentId)
    if (!courseContent || courseContent === undefined) {
      return next(new ErrorHandler('Course Content not found', HttpStatusCodes.NOT_FOUND))
    }
    const progressList = await progressModel.find({
      courseId: courseId,
      userId: userId
    })
    const check = progressList.some((item) => item.courseContentId.toString() === courseContentId)
    console.log('check', check)
    if (check === true) {
      return next(new ErrorHandler('Can not create progress , progress is complete', HttpStatusCodes.NOT_FOUND))
    }
    const progress = await progressModel.create({
      userId: userId,
      courseId: courseId,
      courseContentId: courseContentId
    })
    return progress
  }

  public async getCourseContentProgress({ courseId, userId }: progressListParams, next: NextFunction) {
    const course = await CourseModel.findById({ _id: courseId })
    if (!course) {
      return next(new ErrorHandler('Course not found', HttpStatusCodes.NOT_FOUND))
    }
    const user = await userModel.findById({ _id: userId })
    if (!user) {
      return next(new ErrorHandler('User not found', HttpStatusCodes.NOT_FOUND))
    }
    const progressList = await progressModel.find({
      courseId: courseId,
      userId: userId
    })
    return progressList
  }
  
  public async getCourseContentProgressDetail({ courseId, userId }: progressListParams, next: NextFunction) {
    const course = await CourseModel.findById({ _id: courseId })
    if (!course) {
      return next(new ErrorHandler('Course not found', HttpStatusCodes.NOT_FOUND))
    }
    const user = await userModel.findById({ _id: userId })
    if (!user) {
      return next(new ErrorHandler('User not found', HttpStatusCodes.NOT_FOUND))
    }
    const progressList = await progressModel.find({
      courseId: courseId,
      userId: userId
    })
    return progressList
  }
}
export default new progressServices()
