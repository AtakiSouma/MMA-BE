import mongoose, { Document, Model, Schema } from 'mongoose'
import { IUser } from './users.model'
import { ICourse } from './courses.model'

export interface IResult extends Document {
  message: string
  status: boolean
  userId: mongoose.Types.ObjectId | IUser
  courseId: mongoose.Types.ObjectId | ICourse
  image: {
    public_id: string
    url: string
  }
  createdAt: Date
  replyMessage: string
}

const resultSchema: Schema<IResult> = new mongoose.Schema(
  {
    image: {
      public_id: { type: String },
      url: { type: String }
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },

    message: {
      type: String
    },
    courseId: { type: mongoose.Types.ObjectId, ref: 'Courses' },
    status: { type: Boolean, default: false },
    replyMessage: { type: String }
  },
  { timestamps: true }
)
const resultModel: Model<IResult> = mongoose.model('Results', resultSchema)
export default resultModel
