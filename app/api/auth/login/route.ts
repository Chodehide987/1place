import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth/server"
import { generateToken } from "@/lib/auth/client"
import { ensureSetup } from "@/lib/auto-setup"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login attempt started")

    await ensureSetup()

    const { email, password } = await request.json()

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("[v0] Attempting to authenticate user:", email)
    const user = await authenticateUser(email, password)

    if (!user) {
      console.log("[v0] Authentication failed for:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("[v0] User authenticated successfully:", user.email, "Role:", user.role)
    const token = await generateToken({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    console.log("[v0] Token generated successfully for role:", user.role)
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)

      if (error.message.includes("Database connection failed")) {
        return NextResponse.json({ error: "Database connection error. Please try again." }, { status: 503 })
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
