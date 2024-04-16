import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICategories extends Document {
  title: string
  slug: string
  status: boolean
}

const categoriesSchema: Schema<ICategories> = new mongoose.Schema(
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
const categoryModel: Model<ICategories> = mongoose.model('Categories', categoriesSchema)
export default categoryModel
