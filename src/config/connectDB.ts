import mongoose from 'mongoose'

const dbURL: string =
  process.env.DB_URL ||
  'mongodb+srv://hoangnam1772004:01685835912nam@cluster0.cr0cpyo.mongodb.net/arteaselkids?retryWrites=true&w=majority&appName=Cluster0'
const connectDB = async () => {
  try {
    await mongoose.connect(dbURL).then((data: any) => {
      console.log('MongoDB connected')
    })
  } catch (error: any) {
    console.log(error.message)
    setTimeout(connectDB, 5000)
  }
}

export default connectDB
