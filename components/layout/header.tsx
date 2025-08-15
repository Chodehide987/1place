"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/hooks/use-auth"
import { Search, Menu, User, LogOut, Settings, Library } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout, isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
            <span className="text-primary-foreground font-bold text-sm">1P</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            1Place
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
          >
            Products
          </Link>
          <Link
            href="/products?category=Discord%20Bots"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
          >
            Discord Bots
          </Link>
          <Link
            href="/products?category=Minecraft"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
          >
            Minecraft
          </Link>
          <Link
            href="/products?category=Templates"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
          >
            Templates
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:bg-card focus:border-primary/50 transition-all duration-200"
            />
          </div>
        </form>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-card/80 transition-all duration-200"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline font-medium">{user.name}</span>
                  {isAdmin && (
                    <Badge
                      variant="secondary"
                      className="hidden sm:inline bg-gradient-to-r from-secondary/20 to-accent/20 text-secondary-foreground border-secondary/30"
                    >
                      Admin
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-sm border-border/50">
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-card/80">
                  <Link href="/account">
                    <Library className="h-4 w-4 mr-2" />
                    My Library
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-card/80">
                    <Link href="/admin">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="cursor-pointer hover:bg-destructive/10 text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover:bg-card/80 transition-all duration-200">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-card/80 transition-all duration-200">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card/95 backdrop-blur-sm border-border/50">
              <div className="flex flex-col gap-6 mt-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background/50 border-border/50"
                  />
                  <Button type="submit" size="icon" className="bg-gradient-to-r from-primary to-secondary">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/products"
                    className="text-sm font-medium py-3 px-2 rounded-md hover:bg-card/80 transition-colors"
                  >
                    All Products
                  </Link>
                  <Link
                    href="/products?category=Discord%20Bots"
                    className="text-sm font-medium py-3 px-2 rounded-md hover:bg-card/80 transition-colors"
                  >
                    Discord Bots
                  </Link>
                  <Link
                    href="/products?category=Minecraft"
                    className="text-sm font-medium py-3 px-2 rounded-md hover:bg-card/80 transition-colors"
                  >
                    Minecraft
                  </Link>
                  <Link
                    href="/products?category=Templates"
                    className="text-sm font-medium py-3 px-2 rounded-md hover:bg-card/80 transition-colors"
                  >
                    Templates
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
