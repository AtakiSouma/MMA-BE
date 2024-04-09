import app from './app'
import dotenv from 'dotenv'
dotenv.config()
const port = process.env.PORT || 8000
const server = app.listen(port, () => {
  console.log(`Server listening on port :  ${port}`)
})
process.on('SIGINT', () => {
  server.close(() => console.log(`Server Express on  port ${port} closed`))
})
