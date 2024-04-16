import mongoose, { Model, Schema, Document } from 'mongoose'
import { IUser } from './users.model'
export interface IComment extends Document {
  user: mongoose.Types.ObjectId | IUser
  question: string
  questionReplies: IComment[]
}
export interface IReview extends Document {
  user: mongoose.Types.ObjectId | IUser
  rating: number
  comment: string
  commentReplies: IComment[]
}

export interface ICourseContentData extends Document {
  title: string
  videoSection: string
  description: string
  videoUrl: string
  videoThumbnail: object
  videoLength: string
  rate: number
  suggestion: string
  questions: IComment[]
  reviews: IReview[]
}
export interface ICourse extends Document {
  instructor: mongoose.Types.ObjectId
  name: string
  description: string
  price: number
  estimatePrice: number
  thumbnail: {
    public_id: string
    url: string
  }
  categories: string
  level: string
  purchased: number
  ratings: number
  demoUrl: string
  benefits?: { title: string }[]
  reviews?: IReview[]
  courseContentData: ICourseContentData[]
}

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0
  },
  comment: String,
  commentReplies: [Object]
})
const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object]
})

const courseDataSchema = new Schema<ICourseContentData>({
  videoUrl: String,
  //   videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  reviews: [reviewSchema],
  suggestion: String,
  questions: [commentSchema]
})

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    price: {
      type: Number
    },
    estimatePrice: {
      type: Number
    },
    thumbnail: {
      public_id: { type: String },
      url: { type: String }
    },
    categories: {
      type: String
    },
    level: {
      type: String
    },
    ratings: {
      type: Number,
      default: 0
    },
    purchased: {
      type: Number,
      default: 0
    },
    demoUrl: {
      type: String
    },
    benefits: [{ title: String }],
    courseContentData: [courseDataSchema]
  },
  { timestamps: true }
)
const CourseModel: Model<ICourse> = mongoose.model('Courses', courseSchema)
export default CourseModel
