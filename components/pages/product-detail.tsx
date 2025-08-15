"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SecureFileList } from "@/components/products/secure-file-list"
import { ProductCard } from "@/components/products/product-card"
import { ArrowLeft, Calendar, Tag, Package } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import type { Product } from "@/lib/models/product"

interface ProductDetailProps {
  slug: string
}

interface ProductDetailData {
  product: Product
  hasAccess: boolean
  isAuthenticated: boolean
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const [data, setData] = useState<ProductDetailData | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProductDetail()
  }, [slug])

  const fetchProductDetail = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers: HeadersInit = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`/api/products/slug/${slug}`, { headers })

      if (response.ok) {
        const productData = await response.json()
        setData(productData)

        // Fetch related products
        if (productData.product.category) {
          const relatedResponse = await fetch(`/api/products?category=${productData.product.category}&limit=4`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            setRelatedProducts(relatedData.products.filter((p: Product) => p.slug !== slug))
          }
        }
      } else {
        setError("Product not found")
      }
    } catch (err) {
      setError("Failed to load product")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-12 w-3/4 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Product Not Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { product, hasAccess, isAuthenticated } = data

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      {/* Product Header */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-lg text-muted-foreground">{product.shortDescription}</p>
            </div>
            <div className="flex flex-col gap-2">
              {product.isPaid ? <Badge variant="secondary">Paid</Badge> : <Badge variant="default">Free</Badge>}
              {hasAccess && (
                <Badge variant="default" className="bg-green-500">
                  Access Granted
                </Badge>
              )}
            </div>
          </div>

          {/* Cover Image */}
          {product.coverImage && (
            <div className="w-full h-64 bg-muted rounded-lg overflow-hidden mb-6">
              <img
                src={product.coverImage || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Gallery Images */}
          {(product.galleryImages?.length || 0) > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {(product.galleryImages || []).map((image, index) => (
                <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Category: {product.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Created: {new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Version: {product.version}</span>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {(product.tags || []).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {!hasAccess && product.isPaid && (
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Get Access</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This is a paid product. Contact an administrator to get access.
                </p>
                {!isAuthenticated && (
                  <Link href="/login">
                    <Button className="w-full">Sign In to Continue</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Product Description */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{product.fullDescription}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Changelog */}
      {product.changelog && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changelog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{product.changelog}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files and Secrets */}
      <SecureFileList product={product} hasAccess={hasAccess} isAuthenticated={isAuthenticated} />

      {/* Related Products */}
      {(relatedProducts?.length || 0) > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id?.toString()} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
