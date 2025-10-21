"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const performanceData = [
  { month: "Jan", score: 75, target: 80 },
  { month: "Feb", score: 78, target: 80 },
  { month: "Mar", score: 82, target: 80 },
  { month: "Apr", score: 85, target: 85 },
  { month: "May", score: 92, target: 85 },
  { month: "Jun", score: 98, target: 90 },
]

const skillsData = [
  { skill: "Technical", score: 92 },
  { skill: "Communication", score: 88 },
  { skill: "Leadership", score: 85 },
  { skill: "Problem Solving", score: 95 },
  { skill: "Teamwork", score: 90 },
]

export default function PerformancePage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-4xl font-bold mb-2">Performance</h1>
        <p className="text-muted">Track your performance metrics and improvements</p>
      </div>

      {/* Performance Score */}
      <GlassCard className="hover-glow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-muted text-sm mb-2">Current Score</p>
            <p className="font-heading text-4xl font-bold text-primary">98/100</p>
            <p className="text-xs text-muted mt-2">↑ 6 points from last month</p>
          </div>
          <div>
            <p className="text-muted text-sm mb-2">Average Score</p>
            <p className="font-heading text-4xl font-bold text-primary-dark">86/100</p>
            <p className="text-xs text-muted mt-2">All time average</p>
          </div>
          <div>
            <p className="text-muted text-sm mb-2">Rank</p>
            <p className="font-heading text-4xl font-bold text-accent">#2</p>
            <p className="text-xs text-muted mt-2">In your department</p>
          </div>
        </div>
      </GlassCard>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <Line type="monotone" dataKey="target" stroke="#00bfff" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="hover-glow">
          <h2 className="font-heading text-xl font-bold mb-6">Skills Assessment</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData}>
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
              <Bar dataKey="score" fill="#00ffff" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Feedback */}
      <GlassCard className="hover-glow">
        <h2 className="font-heading text-xl font-bold mb-6">Recent Feedback</h2>
        <div className="space-y-4">
          {[
            {
              from: "Manager - John Smith",
              date: "June 15, 2024",
              feedback:
                "Excellent work on the Q2 project. Your technical skills and attention to detail were outstanding.",
            },
            {
              from: "Team Lead - Sarah Johnson",
              date: "June 10, 2024",
              feedback:
                "Great collaboration on the recent sprint. Your communication with the team was clear and effective.",
            },
            {
              from: "Peer - Mike Davis",
              date: "June 5, 2024",
              feedback:
                "Thanks for helping me with the database optimization. Your problem-solving approach was very helpful.",
            },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-surface/50 rounded-lg border border-primary/10">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-primary">{item.from}</h3>
                <span className="text-xs text-muted">{item.date}</span>
              </div>
              <p className="text-muted text-sm">{item.feedback}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
