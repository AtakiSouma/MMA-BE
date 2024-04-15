import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IRole extends Document {
  title: string
  slug: string
  status: boolean
}

const rolesSchema: Schema<IRole> = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Please enter title']
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)
const roleModel: Model<IRole> = mongoose.model('Roles', rolesSchema)
export default roleModel
