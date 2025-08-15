import { Header } from "@/components/layout/header"
import { ProductDetail } from "@/components/pages/product-detail"

interface ProductPageProps {
  params: { slug: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductDetail slug={params.slug} />
    </div>
  )
}
