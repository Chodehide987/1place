import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/client"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
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

    const db = await getDatabase()

    // Get all products
    const allProducts = await db.collection("products").find({}).toArray()

    // Get user's entitlements
    const entitlements = await db
      .collection("entitlements")
      .find({ userId: new ObjectId(user.userId) })
      .toArray()

    const entitledProductIds = new Set(entitlements.map((e) => e.productId.toString()))

    // Combine products with access information
    const productsWithAccess = allProducts.map((product) => ({
      ...product,
      hasAccess: !product.isPaid || entitledProductIds.has(product._id.toString()),
      grantedAt: entitlements.find((e) => e.productId.toString() === product._id.toString())?.grantedAt,
    }))

    return NextResponse.json({ products: productsWithAccess })
  } catch (error) {
    console.error("Get user library error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
