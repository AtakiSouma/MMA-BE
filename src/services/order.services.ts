import { NextFunction, Request, Response } from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import CourseModel from '~/models/courses.model'
import userModel from '~/models/users.model'
import ErrorHandler from '~/utils/errorHandler'
import ejs from 'ejs'
import path from 'path'
import { sendEmail } from '~/utils/sendMail'
import notificationModel from '~/models/notification.models'
import OrderModel from '~/models/order.model'
import { PaginationParams } from '~/types/type'
import Stripe from 'stripe'

class orderServices {
  public async createOrder(next: NextFunction, userId: string, courseId: string, payment_info: object) {
    const stripeInstance = new Stripe(
      'sk_test_51P7cvEFCzIlVME0T0H4KhsmaQDgwd9aI7hExN9KmyYj1c2UAAJdY5B57RYvd6CkB14VFMG88t7rNvLT57zfQhrki00YznFBn5r'
    )
    if (payment_info) {
      if ('id' in payment_info) {
        const paymentIntentId = String(payment_info.id)
        const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId)
        if (paymentIntent.status !== 'succeeded') {
          throw next(new ErrorHandler('Not authorized to retrieve payment', HttpStatusCodes.CONFLICT))
        }
      }
    }

    const user = await userModel.findById({ _id: userId })
    if (!user) {
      return next(new ErrorHandler('User not found', HttpStatusCodes.UNAUTHORIZED))
    }
    const courseExistInUser = user.courses.some((course: any) => course._id.toString() === courseId)
    if (courseExistInUser) {
      throw next(new ErrorHandler('You already buy this course', HttpStatusCodes.BAD_REQUEST))
    }
    const course = await CourseModel.findById({ _id: courseId })
    if (!course) {
      return next(new ErrorHandler('course', HttpStatusCodes.BAD_REQUEST))
    }
    const data: any = {
      courseId: course?._id,
      userId: user._id,
      payment_info
    }
    const mailData = {
      order: {
        _id: course._id.toString().slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      }
    }
    const html = await ejs.renderFile(path.join(__dirname, '../mails/order-confirmation.ejs'), { order: mailData })
    try {
      if (user) {
        await sendEmail({
          email: user.email,
          subject: 'Order confirmation',
          data: mailData,
          template: 'order-confirmation.ejs'
        })
      }
    } catch (error: any) {
      console.log('send Mail', error)
      throw next(new ErrorHandler(error.message, HttpStatusCodes.BAD_REQUEST))
    }
    user.courses.push(course._id)
    await user.save()
    const order = await OrderModel.create({
      courseId: course.id,
      userId: user.id,
      note: 'note note description',
      payment_info: payment_info,
      finished_At: Date.now(),
      status: 'Processing',
      isBan: false
    })
    await notificationModel.create({
      user: user?._id,
      title: 'New order',
      message: `You have a new order from ${course.name}`,
      link: 'Order',
      mobile_link: 'OrderScreen'
    })
    course.purchased ? (course.purchased += 1) : (course.purchased = 1)
    await course.save()
    return order
  }

  public async getAllOrder({ page, limit, search }: PaginationParams) {
    const query = {
      note: { $regex: new RegExp(search, 'i') }
    }
    const orderList = await OrderModel.find(query)
      .populate({
        path: 'courseId',
        select: 'name thumbnail price '
      })
      .populate({
        path: 'userId',
        select: 'name emaill '
      })
      .skip((page - 1) * limit)
      .limit(limit)
    const totalCount = await OrderModel.countDocuments(query)
    const data = orderList.map((order) => ({
      id: order.id,
      status: order.status,
      payment_info: order.payment_info,
      course: order.courseId,
      user: order.userId,
      createdAt: order.createdAt
    }))
    const response = {
      data,
      totalCount,
      pageCount: Math.ceil(totalCount / limit)
    }
    return response
  }
  public async getAllOrderByUserKid(userId: string, next: NextFunction) {
    const user = await userModel.findById({ _id: userId })
    if (!user) {
      return next(new ErrorHandler('User not found', HttpStatusCodes.UNAUTHORIZED))
    }
    const order = await OrderModel.find({ userId: userId }).populate({
      path: 'courseId',
      select: '_id thumbnail price name'
    })
    if (!order) {
      return next(new ErrorHandler(' not found', HttpStatusCodes.UNAUTHORIZED))
    }
    return order
  }
}
export default new orderServices()
