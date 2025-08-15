import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/client"

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

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type and size
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 100MB." }, { status: 400 })
    }

    // Allowed file types
    const allowedTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "application/pdf",
      "text/plain",
      "application/json",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/javascript",
      "text/html",
      "text/css",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Upload to cloud storage (AWS S3, Google Cloud, etc.)
    // 2. Generate a secure URL
    // 3. Store file metadata in database

    // For this demo, we'll simulate the upload
    const fileUrl = `/uploads/${Date.now()}-${file.name}`
    const fileInfo = {
      name: file.name,
      url: fileUrl,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      uploadedBy: user.userId,
    }

    return NextResponse.json({
      file: fileInfo,
      message: "File uploaded successfully",
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
