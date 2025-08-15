"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ExternalLink, Search, Lock, Unlock } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/models/product"

interface UserLibraryProduct extends Product {
  hasAccess: boolean
  grantedAt?: Date
}

export function UserLibrary() {
  const [products, setProducts] = useState<UserLibraryProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchUserLibrary()
  }, [])

  const fetchUserLibrary = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/user/library", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Failed to fetch user library:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const accessibleProducts = filteredProducts.filter((p) => p.hasAccess)
  const lockedProducts = filteredProducts.filter((p) => !p.hasAccess && p.isPaid)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted animate-pulse rounded mb-3" />
                <div className="h-3 w-full bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Library</h2>
          <p className="text-muted-foreground">Your purchased and free products</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="accessible" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accessible" className="flex items-center gap-2">
            <Unlock className="h-4 w-4" />
            Accessible ({accessibleProducts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="locked" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Locked ({lockedProducts?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accessible" className="space-y-4">
          {(accessibleProducts?.length || 0) > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accessibleProducts.map((product) => (
                <LibraryProductCard key={product._id?.toString()} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Unlock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No accessible products</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm
                    ? "No products found matching your search."
                    : "You don't have access to any products yet."}
                </p>
                <Link href="/products">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          {(lockedProducts?.length || 0) > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lockedProducts.map((product) => (
                <LibraryProductCard key={product._id?.toString()} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No locked products</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm ? "No locked products found matching your search." : "All your products are accessible!"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LibraryProductCard({ product }: { product: UserLibraryProduct }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
            <CardDescription>{product.category}</CardDescription>
          </div>
          <div className="flex flex-col gap-1">
            {product.isPaid && <Badge variant="secondary">Paid</Badge>}
            {product.hasAccess ? (
              <Badge variant="default" className="bg-green-500">
                <Unlock className="h-3 w-3 mr-1" />
                Unlocked
              </Badge>
            ) : (
              <Badge variant="destructive">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {product.coverImage && (
          <div className="w-full h-32 bg-muted rounded-md mb-3 overflow-hidden">
            <img
              src={product.coverImage || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{product.shortDescription}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {(product.tags || []).slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {(product.tags?.length || 0) > 3 && (
            <Badge variant="outline" className="text-xs">
              +{(product.tags?.length || 0) - 3}
            </Badge>
          )}
        </div>

        {product.hasAccess && (
          <div className="space-y-2">
            {(product.downloadableFiles?.length || 0) > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Download className="h-3 w-3" />
                {product.downloadableFiles?.length || 0} downloadable files
              </div>
            )}
            {(product.externalLinks?.length || 0) > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                {product.externalLinks?.length || 0} external links
              </div>
            )}
          </div>
        )}
      </CardContent>

      <div className="p-6 pt-0">
        <Link href={`/products/${product.slug}`} className="w-full">
          <Button className="w-full" variant={product.hasAccess ? "default" : "outline"}>
            {product.hasAccess ? "Access Product" : "View Details"}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
