import { createHmac } from 'crypto'
import { NextFunction, Request, Response } from 'express'
import moment from 'moment'
import { AnyObject, ObjectId } from 'mongoose'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import { sendSuccessResponseString, sendSuccessResponseWithMessage } from '~/constants/successResponse'
import queryString from 'qs'
import { VnpParams, VnpReturnParams } from '~/types/vnp.types'
import PaymentModel from '~/models/payment.model'
import ErrorHandler from '~/utils/errorHandler'
import userModel from '~/models/users.model'

class paymentServices {
  public async saveInstructorPayment(vnp_Params: VnpReturnParams, userId: string) {
    const newPaymentOrder = new PaymentModel({
      userId,
      paymentType: 'Instructor',
      amount: vnp_Params.vnp_Amount,
      status: vnp_Params.vnp_ResponseCode,
      transactionNo: vnp_Params.vnp_TransactionNo,
      payDate: vnp_Params.vnp_PayDate,
      paymentInfo: vnp_Params.vnp_OrderInfo
    })
    await newPaymentOrder.save()
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        hasPaid: true
      },
      {
        new: true
      }
    )
    if (newPaymentOrder) {
      return updatedUser
    } else {
      console.log('error')
    }
  }

  public async createCoursePaymentUrl(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      // res.status(200).send();
      return
    }
    const { amount, bankCode, userid } = req.body
    if (!amount) {
      // throw generateError("Invalid amount ", HttpStatusCodes.NOT_ACCEPTABLE);
      console.log('error')
    }
    process.env.TZ = 'Asia/Ho_Chi_Minh'
    let date = new Date()
    let createDate = moment(date).format('YYYYMMDDHHmmss')
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress
    if (Array.isArray(ipAddr)) {
      ipAddr = ipAddr[0]
    }

    let tmnCode = process.env.VNP_TMNCODE
    let secretKey = process.env.VNP_HASHSECRET
    let vnpUrl = process.env.VNP_URL
    let returnUrl = process.env.VNP_RETURN_URL
    // let orderId = moment(date).format("DDHHmmss");
    let locale = 'vn'
    if (locale === null || locale === '') {
      locale = 'vn'
    }
    let currCode = 'VND'
    let vnp_Params: Record<string, string | number> = {}
    vnp_Params['vnp_Version'] = '2.1.0'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = String(tmnCode)
    vnp_Params['vnp_Locale'] = locale
    vnp_Params['vnp_CurrCode'] = currCode
    vnp_Params['vnp_TxnRef'] = userid
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + userid
    vnp_Params['vnp_OrderType'] = 'other'
    vnp_Params['vnp_Amount'] = amount * 100
    vnp_Params['vnp_ReturnUrl'] = String(returnUrl)
    vnp_Params['vnp_IpAddr'] = String(ipAddr)
    vnp_Params['vnp_CreateDate'] = createDate
    if (typeof bankCode !== 'undefined' && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode
    }
    vnp_Params = this.sortObject(vnp_Params)

    let querystring = require('qs')
    let signData = querystring.stringify(vnp_Params, { encode: false })
    let crypto = require('crypto')
    let hmac = crypto.createHmac('sha512', secretKey)
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
    vnp_Params['vnp_SecureHash'] = signed
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })
    if (!vnpUrl) {
      // throw generateError("Invalid" , HttpStatusCodes.BAD_REQUEST);
      console.log('error')
    }
    if (vnpUrl) return sendSuccessResponseString(res, HttpStatusCodes.OK, vnpUrl)
  }

  public async getReturnPaymentUrl(req: Request, res: Response, next: NextFunction) {
    const vnp_Params = req.query
    const userId = req.params.id
    // const amount = req.query.vnp_Amount;
    const secureHash = vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    const sorted_vnp_Params = this.sortObject(Object(vnp_Params)) as VnpReturnParams

    const tmnCode = process.env.VNP_TMNCODE
    const secretKey = process.env.VNP_HASHSECRET || ''
    const signData = queryString.stringify(sorted_vnp_Params, {
      encode: false
    })
    const hmac = createHmac('sha512', secretKey)
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
    console.log('secureHash', secureHash)
    console.log('signed', signed)
    if (secureHash === signed) {
      const updatedUser = await this.saveInstructorPayment(sorted_vnp_Params, userId)
      return updatedUser
    }
  }

  private sortObject(obj: AnyObject): AnyObject {
    let sorted: AnyObject = {}
    let str: string[] = Object.keys(obj).map(encodeURIComponent)

    str.sort()

    for (const key of str) {
      const value: string | number = obj[key]
      sorted[key] = encodeURIComponent(value.toString()).replace(/%20/g, '+')
    }

    return sorted
  }
}
export default new paymentServices()
