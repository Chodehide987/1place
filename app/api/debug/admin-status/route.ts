import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { authenticateUser } from "@/lib/auth/server"
import { ensureSetup } from "@/lib/auto-setup"
import type { User } from "@/lib/models/user"

export async function GET() {
  try {
    console.log("[v0] Checking admin status...")

    // Ensure setup is complete
    await ensureSetup()

    const db = await getDatabase()

    // Check if admin user exists
    const adminUser = await db.collection<User>("users").findOne({
      email: "admin@1place.com",
    })

    console.log("[v0] Admin user found:", adminUser ? "Yes" : "No")

    if (adminUser) {
      console.log("[v0] Admin user details:", {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        hasPassword: !!adminUser.password,
      })

      // Test authentication
      console.log("[v0] Testing admin authentication...")
      const authResult = await authenticateUser("admin@1place.com", "admin123")
      console.log("[v0] Auth test result:", authResult ? "Success" : "Failed")

      return NextResponse.json({
        adminExists: true,
        adminDetails: {
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          createdAt: adminUser.createdAt,
        },
        authTest: authResult ? "Success" : "Failed",
        authDetails: authResult,
      })
    } else {
      return NextResponse.json({
        adminExists: false,
        message: "Admin user not found",
      })
    }
  } catch (error) {
    console.error("[v0] Admin status check error:", error)
    return NextResponse.json(
      {
        error: "Failed to check admin status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    console.log("[v0] Force creating admin user...")
    await ensureSetup()

    return NextResponse.json({
      message: "Admin setup completed",
      adminCredentials: {
        email: "admin@1place.com",
        password: "admin123",
      },
    })
  } catch (error) {
    console.error("[v0] Force admin creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to create admin",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
