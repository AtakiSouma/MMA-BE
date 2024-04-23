import mongoose, { Document, Model, Schema } from 'mongoose'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { IRole } from './role.model'
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ICertifficate extends Document {
  public_id: string
  type: string
  url: string
}

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
  isCertified: string
  hasPaid: boolean
  interests: Array<{ courseId: string }>
  courses: Array<{ courseId: string }>
  certificates: ICertifficate[]
  isBlocked?: boolean
  status: boolean
  updateAtLogin: Date
  school: string
  createdAt: Date
}

const certificateSchema: Schema<ICertifficate> = new mongoose.Schema({
  public_id: {
    type: String
  },
  type: {
    type: String,
    enum: ['High School Diploma', "Bachelor's degree", 'English Certification'],
    required: true
  },
  url: {
    type: String,
    required: true
  }
})

const usersSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String
    },
    givenName: {
      type: String
    },
    school: {
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
    courses: [
      {
        courseId: String
      }
    ],
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
    },
    isCertified: {
      type: String,
      enum: ['Not yet', 'Proccessing', 'Yes'],
      default: 'Not yet'
    },
    hasPaid: {
      type: Boolean,
      default: false
    },
    certificates: [certificateSchema],
    updateAtLogin: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
)
const userModel: Model<IUser> = mongoose.model('User', usersSchema)
export default userModel
