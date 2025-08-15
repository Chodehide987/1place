import { getDatabase } from "./mongodb"
import { createUser } from "./auth/server"
import type { User } from "./models/user"

let setupPromise: Promise<void> | null = null

export async function ensureSetup(): Promise<void> {
  if (setupPromise) {
    return setupPromise
  }

  setupPromise = performSetup()
  return setupPromise
}

async function performSetup(): Promise<void> {
  try {
    console.log("[v0] Starting auto-setup...")
    const db = await getDatabase()

    const adminExists = await db.collection<User>("users").findOne({
      email: "admin@1place.com",
    })

    if (!adminExists) {
      console.log("[v0] Creating admin user...")
      await createUser({
        email: "admin@1place.com",
        password: "admin123",
        name: "Admin User",
        role: "admin",
      })
      console.log("[v0] Admin user created successfully")
    } else {
      console.log("[v0] Admin user already exists")
    }

    const productCount = await db.collection("products").countDocuments()
    if (productCount === 0) {
      console.log("[v0] Creating sample products...")
      const sampleProducts = [
        {
          title: "Modern UI Kit",
          description: "A comprehensive UI kit with modern components",
          price: 29.99,
          category: "Design",
          tags: ["ui", "design", "components"],
          isPaid: true,
          files: [{ name: "ui-kit.zip", url: "/sample-files/ui-kit.zip" }],
          secrets: [],
          slug: "modern-ui-kit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Free Icon Pack",
          description: "100+ free icons for your projects",
          price: 0,
          category: "Icons",
          tags: ["icons", "free", "svg"],
          isPaid: false,
          files: [{ name: "icons.zip", url: "/sample-files/icons.zip" }],
          secrets: [],
          slug: "free-icon-pack",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      await db.collection("products").insertMany(sampleProducts)
      console.log("[v0] Sample products created")
    }

    console.log("[v0] Auto-setup completed successfully")
  } catch (error) {
    console.error("[v0] Auto-setup failed:", error)
    // Don't throw error to prevent app from breaking
  }
}
