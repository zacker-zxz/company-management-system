"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  BarChart3,
  DollarSign,
  Settings,
  LogOut,
  UserPlus,
  FileText,
  TrendingUp,
  Shield,
  Bell
} from "lucide-react"

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics"
  },
  {
    href: "/admin/employees",
    label: "Employee Hub",
    icon: Users,
    description: "Manage Team Members"
  },
  {
    href: "/admin/tasks",
    label: "Task Control",
    icon: CheckSquare,
    description: "Workflow Management"
  },
  {
    href: "/admin/reports",
    label: "Analytics Pro",
    icon: BarChart3,
    description: "Performance Insights"
  },
  {
    href: "/admin/salary",
    label: "Payroll Center",
    icon: DollarSign,
    description: "Compensation Management"
  },
  {
    href: "/admin/settings",
    label: "System Config",
    icon: Settings,
    description: "Platform Settings"
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-white border-r border-blue-200 h-screen flex flex-col fixed left-0 top-0 shadow-lg">
      {/* Logo Section */}
      <div className="p-6 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-heading text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ZACKER
            </div>
            <p className="text-xs text-slate-600">Admin Control Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`group relative overflow-hidden rounded-xl smooth-transition ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 shadow-md"
                    : "hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 border border-transparent hover:border-blue-200"
                }`}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className={`p-2 rounded-lg ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                      : "bg-slate-100 text-blue-600 group-hover:bg-slate-200"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${
                      isActive ? "text-slate-800" : "text-slate-600 group-hover:text-slate-800"
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${
                      isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-600"
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full"></div>
                  )}
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-blue-200 bg-slate-50/50">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">110</div>
            <div className="text-xs text-slate-500">Employees</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <div className="text-lg font-bold text-indigo-600">247</div>
            <div className="text-xs text-slate-500">Active Tasks</div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-blue-200">
        <Link href="/login">
          <div className="flex items-center gap-4 px-5 py-4 rounded-xl text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 border border-transparent hover:border-red-300 smooth-transition group">
            <div className="p-2 rounded-lg bg-slate-100 text-red-500 group-hover:bg-red-50">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Sign Out</div>
              <div className="text-xs text-slate-500">Return to login</div>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  )
}
