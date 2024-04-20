import mongoose, { Model, Schema, Document } from 'mongoose'
import { IUser } from './users.model'
import { ICategories } from './categories.model'
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
  links: ILink[]
}
export interface ICourse extends Document {
  instructor: mongoose.Types.ObjectId | IUser
  name: string
  description: string
  price: number
  estimatePrice: number
  thumbnail: {
    public_id: string
    url: string
  }
  categories: mongoose.Types.ObjectId | ICategories
  level: string
  purchased: number
  ratings: number
  demoUrl: string
  benefits?: { title: string }[]
  reviews?: IReview[]
  courseContentData: ICourseContentData[]
  prerequisites?: { title: string }[]
  totalVideos?: number
  isBlocked?: boolean
  status: string
  createdAt: Date
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
export interface ILink extends Document {
  title: string
  url: string
}

const linkSchema = new Schema<ILink>({
  title: String,
  url: String
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
  questions: [commentSchema],
  links: [linkSchema]
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
      type: mongoose.Types.ObjectId,
      ref: 'Categories'
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
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: 'Users'
    },
    benefits: [{ title: String }],
    courseContentData: [courseDataSchema],
    prerequisites: [{ title: String }],
    totalVideos: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Not Active'], default: 'Not Active' }
  },
  { timestamps: true }
)
const CourseModel: Model<ICourse> = mongoose.model('Courses', courseSchema)
export default CourseModel
