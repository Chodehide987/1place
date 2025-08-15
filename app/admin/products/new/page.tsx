"use client"

import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ProductForm } from "@/components/products/product-form"
import { useState } from "react"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (productData: any) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        router.push("/admin/products")
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to create product")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/products")
  }

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
            <p className="text-muted-foreground">Add a new digital product to your marketplace</p>
          </div>
          <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}
