import { NextFunction } from 'express'
import cloudinary from 'cloudinary'
import CourseModel from '~/models/courses.model'
import ErrorHandler from '~/utils/errorHandler'
import HttpStatusCodes from '~/constants/HttpStatusCodes'

class courseServices {
  public async createCourse(data: any) {
    const thumbnail = data.thumbnail
    const name = data.name
    if (name) {
      const nameExist = await CourseModel.findOne({ name: name })
      if (nameExist) {
        throw new ErrorHandler('Course already exists ', HttpStatusCodes.CONFLICT)
      }
    }
    if (thumbnail) {
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: 'courses'
      })
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    }
    const course = await CourseModel.create(data)
    if (!course) {
      throw new ErrorHandler('Course is not  created', HttpStatusCodes.CONFLICT)
    }
    return course
  }
  public async updateCourseInfo(data: any, id: string) {
    const thumbnail = data.thumbnail
    const course = await CourseModel.findById(id)
    if (!course) {
      throw new ErrorHandler('Course is not found', HttpStatusCodes.NOT_FOUND)
    }
    if (thumbnail) {
      await cloudinary.v2.uploader.destroy(thumbnail.public_id)
      const myCloud = await cloudinary.v2.uploader.upload(
        thumbnail,
        {
          folder: 'courses'
        },
        (error) => console.log(error)
      )
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    }
    const courseUpdated = await CourseModel.findByIdAndUpdate(
      id,
      {
        $set: data
      },
      {
        new: true
      }
    )
    return courseUpdated
  }
}
export default new courseServices()
