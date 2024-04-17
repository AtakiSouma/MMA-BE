import { NextFunction } from 'express'
import cloudinary from 'cloudinary'
import CourseModel from '~/models/courses.model'
import ErrorHandler from '~/utils/errorHandler'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import axios from 'axios'
import { PaginationParams } from '~/types/type'
import userModel from '~/models/users.model'
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
  public async generateNewVideoUrl(videoId: any) {
    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        ttl: 300
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Apisecret kyfYnSxzFCBFj3sRfH5jYpiInCxm9ouOCaohh6zeJBxE6xSPbTfHrNLrfZo5r8r0`
        }
      }
    )
    return response.data
  }
  public async getAllCourse({ page, limit, search }: PaginationParams) {
    const query = {
      name: { $regex: new RegExp(search, 'i') }
    }
    const courseList = await CourseModel.find(query)
      .populate({
        path: 'categories',
        select: '_id title'
      })
      .skip((page - 1) * limit)
      .limit(limit)
    const totalCount = await CourseModel.countDocuments(query)
    const data = courseList.map((course) => ({
      name: course.name,
      thumbnail: course.thumbnail,
      description: course.description,
      price: course.price,
      categories: course.categories,
      level: course.level,
      purchased: course.purchased,
      status: course.status || 'Active',
      createdAt: course.createdAt
    }))
    const response = {
      data,
      totalCount,
      pageCount: Math.ceil(totalCount / limit)
    }
    return response
  }
}
export default new courseServices()
