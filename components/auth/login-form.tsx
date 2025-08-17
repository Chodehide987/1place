"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/hooks/use-auth"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Starting login process")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("[v0] Login response:", { success: response.ok, hasToken: !!data.token })

      if (response.ok) {
        const user = await login(data.token)
        console.log("[v0] User authenticated:", { userId: user?.id, role: user?.role })

        if (user) {
          if (user.role === "admin") {
            router.push("/admin")
            router.refresh()
          } else {
            router.push("/account")
            router.refresh()
          }
        } else {
          setError("Failed to authenticate user")
        }
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-slate-900">Sign In</CardTitle>
        <CardDescription className="text-slate-600">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your email"
              className="h-12 border-slate-200/60 bg-white/70 backdrop-blur-sm focus:border-purple-500 focus:ring-purple-500/20 focus:bg-white/90 text-slate-900 placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your password"
              className="h-12 border-slate-200/60 bg-white/70 backdrop-blur-sm focus:border-purple-500 focus:ring-purple-500/20 focus:bg-white/90 text-slate-900 placeholder:text-slate-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
