import { getDatabase } from "@/lib/mongodb"
import type { Product } from "@/lib/models/product"
import { ObjectId } from "mongodb"
import { encrypt, decrypt } from "./encryption"

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function createProduct(
  productData: Omit<Product, "_id" | "createdAt" | "updatedAt" | "slug">,
): Promise<Product> {
  const db = await getDatabase()

  // Generate unique slug
  const baseSlug = generateSlug(productData.title)
  let slug = baseSlug
  let counter = 1

  while (await db.collection<Product>("products").findOne({ slug })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  // Encrypt secrets
  const encryptedSecrets = productData.secrets.map((secret) => ({
    ...secret,
    value: encrypt(secret.value),
  }))

  const product: Product = {
    ...productData,
    slug,
    secrets: encryptedSecrets,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection<Product>("products").insertOne(product)
  return { ...product, _id: result.insertedId }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await getDatabase()

  // If title is being updated, regenerate slug
  if (updates.title) {
    const baseSlug = generateSlug(updates.title)
    let slug = baseSlug
    let counter = 1

    while (
      await db.collection<Product>("products").findOne({
        slug,
        _id: { $ne: new ObjectId(id) },
      })
    ) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    updates.slug = slug
  }

  // Encrypt secrets if provided
  if (updates.secrets) {
    updates.secrets = updates.secrets.map((secret) => ({
      ...secret,
      value: encrypt(secret.value),
    }))
  }

  updates.updatedAt = new Date()

  const result = await db
    .collection<Product>("products")
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updates }, { returnDocument: "after" })

  return result || null
}

export async function getProductBySlug(slug: string, decryptSecrets = false): Promise<Product | null> {
  const db = await getDatabase()
  const product = await db.collection<Product>("products").findOne({ slug })

  if (!product) return null

  if (decryptSecrets && product.secrets) {
    product.secrets = product.secrets.map((secret) => ({
      ...secret,
      value: decrypt(secret.value),
    }))
  }

  return product
}

export async function getProducts(
  filters: {
    category?: string
    tags?: string[]
    search?: string
    isPaid?: boolean
    limit?: number
    skip?: number
  } = {},
): Promise<{ products: Product[]; total: number }> {
  const db = await getDatabase()

  const query: any = {}

  if (filters.category) {
    query.category = filters.category
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags }
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { shortDescription: { $regex: filters.search, $options: "i" } },
      { tags: { $in: [new RegExp(filters.search, "i")] } },
    ]
  }

  if (filters.isPaid !== undefined) {
    query.isPaid = filters.isPaid
  }

  const total = await db.collection<Product>("products").countDocuments(query)

  const products = await db
    .collection<Product>("products")
    .find(query)
    .sort({ createdAt: -1 })
    .skip(filters.skip || 0)
    .limit(filters.limit || 20)
    .toArray()

  return { products, total }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection<Product>("products").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

export async function getProductCategories(): Promise<string[]> {
  const db = await getDatabase()
  const categories = await db.collection<Product>("products").distinct("category")
  return categories.sort()
}

export async function getProductTags(): Promise<string[]> {
  const db = await getDatabase()
  const tags = await db.collection<Product>("products").distinct("tags")
  return tags.sort()
}
