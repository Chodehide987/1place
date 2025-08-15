import { Header } from "@/components/layout/header"
import { Homepage } from "@/components/pages/homepage"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Homepage />
    </div>
  )
}
