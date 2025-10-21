"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Search, Edit, Trash2, Eye } from "lucide-react"

const employees = [
  {
    id: "EMP001",
    name: "Alex Johnson",
    role: "Senior Engineer",
    department: "Engineering",
    salary: "$8,500",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "Sarah Williams",
    role: "Sales Manager",
    department: "Sales",
    salary: "$7,500",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Mike Chen",
    role: "Backend Developer",
    department: "Engineering",
    salary: "$7,000",
    status: "Active",
  },
  {
    id: "EMP004",
    name: "Emma Davis",
    role: "Marketing Lead",
    department: "Marketing",
    salary: "$6,500",
    status: "Active",
  },
  { id: "EMP005", name: "John Smith", role: "HR Manager", department: "HR", salary: "$6,800", status: "On Leave" },
  {
    id: "EMP006",
    name: "Lisa Anderson",
    role: "Frontend Developer",
    department: "Engineering",
    salary: "$6,800",
    status: "Active",
  },
]

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const filteredEmployees = employees.filter((emp) => {
    const searchMatch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.id.includes(searchTerm)
    const deptMatch = departmentFilter === "all" || emp.department === departmentFilter
    return searchMatch && deptMatch
  })

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold mb-2">Employee Management</h1>
          <p className="text-muted">Manage all employees and their information</p>
        </div>
        <NeonButton variant="primary">Add New Employee</NeonButton>
      </div>

      {/* Filters */}
      <GlassCard className="hover-glow">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary smooth-transition"
              />
            </div>
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary smooth-transition"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </GlassCard>

      {/* Employees Table */}
      <GlassCard className="hover-glow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">ID</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Name</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Role</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Department</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Salary</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Status</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-b border-primary/10 hover:bg-surface/30 smooth-transition">
                <td className="px-6 py-4 text-sm font-mono text-primary">{emp.id}</td>
                <td className="px-6 py-4 font-medium">{emp.name}</td>
                <td className="px-6 py-4 text-muted">{emp.role}</td>
                <td className="px-6 py-4 text-muted">{emp.department}</td>
                <td className="px-6 py-4 font-medium text-primary">{emp.salary}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emp.status === "Active" ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-surface/50 rounded-lg smooth-transition text-primary hover:text-primary-dark">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-surface/50 rounded-lg smooth-transition text-primary hover:text-primary-dark">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-surface/50 rounded-lg smooth-transition text-accent hover:text-accent/80">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
