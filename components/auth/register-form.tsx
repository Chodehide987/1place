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
import { Sparkles, UserPlus } from "lucide-react"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        const user = await login(data.token)

        if (user) {
          // Force page reload to ensure auth state is properly updated
          window.location.href = "/account"
        } else {
          setError("Failed to authenticate user")
        }
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              1Place
            </h1>
          </div>
          <p className="text-slate-600">Join the digital marketplace community</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <UserPlus className="w-6 h-6 text-purple-600" />
              <CardTitle className="text-2xl font-bold text-slate-900">Create Account</CardTitle>
            </div>
            <CardDescription className="text-slate-600">
              Sign up to start accessing premium digital products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter your full name"
                  className="h-12 border-slate-200/60 bg-white/70 backdrop-blur-sm focus:border-purple-500 focus:ring-purple-500/20 focus:bg-white/90 text-slate-900 placeholder:text-slate-500"
                />
              </div>

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
                  minLength={6}
                  placeholder="Create a password"
                  className="h-12 border-slate-200/60 bg-white/70 backdrop-blur-sm focus:border-purple-500 focus:ring-purple-500/20 focus:bg-white/90 text-slate-900 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  placeholder="Confirm your password"
                  className="h-12 border-slate-200/60 bg-white/70 backdrop-blur-sm focus:border-purple-500 focus:ring-purple-500/20 focus:bg-white/90 text-slate-900 placeholder:text-slate-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
