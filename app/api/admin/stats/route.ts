import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/client"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
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

    const db = await getDatabase()

    // Get product stats
    const totalProducts = await db.collection("products").countDocuments()
    const paidProducts = await db.collection("products").countDocuments({ isPaid: true })
    const freeProducts = await db.collection("products").countDocuments({ isPaid: false })

    // Get user stats
    const totalUsers = await db.collection("users").countDocuments()

    // Get recent products
    const recentProducts = await db.collection("products").find({}).sort({ createdAt: -1 }).limit(5).toArray()

    // Get recent users
    const recentUsers = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    return NextResponse.json({
      totalProducts,
      totalUsers,
      paidProducts,
      freeProducts,
      recentProducts,
      recentUsers,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
