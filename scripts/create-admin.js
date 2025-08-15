const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function createAdmin() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()
    const users = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await users.findOne({ email: "admin@1place.com" })
    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)
    const adminUser = {
      name: "Admin User",
      email: "admin@1place.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await users.insertOne(adminUser)
    console.log("Admin user created successfully!")
    console.log("Email: admin@1place.com")
    console.log("Password: admin123")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await client.close()
  }
}

createAdmin()
