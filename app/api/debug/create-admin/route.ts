import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth/server"

export async function POST() {
  try {
    console.log("[v0] Creating admin user...")

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: "admin@1place.com" })
    if (existingAdmin) {
      console.log("[v0] Admin user already exists")
      return NextResponse.json({
        success: true,
        message: "Admin user already exists",
        adminId: existingAdmin._id,
      })
    }

    // Create admin user
    const hashedPassword = await hashPassword("admin123")
    const adminUser = {
      email: "admin@1place.com",
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(adminUser)
    console.log("[v0] Admin user created:", result.insertedId)

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      adminId: result.insertedId,
    })
  } catch (error) {
    console.error("[v0] Admin creation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
