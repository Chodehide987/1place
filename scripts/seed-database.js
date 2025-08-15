const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function seedDatabase() {
  console.log("[v0] Starting database seeding process...")
  console.log("[v0] MongoDB URI:", process.env.MONGODB_URI ? "✓ Found" : "✗ Missing")

  if (!process.env.MONGODB_URI) {
    console.error("[v0] MONGODB_URI environment variable is required!")
    process.exit(1)
  }

  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    console.log("[v0] Connecting to MongoDB...")
    await client.connect()
    console.log("[v0] Connected to MongoDB successfully!")

    const db = client.db("1place")
    console.log("[v0] Using database: 1place")

    console.log("[v0] Checking for admin user...")
    const adminExists = await db.collection("users").findOne({ email: "admin@1place.com" })
    if (!adminExists) {
      console.log("[v0] Creating admin user...")
      const hashedPassword = await bcrypt.hash("admin123", 12)
      const adminResult = await db.collection("users").insertOne({
        name: "Admin User",
        email: "admin@1place.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("[v0] Admin user created with ID:", adminResult.insertedId)
    } else {
      console.log("[v0] Admin user already exists")
    }

    // Create sample products
    const sampleProducts = [
      {
        title: "Premium UI Kit",
        description:
          "A comprehensive UI kit with 100+ components for modern web applications. Includes React, Vue, and Angular versions.",
        price: 49.99,
        category: "Design",
        tags: ["ui-kit", "react", "vue", "angular", "components"],
        images: ["/modern-ui-kit-dashboard.png"],
        files: [
          { name: "ui-kit-react.zip", url: "/files/ui-kit-react.zip", size: "15.2 MB" },
          { name: "ui-kit-vue.zip", url: "/files/ui-kit-vue.zip", size: "14.8 MB" },
        ],
        secrets: { apiKey: "uk_live_123456789", documentation: "https://docs.example.com/ui-kit" },
        isPaid: true,
        slug: "premium-ui-kit",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "E-commerce Template",
        description:
          "Complete e-commerce solution with Next.js, Stripe integration, and admin dashboard. Perfect for launching your online store.",
        price: 79.99,
        category: "Templates",
        tags: ["nextjs", "ecommerce", "stripe", "template", "admin"],
        images: ["/ecommerce-website-template.png"],
        files: [{ name: "ecommerce-template.zip", url: "/files/ecommerce-template.zip", size: "25.4 MB" }],
        secrets: { stripeKey: "sk_test_123456789", adminPassword: "admin2024" },
        isPaid: true,
        slug: "ecommerce-template",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Free Icon Pack",
        description: "Beautiful collection of 500+ free icons in SVG format. Perfect for web and mobile applications.",
        price: 0,
        category: "Design",
        tags: ["icons", "svg", "free", "web", "mobile"],
        images: ["/icon-pack-collection.png"],
        files: [{ name: "free-icons.zip", url: "/files/free-icons.zip", size: "8.7 MB" }],
        secrets: {},
        isPaid: false,
        slug: "free-icon-pack",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "SaaS Starter Kit",
        description:
          "Complete SaaS application starter with authentication, billing, and multi-tenancy. Built with Next.js and Supabase.",
        price: 129.99,
        category: "Templates",
        tags: ["saas", "nextjs", "supabase", "auth", "billing"],
        images: ["/saas-application-dashboard.png"],
        files: [{ name: "saas-starter.zip", url: "/files/saas-starter.zip", size: "32.1 MB" }],
        secrets: { supabaseKey: "sb_123456789", webhookSecret: "whsec_123456789" },
        isPaid: true,
        slug: "saas-starter-kit",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Mobile App Wireframes",
        description: "Professional wireframe templates for iOS and Android apps. Includes 50+ screens and components.",
        price: 29.99,
        category: "Design",
        tags: ["wireframes", "mobile", "ios", "android", "figma"],
        images: ["/mobile-app-wireframes.png"],
        files: [{ name: "mobile-wireframes.fig", url: "/files/mobile-wireframes.fig", size: "12.3 MB" }],
        secrets: { figmaToken: "fig_123456789" },
        isPaid: true,
        slug: "mobile-app-wireframes",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Free Landing Page",
        description: "Modern landing page template built with Tailwind CSS. Fully responsive and customizable.",
        price: 0,
        category: "Templates",
        tags: ["landing-page", "tailwind", "free", "responsive"],
        images: ["/modern-landing-page.png"],
        files: [{ name: "landing-page.zip", url: "/files/landing-page.zip", size: "5.2 MB" }],
        secrets: {},
        isPaid: false,
        slug: "free-landing-page",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    console.log("[v0] Creating sample products...")
    let createdCount = 0
    let existingCount = 0

    for (const product of sampleProducts) {
      const exists = await db.collection("products").findOne({ slug: product.slug })
      if (!exists) {
        const result = await db.collection("products").insertOne(product)
        console.log(`[v0] ✓ Created product: ${product.title} (ID: ${result.insertedId})`)
        createdCount++
      } else {
        console.log(`[v0] - Product already exists: ${product.title}`)
        existingCount++
      }
    }

    console.log(`[v0] Products summary: ${createdCount} created, ${existingCount} already existed`)
    console.log("[v0] Database seeded successfully!")

    const totalUsers = await db.collection("users").countDocuments()
    const totalProducts = await db.collection("products").countDocuments()
    console.log(`[v0] Final counts - Users: ${totalUsers}, Products: ${totalProducts}`)
  } catch (error) {
    console.error("[v0] Error seeding database:", error)
    if (error.message) {
      console.error("[v0] Error message:", error.message)
    }
    process.exit(1)
  } finally {
    console.log("[v0] Closing database connection...")
    await client.close()
    console.log("[v0] Database connection closed")
  }
}

seedDatabase()
