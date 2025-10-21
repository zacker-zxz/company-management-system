"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"

const tasks = [
  {
    id: "T001",
    title: "Complete Q2 Report",
    status: "In Progress",
    deadline: "2024-07-15",
    priority: "High",
    progress: 75,
  },
  {
    id: "T002",
    title: "Review API Documentation",
    status: "Pending",
    deadline: "2024-07-20",
    priority: "Medium",
    progress: 0,
  },
  {
    id: "T003",
    title: "Team Meeting Preparation",
    status: "Completed",
    deadline: "2024-07-10",
    priority: "Low",
    progress: 100,
  },
  {
    id: "T004",
    title: "Database Optimization",
    status: "In Progress",
    deadline: "2024-07-25",
    priority: "High",
    progress: 45,
  },
  {
    id: "T005",
    title: "Security Audit",
    status: "Pending",
    deadline: "2024-08-01",
    priority: "Critical",
    progress: 20,
  },
]

export default function TasksPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "Low" | "Medium" | "High" | "Critical">("all")

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filter === "all" || task.status.toLowerCase().replace(" ", "-") === filter
    const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-4xl font-bold mb-2">Tasks</h1>
        <p className="text-muted">Manage and track your assigned tasks</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2">
          {(["all", "pending", "in-progress", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium smooth-transition ${
                filter === status
                  ? "bg-primary text-background"
                  : "bg-surface/50 text-muted hover:text-foreground border border-primary/20"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(["all", "Low", "Medium", "High", "Critical"] as const).map((priority) => (
            <button
              key={priority}
              onClick={() => setPriorityFilter(priority)}
              className={`px-4 py-2 rounded-lg font-medium smooth-transition ${
                priorityFilter === priority
                  ? "bg-accent text-background"
                  : "bg-surface/50 text-muted hover:text-foreground border border-primary/20"
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Table */}
      <GlassCard className="hover-glow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Task ID</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Title</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Status</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Priority</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Progress</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Deadline</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b border-primary/10 hover:bg-surface/30 smooth-transition">
                <td className="px-6 py-4 text-sm font-mono text-primary">{task.id}</td>
                <td className="px-6 py-4 font-medium">{task.title}</td>
                <td className="px-6 py-4">
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
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === "Critical"
                        ? "bg-red-500/20 text-red-400"
                        : task.priority === "High"
                          ? "bg-orange-500/20 text-orange-400"
                          : task.priority === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 bg-surface/50 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full smooth-transition"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted">{task.deadline}</td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:text-primary-dark smooth-transition text-sm font-medium">
                    View Details
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
