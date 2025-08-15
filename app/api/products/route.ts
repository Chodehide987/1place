import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/client"
import { createProduct, getProducts } from "@/lib/utils/product"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const search = searchParams.get("search") || undefined
    const isPaid = searchParams.get("isPaid") ? searchParams.get("isPaid") === "true" : undefined
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || undefined

    const { products, total } = await getProducts({
      category,
      tags,
      search,
      isPaid,
      limit,
      skip,
    })

    return NextResponse.json({ products, total })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const productData = await request.json()

    const product = await createProduct({
      ...productData,
      createdBy: new ObjectId(user.userId),
      updatedBy: new ObjectId(user.userId),
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
