import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </AuthGuard>
  )
}
