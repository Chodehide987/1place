import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI =
  "mongodb+srv://qvictoria839:HkZ4iWQdF0KvhDob@cluster0.s2xwzqw.mongodb.net/1place?retryWrites=true&w=majority"

async function testConnectionAndCreateAdmin() {
  let client

  try {
    console.log("[v0] Starting MongoDB connection test...")

    // Test connection
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("[v0] ✅ Successfully connected to MongoDB!")

    const db = client.db("1place")

    // List collections to verify database access
    const collections = await db.listCollections().toArray()
    console.log(
      "[v0] Available collections:",
      collections.map((c) => c.name),
    )

    // Create users collection if it doesn't exist
    const usersCollection = db.collection("users")

    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: "admin@1place.com" })

    if (existingAdmin) {
      console.log("[v0] ✅ Admin user already exists")
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 12)

      const adminUser = {
        email: "admin@1place.com",
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await usersCollection.insertOne(adminUser)
      console.log("[v0] ✅ Admin user created successfully:", result.insertedId)
    }

    // Create some sample products
    const productsCollection = db.collection("products")
    const existingProducts = await productsCollection.countDocuments()

    if (existingProducts === 0) {
      const sampleProducts = [
        {
          title: "Modern UI Kit",
          description: "A comprehensive UI kit with modern components and design elements.",
          price: 29.99,
          category: "Design",
          tags: ["ui", "design", "components"],
          isPaid: true,
          isActive: true,
          slug: "modern-ui-kit",
          images: ["/modern-ui-kit-dashboard.png"],
          files: [],
          secrets: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Free Icon Pack",
          description: "A collection of 100+ free icons for your projects.",
          price: 0,
          category: "Design",
          tags: ["icons", "free", "graphics"],
          isPaid: false,
          isActive: true,
          slug: "free-icon-pack",
          images: ["/icon-pack-collection.png"],
          files: [],
          secrets: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const productResult = await productsCollection.insertMany(sampleProducts)
      console.log("[v0] ✅ Sample products created:", productResult.insertedIds)
    } else {
      console.log("[v0] ✅ Products already exist in database")
    }

    console.log("[v0] 🎉 Database setup completed successfully!")
    console.log("[v0] Admin Login: admin@1place.com / admin123")
  } catch (error) {
    console.error("[v0] ❌ Database connection failed:", error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log("[v0] Database connection closed")
    }
  }
}

testConnectionAndCreateAdmin().catch(console.error)
