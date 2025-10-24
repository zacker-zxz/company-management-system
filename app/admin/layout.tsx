import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background">
      <AdminSidebar />
      <main className="flex-1 ml-72 bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen">{children}</main>
    </div>
  )
}
