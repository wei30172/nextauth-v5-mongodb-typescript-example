import mongoose, { Document } from "mongoose"

export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}

export enum UserProvider {
  GOOGLE = "google",
  CREDENTIALS = "credentials"
}


export interface IUser extends Document {
  name: string
  email: string
  password?: string
  image?: string
  role: UserRole
  provider: UserProvider
  emailVerified: Date
  isTwoFactorEnabled: boolean
  createdAt: Date
  updatedAt: Date
}