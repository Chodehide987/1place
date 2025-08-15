// Enhanced script to create admin user and test database connection
const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function createAdminAndTest() {
  let client

  try {
    console.log("🔍 Checking environment variables...")
    const uri = process.env.MONGODB_URI

    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    console.log("✅ MONGODB_URI found")
    console.log("🔗 Connecting to MongoDB...")

    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    await client.connect()
    console.log("✅ Connected to MongoDB successfully")

    // Test connection
    await client.db("admin").command({ ping: 1 })
    console.log("✅ MongoDB ping successful")

    const db = client.db("1place")
    console.log("✅ Connected to 1place database")

    // Check if admin already exists
    const existingAdmin = await db.collection("users").findOne({ email: "admin@1place.com" })

    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists")
      console.log("📧 Email: admin@1place.com")
      console.log("🔑 Password: admin123")
      return
    }

    // Create admin user
    console.log("👤 Creating admin user...")
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

    const result = await db.collection("users").insertOne(adminUser)
    console.log("✅ Admin user created successfully")
    console.log("🆔 User ID:", result.insertedId)
    console.log("📧 Email: admin@1place.com")
    console.log("🔑 Password: admin123")

    // Test user retrieval
    const createdUser = await db.collection("users").findOne({ email: "admin@1place.com" })
    console.log("✅ Admin user verification successful")
    console.log("👤 User role:", createdUser.role)
  } catch (error) {
    console.error("❌ Error:", error.message)
    if (error.code) {
      console.error("🔢 Error code:", error.code)
    }
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log("🔌 Database connection closed")
    }
  }
}

createAdminAndTest()
