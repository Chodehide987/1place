import { AuthGuard } from "@/components/auth/auth-guard"
import { UserDashboard } from "@/components/user/user-dashboard"
import { Header } from "@/components/layout/header"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <UserDashboard />
        </div>
      </AuthGuard>
    </div>
  )
}
