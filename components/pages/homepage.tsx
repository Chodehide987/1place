"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/products/product-card"
import { ArrowRight, Package, Users, Star, TrendingUp, Sparkles } from "lucide-react"
import type { Product } from "@/lib/models/product"

export function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log("[v0] Fetching products for homepage...")
      const [featuredResponse, recentResponse] = await Promise.all([
        fetch("/api/products?limit=6"),
        fetch("/api/products?limit=8"),
      ])

      console.log("[v0] Featured response status:", featuredResponse.status)
      console.log("[v0] Recent response status:", recentResponse.status)

      if (featuredResponse.ok && recentResponse.ok) {
        const featuredData = await featuredResponse.json()
        const recentData = await recentResponse.json()
        console.log("[v0] Featured products:", featuredData.products?.length || 0)
        console.log("[v0] Recent products:", recentData.products?.length || 0)
        setFeaturedProducts(featuredData.products?.slice(0, 6) || [])
        setRecentProducts(recentData.products || [])
      } else {
        console.error(
          "[v0] Failed to fetch products - Featured:",
          featuredResponse.status,
          "Recent:",
          recentResponse.status,
        )
      }
    } catch (error) {
      console.error("[v0] Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const showEmptyState = !isLoading && featuredProducts.length === 0

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl opacity-30" />

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">Welcome to the future of digital products</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            One Place for All Your
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Digital Products
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover, download, and distribute Discord bots, Minecraft resources, website templates, and more.
            Everything you need in one premium marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 border-b border-border/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-sm text-muted-foreground font-medium">Digital Products</div>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-muted-foreground font-medium">Happy Users</div>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                4.9
              </div>
              <div className="text-sm text-muted-foreground font-medium">Average Rating</div>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm text-muted-foreground font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Popular Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our most popular product categories and find exactly what you need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/products?category=Discord%20Bots">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:scale-105">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <span className="text-white text-lg font-bold">DB</span>
                    </div>
                    Discord Bots
                  </CardTitle>
                  <CardDescription className="text-base">Ready-to-use Discord bot codes and templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 border-blue-500/20"
                    >
                      50+ Products
                    </Badge>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/products?category=Minecraft">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:scale-105">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <span className="text-white text-lg font-bold">MC</span>
                    </div>
                    Minecraft Resources
                  </CardTitle>
                  <CardDescription className="text-base">Plugins, mods, and server configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-600 border-green-500/20"
                    >
                      30+ Products
                    </Badge>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/products?category=Templates">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:scale-105">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <span className="text-white text-lg font-bold">WT</span>
                    </div>
                    Web Templates
                  </CardTitle>
                  <CardDescription className="text-base">Website and portfolio templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-600 border-purple-500/20"
                    >
                      25+ Products
                    </Badge>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gradient-to-b from-card/30 to-background border-y border-border/50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-lg text-muted-foreground">Hand-picked products from our premium marketplace</p>
            </div>
            <Link href="/products">
              <Button
                variant="outline"
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <div className="h-5 w-3/4 bg-muted/50 animate-pulse rounded-md" />
                    <div className="h-4 w-1/2 bg-muted/50 animate-pulse rounded-md" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-36 bg-muted/50 animate-pulse rounded-lg mb-4" />
                    <div className="h-4 w-full bg-muted/50 animate-pulse rounded-md mb-2" />
                    <div className="h-4 w-2/3 bg-muted/50 animate-pulse rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : showEmptyState ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">No Products Yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Get started by running the database seeding script to add sample products, or create your first product
                as an admin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/admin">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    Go to Admin Panel
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id?.toString()} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl opacity-40" />

        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers and creators who trust 1Place for their digital product needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Create Free Account
              </Button>
            </Link>
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
