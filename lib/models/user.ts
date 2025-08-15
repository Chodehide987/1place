import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  image?: string
  role: "admin" | "user"
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  _id?: ObjectId
  userId: ObjectId
  email: string
  name: string
  role: "admin" | "user"
  image?: string
}
