"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Clock, TrendingUp, DollarSign, User, LogOut } from "lucide-react"

const navItems = [
  { href: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employee/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/employee/attendance", label: "Attendance", icon: Clock },
  { href: "/employee/performance", label: "Performance", icon: TrendingUp },
  { href: "/employee/salary", label: "Salary", icon: DollarSign },
  { href: "/employee/profile", label: "Profile", icon: User },
]

export function EmployeeSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-surface border-r border-primary/20 h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-primary/20">
        <div className="font-heading text-2xl font-bold gradient-text">ZACKER</div>
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
