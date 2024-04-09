import HttpStatusCodes from '~/constants/HttpStatusCodes'

export default class ErrorHandler extends Error {
  public statusCode: HttpStatusCodes

  public constructor(message: string, statusCode: HttpStatusCodes) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
