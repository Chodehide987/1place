import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("[v0] Testing database connection...")

    const db = await getDatabase()

    // Test basic connection
    const result = await db.admin().ping()
    console.log("[v0] Database ping result:", result)

    // List collections
    const collections = await db.listCollections().toArray()
    console.log(
      "[v0] Collections found:",
      collections.map((c) => c.name),
    )

    // Test users collection
    const usersCollection = db.collection("users")
    const userCount = await usersCollection.countDocuments()
    console.log("[v0] Users count:", userCount)

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      collections: collections.map((c) => c.name),
      userCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Database test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
