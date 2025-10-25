"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Search, Edit, Trash2, Eye } from "lucide-react"

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

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: ""
  })

  // Fetch employees from API
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
        setEmployees(data.data)
      } else {
        setError('Failed to fetch employees')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const filteredEmployees = employees.filter((emp) => {
    const searchMatch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.id.includes(searchTerm)
    const deptMatch = departmentFilter === "all" || emp.department === departmentFilter
    return searchMatch && deptMatch
  })

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const baseUrl = isMobile ? 'http://192.168.1.6:5000' : 'http://localhost:5000'
      const response = await fetch(`${baseUrl}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setShowAddModal(false)
        setFormData({ name: "", email: "", department: "", position: "", salary: "" })
        fetchEmployees() // Refresh list
        // Show success message
        setError("")
        alert(data.message || 'Employee added successfully!')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to add employee')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEmployee) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/employees/${editingEmployee.id}`, {
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
        setEditingEmployee(null)
        setFormData({ name: "", email: "", department: "", position: "", salary: "" })
        fetchEmployees() // Refresh list
        // Show success message
        setError("")
        alert(data.message || 'Employee updated successfully!')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update employee')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY DELETE this employee? This action cannot be undone!')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        fetchEmployees() // Refresh list
        setError("")
        alert(data.message || 'Employee permanently deleted successfully!')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to delete employee')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary.toString()
    })
    setShowEditModal(true)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold mb-2">Employee Management</h1>
          <p className="text-muted">Manage all employees and their information</p>
        </div>
        <NeonButton variant="primary" onClick={() => setShowAddModal(true)}>Add New Employee</NeonButton>
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
                <td className="px-6 py-4 text-slate-600">{emp.position}</td>
                <td className="px-6 py-4 text-muted">{emp.department}</td>
                <td className="px-6 py-4 font-medium text-blue-600">${emp.salary}</td>
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
                    <button onClick={() => openEditModal(emp)} className="p-2 hover:bg-slate-100 rounded-lg smooth-transition text-blue-600 hover:text-blue-700">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteEmployee(emp.id)} className="p-2 hover:bg-red-50 rounded-lg smooth-transition text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Add New Employee</h3>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
              </select>
              <input
                type="text"
                placeholder="Position"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              <input
                type="number"
                placeholder="Salary"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              <div className="flex gap-3">
                <NeonButton type="submit" className="flex-1">Add Employee</NeonButton>
                <NeonButton variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</NeonButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Employee</h3>
            <form onSubmit={handleEditEmployee} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
              </select>
              <input
                type="text"
                placeholder="Position"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              <input
                type="number"
                placeholder="Salary"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              <div className="flex gap-3">
                <NeonButton type="submit" className="flex-1">Update Employee</NeonButton>
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
