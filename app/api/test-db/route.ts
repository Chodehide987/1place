import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("[v0] Testing database connection...")
    console.log("[v0] Environment variables check:")
    console.log("[v0] MONGODB_URI exists:", !!process.env.MONGODB_URI)
    console.log("[v0] NODE_ENV:", process.env.NODE_ENV)

    const db = await getDatabase()

    // Test basic operations
    const collections = await db.listCollections().toArray()
    console.log(
      "[v0] Available collections:",
      collections.map((c) => c.name),
    )

    // Test user collection
    const userCount = await db.collection("users").countDocuments()
    console.log("[v0] User count:", userCount)

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      collections: collections.map((c) => c.name),
      userCount,
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("[v0] Database test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        environment: process.env.NODE_ENV,
      },
      { status: 500 },
    )
  }
}
