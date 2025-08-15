import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Download, ExternalLink, Star } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/models/product"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col group hover:shadow-2xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:scale-[1.02] hover:border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 font-medium">{product.category}</p>
          </div>
          {product.isPaid ? (
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-secondary/20 to-accent/20 text-secondary-foreground border-secondary/30 shadow-sm"
            >
              Paid
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-600 border-green-500/20"
            >
              Free
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        {product.coverImage && (
          <div className="w-full h-36 bg-gradient-to-br from-muted/50 to-muted/80 rounded-lg mb-4 overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
            <img
              src={product.coverImage || "/placeholder.svg?height=144&width=320&query=product+cover"}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{product.shortDescription}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-background/50 hover:bg-primary/10 transition-colors duration-200"
            >
              {tag}
            </Badge>
          ))}
          {product.tags.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20"
            >
              +{product.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(product.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" />
            {product.downloadableFiles.length} files
          </div>
          {product.externalLinks.length > 0 && (
            <div className="flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              {product.externalLinks.length} links
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`/products/${product.slug}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-105">
            View Details
            <Star className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
