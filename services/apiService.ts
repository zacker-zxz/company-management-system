import { 
  ApiResponse, 
  PaginationResponse, 
  User, 
  UserLoginRequest, 
  UserLoginResponse,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  PayrollSummary,
  PayrollProcessResponse,
  EmployeePayrollDetails
} from '@/types'

class ApiService {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  }

  // Set authentication token
  setToken(token: string | null): void {
    this.token = token
  }

  // Get authentication headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error')
    }
  }

  // Authentication endpoints
  async login(credentials: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> {
    return this.request<ApiResponse<UserLoginResponse>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; expiresIn: string }>> {
    return this.request<ApiResponse<{ accessToken: string; expiresIn: string }>>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  }

  async logout(refreshToken: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  }

  async verifyToken(): Promise<ApiResponse<{ valid: boolean; user: User }>> {
    return this.request<ApiResponse<{ valid: boolean; user: User }>>('/api/auth/verify')
  }

  // Employee endpoints
  async getEmployees(params?: {
    page?: number
    limit?: number
    sort?: string
    order?: 'asc' | 'desc'
  }): Promise<PaginationResponse<User[]>> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.sort) searchParams.set('sort', params.sort)
    if (params?.order) searchParams.set('order', params.order)

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/api/employees?${queryString}` : '/api/employees'
    
    return this.request<PaginationResponse<User[]>>(endpoint)
  }

  async getEmployee(id: string): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/api/employees/${id}`)
  }

  async createEmployee(data: CreateEmployeeRequest): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/api/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/api/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteEmployee(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/api/employees/${id}`, {
      method: 'DELETE',
    })
  }

  // Task endpoints
  async getTasks(): Promise<ApiResponse<Task[]>> {
    return this.request<ApiResponse<Task[]>>('/api/tasks')
  }

  async getUserTasks(): Promise<ApiResponse<Task[]>> {
    return this.request<ApiResponse<Task[]>>('/api/tasks/user')
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return this.request<ApiResponse<Task>>(`/api/tasks/${id}`)
  }

  async createTask(data: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return this.request<ApiResponse<Task>>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/api/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  // Payroll endpoints
  async processPayroll(): Promise<ApiResponse<PayrollProcessResponse>> {
    return this.request<ApiResponse<PayrollProcessResponse>>('/api/payroll/process', {
      method: 'POST',
    })
  }

  async getPayrollSummary(): Promise<ApiResponse<PayrollSummary>> {
    return this.request<ApiResponse<PayrollSummary>>('/api/payroll/summary')
  }

  async getEmployeePayroll(id: string): Promise<ApiResponse<EmployeePayrollDetails>> {
    return this.request<ApiResponse<EmployeePayrollDetails>>(`/api/payroll/employee/${id}`)
  }

  // Password reset endpoints
  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>('/api/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(data: { token: string; newPassword: string }): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>('/api/password-reset/reset', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>('/api/password-reset/change', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async verifyResetToken(token: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/api/password-reset/verify/${token}`)
  }
}

// Create singleton instance
export const apiService = new ApiService()

// Export the class for testing
export { ApiService }
