import { ReactNode } from "react"
import AdminBottomNav from "@/components/AdminBottomNav"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
      <AdminBottomNav />
    </div>
  )
}

