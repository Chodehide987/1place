import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

async function createAdminUser() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is required")
    process.exit(1)
  }

  console.log("🔗 Connecting to MongoDB...")
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db("1place")
    const usersCollection = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: "admin@1place.com" })

    if (existingAdmin) {
      console.log("👤 Admin user already exists")
      console.log("📧 Email: admin@1place.com")
      console.log("🔑 Password: admin123")
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)

    const adminUser = {
      name: "Admin User",
      email: "admin@1place.com",
      password: hashedPassword,
      role: "admin",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(adminUser)
    console.log("✅ Admin user created successfully!")
    console.log("👤 User ID:", result.insertedId)
    console.log("📧 Email: admin@1place.com")
    console.log("🔑 Password: admin123")
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
    process.exit(1)
  } finally {
    await client.close()
    console.log("🔌 MongoDB connection closed")
  }
}

createAdminUser()
