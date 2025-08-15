import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminProductList } from "@/components/admin/admin-product-list"

export default function AdminProductsPage() {
  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <AdminProductList />
      </AdminLayout>
    </AuthGuard>
  )
}
