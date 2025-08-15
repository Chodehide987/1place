import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth/server"
import { generateToken } from "@/lib/auth/client"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Registration attempt started")
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("[v0] Invalid email format:", email)
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("[v0] Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    console.log("[v0] Creating new user:", email)
    const user = await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: "user",
    })

    console.log("[v0] User created successfully:", user.email)
    const token = await generateToken({
      _id: user._id!.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    console.log("[v0] Registration token generated successfully")
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
    console.error("[v0] Registration error:", error)

    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)

      if (error.message.includes("already exists")) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
      }

      if (error.message.includes("Database connection failed")) {
        return NextResponse.json({ error: "Database connection error. Please try again." }, { status: 503 })
      }
    }

    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
