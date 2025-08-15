import { MongoClient, type Db } from "mongodb"

let client: MongoClient
let clientPromise: Promise<MongoClient>

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI
  console.log("[v0] Checking MongoDB URI:", uri ? "URI found" : "URI missing")

  if (!uri) {
    console.error("[v0] MONGODB_URI environment variable is missing")
    throw new Error(
      "Missing MONGODB_URI environment variable. Please add it in Vercel Project Settings > Environment Variables",
    )
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.error("[v0] Invalid MongoDB URI format")
    throw new Error("Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://")
  }

  return uri
}

function initializeClient(): Promise<MongoClient> {
  const uri = getMongoUri()

  console.log("[v0] Initializing MongoDB connection...")

  const connectionOptions = {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    w: "majority",
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

    await client.db("admin").command({ ping: 1 })
    console.log("[v0] MongoDB connection verified")

    const db = client.db("1place")
    console.log("[v0] Database connection established to '1place'")

    return db
  } catch (error) {
    console.error("[v0] Database connection error:", error)

    if (error instanceof Error) {
      if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
        throw new Error("Cannot reach MongoDB server. Check your connection string and network.")
      }
      if (error.message.includes("authentication failed") || error.message.includes("auth")) {
        throw new Error("MongoDB authentication failed. Check your username and password.")
      }
      if (error.message.includes("timeout") || error.message.includes("timed out")) {
        throw new Error("MongoDB connection timeout. Server may be overloaded or unreachable.")
      }
      if (error.message.includes("ECONNREFUSED")) {
        throw new Error("MongoDB connection refused. Check if the server is running.")
      }
    }

    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
