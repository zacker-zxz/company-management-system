"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { PageTransition } from "@/components/ui/page-transition"
import { StaggerContainer } from "@/components/ui/stagger-container"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Users, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

const departmentData = [
  { name: "Engineering", value: 45 },
  { name: "Sales", value: 30 },
  { name: "Marketing", value: 20 },
  { name: "HR", value: 15 },
]

const attendanceData = [
  { month: "Jan", rate: 92 },
  { month: "Feb", rate: 94 },
  { month: "Mar", rate: 91 },
  { month: "Apr", rate: 95 },
  { month: "May", rate: 93 },
  { month: "Jun", rate: 96 },
]

const performanceData = [
  { department: "Engineering", avg: 92 },
  { department: "Sales", avg: 88 },
  { department: "Marketing", avg: 85 },
  { department: "HR", avg: 90 },
]

const COLORS = ["#00ffff", "#00bfff", "#ff006e", "#a0a0a0"]

export default function AdminDashboard() {
  return (
    <PageTransition>
      <div className="p-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-heading text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted">Overview of company metrics and performance</p>
        </motion.div>

        {/* Key Metrics */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="hover-glow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-sm mb-2">Total Employees</p>
                <div className="font-heading text-3xl font-bold text-primary">
                  <AnimatedCounter end={110} />
                </div>
                <p className="text-xs text-muted mt-2">↑ 5 new this month</p>
              </div>
              <Users className="w-8 h-8 text-primary/50" />
            </div>
          </GlassCard>

          <GlassCard className="hover-glow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-sm mb-2">Active Tasks</p>
                <div className="font-heading text-3xl font-bold text-primary">
                  <AnimatedCounter end={247} />
                </div>
                <p className="text-xs text-muted mt-2">42 completed this week</p>
              </div>
              <CheckCircle className="w-8 h-8 text-primary/50" />
            </div>
          </GlassCard>

          <GlassCard className="hover-glow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-sm mb-2">Avg Attendance</p>
                <div className="font-heading text-3xl font-bold text-primary">
                  <AnimatedCounter end={96} suffix="%" />
                </div>
                <p className="text-xs text-muted mt-2">↑ 1% from last month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/50" />
            </div>
          </GlassCard>

          <GlassCard className="hover-glow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-sm mb-2">Pending Issues</p>
                <div className="font-heading text-3xl font-bold text-accent">
                  <AnimatedCounter end={8} />
                </div>
                <p className="text-xs text-muted mt-2">Requires attention</p>
              </div>
              <AlertCircle className="w-8 h-8 text-accent/50" />
            </div>
          </GlassCard>
        </StaggerContainer>

        {/* Charts */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="hover-glow">
            <h2 className="font-heading text-xl font-bold mb-6">Department Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(26, 31, 58, 0.8)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="hover-glow">
            <h2 className="font-heading text-xl font-bold mb-6">Attendance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
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
                <Line type="monotone" dataKey="rate" stroke="#00ffff" strokeWidth={2} dot={{ fill: "#00ffff" }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </StaggerContainer>

        {/* Performance & Top Performers */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="hover-glow">
            <h2 className="font-heading text-xl font-bold mb-6">Department Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
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
                <Bar dataKey="avg" fill="#00ffff" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="hover-glow">
            <h2 className="font-heading text-xl font-bold mb-6">Top Performers</h2>
            <div className="space-y-4">
              {[
                { name: "Alex Johnson", score: 98, department: "Engineering" },
                { name: "Sarah Williams", score: 96, department: "Sales" },
                { name: "Mike Chen", score: 94, department: "Engineering" },
                { name: "Emma Davis", score: 92, department: "Marketing" },
                { name: "John Smith", score: 90, department: "HR" },
              ].map((performer, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-surface/50 rounded-lg border border-primary/10 hover:border-primary/30 smooth-transition"
                >
                  <div>
                    <p className="font-medium">{performer.name}</p>
                    <p className="text-xs text-muted">{performer.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-primary">{performer.score}/100</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </StaggerContainer>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GlassCard className="hover-glow">
            <h2 className="font-heading text-xl font-bold mb-6">Quick Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <NeonButton variant="primary">Add New Employee</NeonButton>
              <NeonButton variant="secondary">Create Task</NeonButton>
              <NeonButton variant="secondary">Generate Report</NeonButton>
              <NeonButton variant="secondary">View Alerts</NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  )
}
