import type React from "react"
import { EmployeeSidebar } from "@/components/employee-sidebar"

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <EmployeeSidebar />
      <main className="flex-1 ml-64 bg-background min-h-screen">{children}</main>
    </div>
  )
}
