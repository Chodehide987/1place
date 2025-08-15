import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { ProductListing } from "@/components/pages/product-listing"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function ProductListingFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64">
          <Card>
            <CardHeader>
              <div className="h-6 w-20 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-20 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
        <div className="flex-1">
          <div className="mb-6">
            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-muted animate-pulse rounded mb-3" />
                  <div className="h-3 w-full bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<ProductListingFallback />}>
        <ProductListing />
      </Suspense>
    </div>
  )
}
