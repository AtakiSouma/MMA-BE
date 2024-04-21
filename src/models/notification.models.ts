import mongoose, { Document, Model, Schema } from 'mongoose'

export interface INotification extends Document {
  title: string
  message: string
  status: string
  userId: string
  link: string
  mobile_link: string
}

const categoriesSchema: Schema<INotification> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'unread'
    },
    link: {
      type: String
    },
    mobile_link: {
      type: String
    }
  },
  { timestamps: true }
)
const notificationModel: Model<INotification> = mongoose.model('Notifications', categoriesSchema)
export default notificationModel
