import mongoose, { Model, Schema, Document } from 'mongoose'

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId
  paymentType: string
  amount: number
  status: string
  transactionNo: number
  payDate: Date
  paymentInfo: string
}
const paymentSchema = new Schema<IPayment>(
  {
    paymentType: {
      type: String,
      enum: ['Order', 'Instructor'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['00', '01', '02', '04', '05', '06', '07', '09'],
      //00	Giao dịch thành công
      //01	Giao dịch chưa hoàn tất
      //02	Giao dịch bị lỗi
      //04	Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)
      //05	VNPAY đang xử lý giao dịch này (GD hoàn tiền)
      //06	VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)
      //07	Giao dịch bị nghi ngờ gian lận
      //09	GD Hoàn trả bị từ chối
      required: true
    },
    transactionNo: {
      type: Number,
      required: true
    },
    payDate: {
      type: Date,
      required: true
    },
    paymentInfo: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)
const PaymentModel: Model<IPayment> = mongoose.model('Payment', paymentSchema)
export default PaymentModel
