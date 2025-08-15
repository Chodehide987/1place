import { headers } from "next/headers"
import { verifyToken } from "@/lib/auth/client"

export async function getAuthenticatedUser() {
  const headersList = headers()
  const authorization = headersList.get("authorization")
  const token = authorization?.replace("Bearer ", "")

  if (!token) {
    return null
  }

  return await verifyToken(token)
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim()
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}

export function generateSecureToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return ["http:", "https:"].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}
