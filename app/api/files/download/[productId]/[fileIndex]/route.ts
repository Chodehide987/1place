import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/client"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { productId: string; fileIndex: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const db = await getDatabase()

    // Get product
    const product = await db.collection("products").findOne({ _id: new ObjectId(params.productId) })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user has access to this product
    let hasAccess = false
    if (!product.isPaid) {
      hasAccess = true
    } else {
      const entitlement = await db.collection("entitlements").findOne({
        userId: new ObjectId(user.userId),
        productId: new ObjectId(params.productId),
      })
      hasAccess = !!entitlement
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied. Purchase required." }, { status: 403 })
    }

    // Get file info
    const fileIndex = Number.parseInt(params.fileIndex)
    if (fileIndex < 0 || fileIndex >= product.downloadableFiles.length) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const file = product.downloadableFiles[fileIndex]

    // Log download for analytics (optional)
    await db.collection("downloads").insertOne({
      userId: new ObjectId(user.userId),
      productId: new ObjectId(params.productId),
      fileName: file.name,
      downloadedAt: new Date(),
    })

    // Return file info for client-side download
    // In a real implementation, you'd serve the actual file or redirect to a signed URL
    return NextResponse.json({
      file: {
        name: file.name,
        url: file.url,
        size: file.size,
        type: file.type,
      },
      downloadUrl: file.url, // This would be a secure, time-limited URL in production
    })
  } catch (error) {
    console.error("File download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
