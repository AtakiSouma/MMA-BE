import mongoose from 'mongoose'
import { IRole } from '~/models/role.model'
import { ICertifficate } from '~/models/users.model'

export interface tokenGenerate {
  id: string
  email?: string
  avatar?: string
  photoUrl: string
  role: mongoose.Types.ObjectId
  name: string
  isVerified: boolean,
  isCertified: string
  hasPaid: boolean
}

export interface UserLoginParams {
  email: string
  password: string
}
