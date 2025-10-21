"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"

const salaryData = [
  {
    id: "EMP001",
    name: "Alex Johnson",
    department: "Engineering",
    salary: "$8,500",
    lastPaid: "June 30, 2024",
    status: "Paid",
  },
  {
    id: "EMP002",
    name: "Sarah Williams",
    department: "Sales",
    salary: "$7,500",
    lastPaid: "June 30, 2024",
    status: "Paid",
  },
  {
    id: "EMP003",
    name: "Mike Chen",
    department: "Engineering",
    salary: "$7,000",
    lastPaid: "June 30, 2024",
    status: "Paid",
  },
  {
    id: "EMP004",
    name: "Emma Davis",
    department: "Marketing",
    salary: "$6,500",
    lastPaid: "June 30, 2024",
    status: "Paid",
  },
  {
    id: "EMP005",
    name: "John Smith",
    department: "HR",
    salary: "$6,800",
    lastPaid: "June 30, 2024",
    status: "Pending",
  },
]

export default function SalaryPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold mb-2">Salary Management</h1>
          <p className="text-muted">Manage employee salaries and payroll</p>
        </div>
        <NeonButton variant="primary">Process Payroll</NeonButton>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="hover-glow">
          <p className="text-muted text-sm mb-2">Total Monthly Payroll</p>
          <p className="font-heading text-3xl font-bold text-primary">$935,000</p>
        </GlassCard>

        <GlassCard className="hover-glow">
          <p className="text-muted text-sm mb-2">Paid This Month</p>
          <p className="font-heading text-3xl font-bold text-primary">$927,500</p>
        </GlassCard>

        <GlassCard className="hover-glow">
          <p className="text-muted text-sm mb-2">Pending Payments</p>
          <p className="font-heading text-3xl font-bold text-accent">$7,500</p>
        </GlassCard>
      </div>

      {/* Salary Table */}
      <GlassCard className="hover-glow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Employee ID</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Name</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Department</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Salary</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Last Paid</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Status</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.map((emp) => (
              <tr key={emp.id} className="border-b border-primary/10 hover:bg-surface/30 smooth-transition">
                <td className="px-6 py-4 text-sm font-mono text-primary">{emp.id}</td>
                <td className="px-6 py-4 font-medium">{emp.name}</td>
                <td className="px-6 py-4 text-muted">{emp.department}</td>
                <td className="px-6 py-4 font-heading font-bold text-primary">{emp.salary}</td>
                <td className="px-6 py-4 text-muted text-sm">{emp.lastPaid}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emp.status === "Paid" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:text-primary-dark smooth-transition text-sm font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
