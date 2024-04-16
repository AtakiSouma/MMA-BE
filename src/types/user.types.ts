export interface UserParams {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export interface UserUpdateParams {
  name: string
  avatar: string
  school: string
}
export interface UserUpdatePassword {
  newPassword: string
  oldPassword: string
  confirmPassword: string
}
