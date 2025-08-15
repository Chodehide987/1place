// Client-safe auth utilities (no Node.js dependencies)

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function generateToken(user: {
  _id: string
  email: string
  name?: string
  role: string
}): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const payload = {
    userId: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  }

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")

  const data = `${encodedHeader}.${encodedPayload}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data))
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

  return `${data}.${encodedSignature}`
}

export async function verifyToken(
  token: string,
): Promise<{ userId: string; email: string; name?: string; role: string } | null> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".")
    if (!headerB64 || !payloadB64 || !signatureB64) return null

    const data = `${headerB64}.${payloadB64}`
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    )

    const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))
    const isValid = await crypto.subtle.verify("HMAC", key, signature, encoder.encode(data))

    if (!isValid) return null

    const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")))

    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    }
  } catch {
    return null
  }
}
