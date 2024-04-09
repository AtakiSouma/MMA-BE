import mongoose, { Document, Model, Schema } from 'mongoose'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { IRole } from './role.model'
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export interface IUser extends Document {
  name: string
  givenName: string
  familyName: string
  email: string
  password: string
  avatar: {
    public_id: string
    url: string
  }
  photoUrl: string
  role: mongoose.Types.ObjectId
  isVerified: boolean
  interests: Array<{ courseId: string }>
  courses: Array<{ courseId: string }>
  isBlocked?: boolean
  status: boolean
}

const usersSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String
    },
    givenName: {
      type: String
    },
    familyName: {
      type: String
    },
    email: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    photoUrl: {
      type: String
    },
    interests: {
      type: [String]
    },
    courses: {
      type: [String]
    },
    avatar: {
      public_id: String,
      url: String
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Roles',
      required: true
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)
const userModel: Model<IUser> = mongoose.model('User', usersSchema)
export default userModel
