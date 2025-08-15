import { AuthGuard } from "@/components/auth/auth-guard"
import { UserDashboard } from "@/components/user/user-dashboard"

export default function AccountPage() {
  return (
    <AuthGuard>
      <UserDashboard />
    </AuthGuard>
  )
}
