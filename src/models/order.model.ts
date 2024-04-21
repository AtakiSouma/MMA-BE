import mongoose, { Model, Schema, Document } from 'mongoose'
import { IUser } from './users.model'

export interface IOrder extends Document {
  courseId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  payment_info: object
  note: string
  isBan: boolean
  status: string
  finished_At: Date
  createdAt: Date

}
const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Courses',
      require: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    note: {
      type: String
    },
    payment_info: {
      type: Object
    },
    finished_At: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Completed', 'Processing', 'Finished', 'Not Available'],
      default: 'Processing'
    },
    isBan: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)
const OrderModel: Model<IOrder> = mongoose.model('Orders', orderSchema)
export default OrderModel
