import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

export async function GET() {
  try {
    console.log("[v0] Testing MongoDB connection...")

    // Check if MONGODB_URI exists
    const uri = process.env.MONGODB_URI
    if (!uri) {
      console.log("[v0] MONGODB_URI not found in environment variables")
      return NextResponse.json({
        success: false,
        error: "MONGODB_URI environment variable not set",
        availableEnvVars: Object.keys(process.env).filter((key) => key.includes("MONGO")),
      })
    }

    console.log("[v0] MONGODB_URI found, attempting connection...")
    console.log("[v0] URI format:", uri.substring(0, 20) + "...")

    // Create MongoDB client with simplified options
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })

    // Test connection
    await client.connect()
    console.log("[v0] Connected to MongoDB successfully")

    // Test database access
    const db = client.db("1place")
    const collections = await db.listCollections().toArray()
    console.log(
      "[v0] Available collections:",
      collections.map((c) => c.name),
    )

    await client.close()
    console.log("[v0] Connection closed successfully")

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      database: "1place",
      collections: collections.map((c) => c.name),
    })
  } catch (error: any) {
    console.error("[v0] MongoDB connection error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      type: error.constructor.name,
    })
  }
}
