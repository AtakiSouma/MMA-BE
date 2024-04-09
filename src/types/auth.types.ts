import mongoose from 'mongoose'
import { IRole } from '~/models/role.model'

export interface tokenGenerate {
  id: string
  email?: string
  avatar?: string
  photoUrl: string
  role: mongoose.Types.ObjectId
  name: string
}

export interface UserLoginParams {
  email: string
  password: string
}
