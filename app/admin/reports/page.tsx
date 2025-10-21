"use client"

import { GlassCard } from "@/components/ui/glass-card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const salaryDistribution = [
  { range: "$5k-$6k", count: 25 },
  { range: "$6k-$7k", count: 35 },
  { range: "$7k-$8k", count: 30 },
  { range: "$8k-$9k", count: 15 },
  { range: "$9k+", count: 5 },
]

const departmentAttendance = [
  { department: "Engineering", rate: 96 },
  { department: "Sales", rate: 93 },
  { department: "Marketing", rate: 94 },
  { department: "HR", rate: 98 },
]

const monthlyMetrics = [
  { month: "Jan", employees: 100, tasks: 150, attendance: 91 },
  { month: "Feb", employees: 102, tasks: 165, attendance: 92 },
  { month: "Mar", employees: 105, tasks: 180, attendance: 91 },
  { month: "Apr", employees: 107, tasks: 195, attendance: 94 },
  { month: "May", employees: 108, tasks: 210, attendance: 93 },
  { month: "Jun", employees: 110, tasks: 230, attendance: 96 },
]

const COLORS = ["#00ffff", "#00bfff", "#ff006e", "#a0a0a0", "#808080"]

export default function ReportsPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-4xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-muted">Comprehensive analytics and reporting dashboard</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="hover-glow">
          <h2 className="font-heading text-xl font-bold mb-6">Salary Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
              <XAxis stroke="rgba(160, 160, 160, 0.5)" />
              <YAxis stroke="rgba(160, 160, 160, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(26, 31, 58, 0.8)",
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#00ffff" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="hover-glow">
          <h2 className="font-heading text-xl font-bold mb-6">Department Attendance Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
              <XAxis stroke="rgba(160, 160, 160, 0.5)" />
              <YAxis stroke="rgba(160, 160, 160, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(26, 31, 58, 0.8)",
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="rate" fill="#00bfff" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Monthly Metrics */}
      <GlassCard className="hover-glow">
        <h2 className="font-heading text-xl font-bold mb-6">Monthly Metrics Trend</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
            <XAxis stroke="rgba(160, 160, 160, 0.5)" />
            <YAxis stroke="rgba(160, 160, 160, 0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(26, 31, 58, 0.8)",
                border: "1px solid rgba(0, 255, 255, 0.3)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="employees" stroke="#00ffff" strokeWidth={2} />
            <Line type="monotone" dataKey="tasks" stroke="#00bfff" strokeWidth={2} />
            <Line type="monotone" dataKey="attendance" stroke="#ff006e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="hover-glow">
          <h3 className="font-heading font-bold text-primary mb-4">Total Payroll</h3>
          <p className="font-heading text-3xl font-bold">$935,000</p>
          <p className="text-xs text-muted mt-2">Monthly expenditure</p>
        </GlassCard>

        <GlassCard className="hover-glow">
          <h3 className="font-heading font-bold text-primary mb-4">Task Completion Rate</h3>
          <p className="font-heading text-3xl font-bold">87%</p>
          <p className="text-xs text-muted mt-2">↑ 5% from last month</p>
        </GlassCard>

        <GlassCard className="hover-glow">
          <h3 className="font-heading font-bold text-primary mb-4">Employee Satisfaction</h3>
          <p className="font-heading text-3xl font-bold">4.6/5</p>
          <p className="text-xs text-muted mt-2">Based on surveys</p>
        </GlassCard>
      </div>
    </div>
  )
}
