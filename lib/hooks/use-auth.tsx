"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { UserSession } from "@/lib/models/user"

interface AuthContextType {
  user: UserSession | null
  isLoading: boolean
  login: (token: string) => Promise<UserSession | null>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return data.user // Return user data for immediate use
      } else {
        localStorage.removeItem("token")
        setUser(null)
        return null
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch user:", error)
      }
      localStorage.removeItem("token")
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUser(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (token: string) => {
    localStorage.setItem("token", token)
    return await fetchUser(token)
  }

  const logout = () => {
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
