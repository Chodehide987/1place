import { MongoClient, type Db } from "mongodb"

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI
  console.log("[v0] Checking MongoDB URI:", uri ? "URI found" : "URI missing")

  if (!uri) {
    console.error(
      "[v0] Available environment variables:",
      Object.keys(process.env).filter((key) => key.includes("MONGO")),
    )
    console.error("[v0] MONGODB_URI environment variable is missing")
    throw new Error(
      'Invalid/Missing environment variable: "MONGODB_URI". Please add your MongoDB connection string to Vercel environment variables',
    )
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.error("[v0] Invalid MongoDB URI format:", uri.substring(0, 20) + "...")
    throw new Error("Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://")
  }

  console.log(
    "[v0] MongoDB URI format:",
    uri.startsWith("mongodb+srv://") ? "Atlas (mongodb+srv://)" : "Standard (mongodb://)",
  )
  return uri
}

function initializeClient(): Promise<MongoClient> {
  const uri = getMongoUri() // Lazy check for MONGODB_URI

  console.log("[v0] Initializing MongoDB connection...")
  console.log("[v0] Environment:", process.env.NODE_ENV)

  const connectionOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
  }

  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, connectionOptions)
      globalWithMongo._mongoClientPromise = client.connect()
      console.log("[v0] MongoDB client created (development)")
    }
    return globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, connectionOptions)
    console.log("[v0] MongoDB client created (production)")
    return client.connect()
  }
}

export default function getClientPromise(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = initializeClient()
  }
  return clientPromise
}

export async function getDatabase(): Promise<Db> {
  try {
    console.log("[v0] Getting database connection...")
    const client = await getClientPromise()

    // Test connection with timeout
    await Promise.race([
      client.db("admin").command({ ping: 1 }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 10000)),
    ])

    console.log("[v0] MongoDB connection verified")
    const db = client.db("1place")
    console.log("[v0] Database connection established to '1place'")

    try {
      const collections = await db.listCollections().toArray()
      console.log(
        "[v0] Available collections:",
        collections.map((c) => c.name),
      )
    } catch (listError) {
      console.warn("[v0] Could not list collections:", listError)
    }

    return db
  } catch (error) {
    console.error("[v0] Database connection error:", error)
    if (error instanceof Error) {
      if (error.message.includes("ENOTFOUND")) {
        throw new Error("MongoDB server not found. Check your connection string.")
      }
      if (error.message.includes("authentication failed")) {
        throw new Error("MongoDB authentication failed. Check your credentials.")
      }
      if (error.message.includes("timeout")) {
        throw new Error("MongoDB connection timeout. Check your network connection.")
      }
    }
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
