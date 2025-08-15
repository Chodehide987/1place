"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { UserSession } from "@/lib/models/user"

interface AuthContextType {
  user: UserSession | null
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = async (token: string) => {
    try {
      console.log("[v0] Fetching user with token")
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("[v0] Auth me response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] User data received:", data.user)
        setUser(data.user)
      } else {
        console.log("[v0] Auth failed, removing token")
        localStorage.removeItem("token")
        setUser(null)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch user:", error)
      localStorage.removeItem("token")
      setUser(null)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    console.log("[v0] Auth provider initialized, token exists:", !!token)
    if (token) {
      fetchUser(token)
    }
    setIsLoading(false)
  }, [])

  const login = (token: string) => {
    console.log("[v0] Login called with token")
    localStorage.setItem("token", token)
    fetchUser(token)
  }

  const logout = () => {
    console.log("[v0] Logout called")
    localStorage.removeItem("token")
    setUser(null)
  }

  const isAdmin = user?.role === "admin"

  return <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
