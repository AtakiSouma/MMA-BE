import mongoose, { Document, Model, Schema } from 'mongoose'
import { ICourse, ICourseContentData } from './courses.model'
import { IUser } from './users.model'

export interface IProgress extends Document {
  courseId: mongoose.Types.ObjectId | ICourse
  userId: mongoose.Types.ObjectId | IUser
  courseContentId: mongoose.Types.ObjectId | ICourseContentData
}

const progressSchema: Schema<IProgress> = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    userId: { type: mongoose.Types.ObjectId, required: true },
    courseContentId: {
      type: mongoose.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
)
const progressModel: Model<IProgress> = mongoose.model('Progress', progressSchema)
export default progressModel
