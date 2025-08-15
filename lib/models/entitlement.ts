import type { ObjectId } from "mongodb"

export interface Entitlement {
  _id?: ObjectId
  userId: ObjectId
  productId: ObjectId
  grantedAt: Date
  grantedBy: ObjectId
}
