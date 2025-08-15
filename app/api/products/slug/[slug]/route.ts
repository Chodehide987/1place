import { type NextRequest, NextResponse } from "next/server"
import { getProductBySlug } from "@/lib/utils/product"
import { verifyToken } from "@/lib/auth/client"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    let user = null
    if (token) {
      user = await verifyToken(token)
    }

    // Get product without decrypted secrets first
    const product = await getProductBySlug(params.slug, false)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user has access to this product
    let hasAccess = false
    if (!product.isPaid) {
      hasAccess = true
    } else if (user) {
      const db = await getDatabase()
      const entitlement = await db.collection("entitlements").findOne({
        userId: new ObjectId(user.userId),
        productId: product._id,
      })
      hasAccess = !!entitlement
    }

    // If user has access, decrypt secrets
    let productWithSecrets = product
    if (hasAccess && product.secrets.length > 0) {
      productWithSecrets = await getProductBySlug(params.slug, true)
    }

    return NextResponse.json({
      product: productWithSecrets,
      hasAccess,
      isAuthenticated: !!user,
    })
  } catch (error) {
    console.error("Get product by slug error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
