// Server-only auth utilities (with MongoDB)
import { getDatabase } from "../mongodb"
import type { User, UserSession } from "../models/user"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs" // Moved bcryptjs import to server-only

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
  try {
    console.log("[v0] Creating user:", userData.email)
    const db = await getDatabase()

    const existingUser = await db.collection<User>("users").findOne({ email: userData.email })
    if (existingUser) {
      console.log("[v0] User already exists:", userData.email)
      throw new Error("User with this email already exists")
    }

    const hashedPassword = await hashPassword(userData.password)
    console.log("[v0] Password hashed successfully")

    const user: User = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<User>("users").insertOne(user)
    console.log("[v0] User created with ID:", result.insertedId)
    return { ...user, _id: result.insertedId }
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    throw error
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    console.log("[v0] Finding user by email:", email)
    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({ email })
    console.log("[v0] User found:", user ? "Yes" : "No")
    return user
  } catch (error) {
    console.error("[v0] Error finding user by email:", error)
    throw error
  }
}

export async function findUserById(id: string): Promise<User | null> {
  const db = await getDatabase()
  return db.collection<User>("users").findOne({ _id: new ObjectId(id) })
}

export async function authenticateUser(email: string, password: string): Promise<UserSession | null> {
  try {
    console.log("[v0] Authenticating user:", email)
    const user = await findUserByEmail(email)
    if (!user) {
      console.log("[v0] User not found:", email)
      return null
    }

    console.log("[v0] User found, verifying password...")
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      console.log("[v0] Password verification failed for:", email)
      return null
    }

    console.log("[v0] Authentication successful for:", email)
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    }
  } catch (error) {
    console.error("[v0] Error during authentication:", error)
    throw error
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const db = await getDatabase()
  const result = await db
    .collection<User>("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" },
    )
  return result.value || null
}
