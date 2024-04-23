export interface VnpParams {
  [key: string]: string
  vnp_Version: string
  vnp_Command: string
  vnp_TmnCode: string
  vnp_Locale: string
  vnp_CurrCode: string
  vnp_TxnRef: string
  vnp_OrderInfo: string
  vnp_OrderType: string
  vnp_Amount: string
  vnp_ReturnUrl: string
  vnp_IpAddr: string
  vnp_CreateDate: string
  vnp_BankCode: string
  vnp_SecureHash: string
}

export interface VnpReturnParams {
  vnp_Amount: string
  vnp_BankCode: string
  vnp_BankTranNo: string
  vnp_CardType: string
  vnp_OrderInfo: string
  vnp_PayDate: string
  vnp_ResponseCode: string
  vnp_TmnCode: string
  vnp_TransactionNo: string
  vnp_TransactionStatus: string
  vnp_TxnRef: string
  vnp_SecureHash: string
}
