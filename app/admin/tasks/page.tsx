"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"

const tasks = [
  {
    id: "T001",
    title: "Complete Q2 Report",
    assignee: "Alex Johnson",
    deadline: "2024-07-15",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "T002",
    title: "Review API Documentation",
    assignee: "Mike Chen",
    deadline: "2024-07-20",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: "T003",
    title: "Team Meeting Preparation",
    assignee: "Sarah Williams",
    deadline: "2024-07-10",
    priority: "Low",
    status: "Completed",
  },
  {
    id: "T004",
    title: "Database Optimization",
    assignee: "Alex Johnson",
    deadline: "2024-07-25",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "T005",
    title: "Security Audit",
    assignee: "Mike Chen",
    deadline: "2024-08-01",
    priority: "Critical",
    status: "Pending",
  },
]

export default function TasksPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold mb-2">Task Manager</h1>
          <p className="text-muted">Create and manage tasks for employees</p>
        </div>
        <NeonButton variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create New Task"}
        </NeonButton>
      </div>

      {/* Create Task Form */}
      {showForm && (
        <GlassCard className="hover-glow">
          <h2 className="font-heading text-xl font-bold mb-6">Create New Task</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="w-full px-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary smooth-transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assign To</label>
                <select className="w-full px-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary smooth-transition">
                  <option>Select Employee</option>
                  <option>Alex Johnson</option>
                  <option>Sarah Williams</option>
                  <option>Mike Chen</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary smooth-transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select className="w-full px-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary smooth-transition">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="Enter task description"
                rows={4}
                className="w-full px-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary smooth-transition resize-none"
              />
            </div>

            <div className="flex gap-4">
              <NeonButton type="submit" variant="primary">
                Create Task
              </NeonButton>
              <NeonButton type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </NeonButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Tasks Table */}
      <GlassCard className="hover-glow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Task ID</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Title</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Assigned To</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Deadline</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Priority</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Status</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-primary/10 hover:bg-surface/30 smooth-transition">
                <td className="px-6 py-4 text-sm font-mono text-primary">{task.id}</td>
                <td className="px-6 py-4 font-medium">{task.title}</td>
                <td className="px-6 py-4 text-muted">{task.assignee}</td>
                <td className="px-6 py-4 text-muted text-sm">{task.deadline}</td>
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
