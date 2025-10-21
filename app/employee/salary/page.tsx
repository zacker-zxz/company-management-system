"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { DollarSign, Download } from "lucide-react"

const salaryHistory = [
  { month: "June 2024", amount: 8500, date: "June 30, 2024", status: "Credited" },
  { month: "May 2024", amount: 8500, date: "May 31, 2024", status: "Credited" },
  { month: "April 2024", amount: 8500, date: "April 30, 2024", status: "Credited" },
  { month: "March 2024", amount: 8500, date: "March 31, 2024", status: "Credited" },
  { month: "February 2024", amount: 8500, date: "February 29, 2024", status: "Credited" },
  { month: "January 2024", amount: 8500, date: "January 31, 2024", status: "Credited" },
]

export default function SalaryPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-4xl font-bold mb-2">Salary</h1>
        <p className="text-muted">View your salary information and payslips</p>
      </div>

      {/* Salary Breakdown */}
      <GlassCard className="hover-glow">
        <h2 className="font-heading text-xl font-bold mb-6">Salary Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-heading font-bold text-primary mb-4">Earnings</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted">Base Salary</span>
                <span className="font-medium">$8,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Bonus</span>
                <span className="font-medium">$500</span>
              </div>
              <div className="flex justify-between border-t border-primary/20 pt-3 mt-3">
                <span className="font-heading font-bold">Total Earnings</span>
                <span className="font-heading font-bold text-primary">$8,500</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-primary mb-4">Deductions</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted">Tax</span>
                <span className="font-medium">$850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Insurance</span>
                <span className="font-medium">$200</span>
              </div>
              <div className="flex justify-between border-t border-primary/20 pt-3 mt-3">
                <span className="font-heading font-bold">Total Deductions</span>
                <span className="font-heading font-bold text-accent">$1,050</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted text-sm mb-1">Net Salary</p>
              <p className="font-heading text-3xl font-bold text-primary">$7,450</p>
            </div>
            <DollarSign className="w-12 h-12 text-primary/50" />
          </div>
        </div>
      </GlassCard>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="hover-glow">
          <p className="text-muted text-sm mb-2">Monthly Salary</p>
          <p className="font-heading text-3xl font-bold text-primary">
            <AnimatedCounter prefix="$" end={8500} />
          </p>
        </GlassCard>

        <GlassCard className="hover-glow">
          <p className="text-muted text-sm mb-2">YTD Earnings</p>
          <p className="font-heading text-3xl font-bold text-primary">
            <AnimatedCounter prefix="$" end={51000} />
          </p>
        </GlassCard>

        <GlassCard className="hover-glow">
          <p className="text-muted text-sm mb-2">Last Credited</p>
          <p className="font-heading text-lg font-bold text-primary">June 30, 2024</p>
        </GlassCard>
      </div>

      {/* Salary History */}
      <GlassCard className="hover-glow overflow-x-auto">
        <h2 className="font-heading text-xl font-bold mb-6">Salary History</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Month</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Amount</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Credited Date</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Status</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Action</th>
            </tr>
          </thead>
          <tbody>
            {salaryHistory.map((salary, i) => (
              <tr key={i} className="border-b border-primary/10 hover:bg-surface/30 smooth-transition">
                <td className="px-6 py-4 font-medium">{salary.month}</td>
                <td className="px-6 py-4 font-heading font-bold text-primary">${salary.amount}</td>
                <td className="px-6 py-4 text-muted text-sm">{salary.date}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                    {salary.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-2 text-primary hover:text-primary-dark smooth-transition text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Download
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
