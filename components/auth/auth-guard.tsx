"use client"

import type React from "react"

import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  redirectTo?: string
}

export function AuthGuard({ children, requireAdmin = false, redirectTo = "/login" }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (!isLoading && !hasRedirected) {
      if (!user) {
        setHasRedirected(true)
        router.push(redirectTo)
        return
      }

      if (requireAdmin && user.role !== "admin") {
        setHasRedirected(true)
        router.push("/")
        return
      }
    }
  }, [user, isLoading, requireAdmin, redirectTo, router, hasRedirected])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-center text-muted-foreground">Authentication required. Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requireAdmin && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-center text-muted-foreground">Admin access required. Redirecting to home...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
