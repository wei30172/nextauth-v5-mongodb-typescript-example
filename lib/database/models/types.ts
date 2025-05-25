export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}

export enum UserProvider {
  GOOGLE = "google",
  CREDENTIALS = "credentials"
}


export interface IUser {
  _id: string
  name: string
  email: string
  password?: string
  image?: string
  role: UserRole
  provider: UserProvider
  emailVerified: Date
  isTwoFactorEnabled: boolean
  emailPendingVerification?: string
  createdAt: Date
  updatedAt: Date
}

export interface ITwoFactorConfirmation {
  _id: string
  userId: string
}