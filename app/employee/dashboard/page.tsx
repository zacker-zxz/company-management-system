"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { PageTransition } from "@/components/ui/page-transition"
import { StaggerContainer } from "@/components/ui/stagger-container"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CheckCircle, Clock, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const performanceData = [
  { month: "Jan", score: 85 },
  { month: "Feb", score: 88 },
  { month: "Mar", score: 92 },
  { month: "Apr", score: 89 },
  { month: "May", score: 95 },
  { month: "Jun", score: 98 },
]

const attendanceData = [
  { month: "Jan", present: 20, absent: 2 },
  { month: "Feb", present: 19, absent: 3 },
  { month: "Mar", present: 21, absent: 1 },
  { month: "Apr", present: 20, absent: 2 },
  { month: "May", present: 22, absent: 0 },
  { month: "Jun", present: 21, absent: 1 },
]

export default function EmployeeDashboard() {
  return (
    <PageTransition>
      <div className="p-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-heading text-4xl font-bold mb-2">Welcome back, Alex Johnson</h1>
          <p className="text-muted">Here's your performance overview for this month</p>
        </motion.div>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="hover-glow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-sm mb-2">Attendance Rate</p>
                <div className="font-heading text-3xl font-bold text-primary">
                  <AnimatedCounter end={95} suffix="%" />
                </div>
                <p className="text-xs text-muted mt-2">Last marked: Today</p>
              </div>
              <CheckCircle className="w-8 h-8 text-primary/50" />
            </div>
          </GlassCard>

          <GlassCard className="hover-glow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-sm mb-2">Performance Score</p>
                <div className="font-heading text-3xl font-bold text-primary">
                  <AnimatedCounter end={98} suffix="/100" />
                </div>
                <p className="text-xs text-muted mt-2">↑ 3% from last month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/50" />
            </div>
          </GlassCard>

          <GlassCard className="hover-glow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted text-sm mb-2">Active Tasks</p>
                <div className="font-heading text-3xl font-bold text-primary">
                  <AnimatedCounter end={5} />
                </div>
                <p className="text-xs text-muted mt-2">2 due this week</p>
              </div>
              <Clock className="w-8 h-8 text-primary/50" />
            </div>
          </GlassCard>
        </StaggerContainer>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlassCard className="hover-glow">
            <h2 className="font-heading text-xl font-bold mb-6">Recent Tasks</h2>
            <div className="space-y-4">
              {[
                { title: "Complete Q2 Report", status: "In Progress", priority: "High", deadline: "2 days" },
                { title: "Review API Documentation", status: "Pending", priority: "Medium", deadline: "5 days" },
                { title: "Team Meeting Preparation", status: "Completed", priority: "Low", deadline: "Done" },
              ].map((task, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
                  className="flex items-center justify-between p-4 bg-surface/50 rounded-lg border border-primary/10 hover:border-primary/30 smooth-transition"
                >
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{task.title}</h3>
                    <div className="flex gap-4 text-xs text-muted">
                      <span>Priority: {task.priority}</span>
                      <span>Due: {task.deadline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-primary/20 text-primary"
                          : task.status === "In Progress"
                            ? "bg-accent/20 text-accent"
                            : "bg-muted/20 text-muted"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Charts */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="hover-glow">
            <h2 className="font-heading text-xl font-bold mb-6">Performance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
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
                <Line type="monotone" dataKey="score" stroke="#00ffff" strokeWidth={2} dot={{ fill: "#00ffff" }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="hover-glow">
            <h2 className="font-heading text-xl font-bold mb-6">Attendance Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
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
                <Bar dataKey="present" stackId="a" fill="#00ffff" />
                <Bar dataKey="absent" stackId="a" fill="#ff006e" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </StaggerContainer>

        {/* Salary Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard className="hover-glow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold">Salary Summary</h2>
              <NeonButton variant="secondary" size="sm">
                View Details
              </NeonButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-muted text-sm mb-2">Monthly Salary</p>
                <p className="font-heading text-2xl font-bold text-primary">$8,500</p>
              </div>
              <div>
                <p className="text-muted text-sm mb-2">Last Credited</p>
                <p className="font-heading text-2xl font-bold text-primary">June 30, 2024</p>
              </div>
              <div>
                <p className="text-muted text-sm mb-2">YTD Earnings</p>
                <p className="font-heading text-2xl font-bold text-primary">$51,000</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  )
}
