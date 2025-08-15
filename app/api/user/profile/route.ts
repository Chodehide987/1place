import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/client"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if email is already taken by another user
    const existingUser = await db.collection("users").findOne({
      email,
      _id: { $ne: new ObjectId(user.userId) },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 409 })
    }

    // Update user profile
    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(user.userId) },
      {
        $set: {
          name,
          email,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after", projection: { password: 0 } },
    )

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        image: result.image,
      },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
