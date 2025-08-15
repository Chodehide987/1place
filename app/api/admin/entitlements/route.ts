import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/client"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { userId, productId } = await request.json()

    if (!userId || !productId) {
      return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if entitlement already exists
    const existingEntitlement = await db.collection("entitlements").findOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    })

    if (existingEntitlement) {
      return NextResponse.json({ error: "User already has access to this product" }, { status: 409 })
    }

    // Create entitlement
    const entitlement = {
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      grantedAt: new Date(),
      grantedBy: new ObjectId(user.userId),
    }

    const result = await db.collection("entitlements").insertOne(entitlement)

    return NextResponse.json({
      entitlement: { ...entitlement, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Grant entitlement error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
