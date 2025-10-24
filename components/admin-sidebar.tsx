"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CheckSquare, BarChart3, DollarSign, Settings, LogOut } from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/employees", label: "Employee Management", icon: Users },
  { href: "/admin/tasks", label: "Task Manager", icon: CheckSquare },
  { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  { href: "/admin/salary", label: "Salary Management", icon: DollarSign },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-surface border-r border-primary/20 h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-primary/20">
        <div className="font-heading text-2xl font-bold text-primary">Zacker</div>
        <p className="text-xs text-muted mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg smooth-transition ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "text-muted hover:text-foreground hover:bg-surface-light"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-primary/20">
        <Link href="/login">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:text-foreground hover:bg-surface-light smooth-transition">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </div>
        </Link>
      </div>
    </aside>
  )
}
