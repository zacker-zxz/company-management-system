"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  assignedBy: string
  priority: string
  status: string
  deadline: string
  progress: number
  createdAt: string
}

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  salary: number
  status: string
  joinDate: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    deadline: "",
    status: "Pending",
    progress: 0
  })

  // Fetch tasks and employees from API
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data.data)
      } else {
        setError('Failed to fetch tasks')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setEmployees(data.data.filter((emp: Employee) => emp.status === 'Active'))
      }
    } catch (error) {
      console.error('Failed to fetch employees')
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchEmployees()
    setLoading(false)
  }, [])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://zacker-backend.vercel.app'
      const response = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setShowForm(false)
        setFormData({ title: "", description: "", assignedTo: "", priority: "Medium", deadline: "", status: "Pending", progress: 0 })
        fetchTasks() // Refresh list
        // Show success message
        setError("")
        alert(data.message || 'Task created successfully!')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create task')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setShowEditModal(false)
        setEditingTask(null)
        setFormData({ title: "", description: "", assignedTo: "", priority: "Medium", deadline: "", status: "Pending", progress: 0 })
        fetchTasks() // Refresh list
        // Show success message
        setError("")
        alert(data.message || 'Task updated successfully!')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update task')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchTasks() // Refresh list
      } else {
        setError('Failed to delete task')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: employees.find(emp => emp.name === task.assignee)?.id || "",
      priority: task.priority,
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : "",
      status: task.status,
      progress: task.progress
    })
    setShowEditModal(true)
  }

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
        <GlassCard className="hover-glow bg-white border-blue-200">
          <h2 className="font-heading text-xl font-bold mb-6 text-slate-800">Create New Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Assign To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">Description</label>
              <textarea
                placeholder="Enter task description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none"
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
      <GlassCard className="hover-glow bg-white border-blue-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-blue-200">
              <th className="text-left px-6 py-4 font-heading font-bold text-blue-600">Task ID</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-blue-600">Title</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-blue-600">Assigned To</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-blue-600">Deadline</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-blue-600">Priority</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-blue-600">Status</th>
              <th className="text-left px-6 py-4 font-heading font-bold text-blue-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-blue-100 hover:bg-blue-50/50 smooth-transition">
                <td className="px-6 py-4 text-sm font-mono text-blue-600">{task.id.slice(-6)}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{task.title}</td>
                <td className="px-6 py-4 text-slate-600">{task.assignee}</td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === "Critical"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "High"
                          ? "bg-orange-100 text-orange-700"
                          : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-blue-600 hover:text-blue-700 smooth-transition text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-700 smooth-transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Task</h3>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              <textarea
                placeholder="Task Description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 resize-none"
              />
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
              <input
                type="number"
                placeholder="Progress (0-100)"
                value={formData.progress}
                onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                min="0"
                max="100"
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
              <div className="flex gap-3">
                <NeonButton type="submit" className="flex-1">Update Task</NeonButton>
                <NeonButton variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</NeonButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {error}
          <button onClick={() => setError("")} className="ml-4 text-red-500 hover:text-red-700">×</button>
        </div>
      )}
    </div>
  )
}
