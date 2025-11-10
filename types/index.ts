// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface PaginationResponse<T = unknown> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User Types
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'employee';
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  department?: string;
  position?: string;
  salary?: number;
  status?: 'Active' | 'Inactive';
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assignedBy: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed';
  deadline: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignedTo: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignedTo?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  status?: 'Pending' | 'In Progress' | 'Completed';
  deadline?: string;
  progress?: number;
}

// Payroll Types
export interface PayrollSummary {
  totalEmployees: number;
  totalPayroll: number;
  pendingPayments: number;
  lastProcessed: string;
}

export interface PayrollProcessResponse {
  period: string;
  processedEmployees: number;
  totalAmount: number;
  processedAt: string;
  status: 'completed' | 'failed';
}

export interface EmployeePayrollDetails {
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  deductions: {
    tax: number;
    insurance: number;
    total: number;
  };
  netSalary: number;
  payPeriod: string;
}

// Dashboard Types
export interface DashboardStats {
  totalEmployees: number;
  activeTasks: number;
  avgAttendance: number;
  pendingIssues: number;
}

export interface DepartmentData {
  name: string;
  value: number;
}

export interface AttendanceData {
  month: string;
  rate: number;
}

export interface PerformanceData {
  department: string;
  avg: number;
}

export interface TopPerformer {
  name: string;
  score: number;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
  position: string;
  salary: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  progress: number;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ApiError {
  error: string;
  message: string;
  details?: ValidationError[];
  timestamp: string;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (credentials: UserLoginRequest) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Component Props Types
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark';
}

export interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface PageTransitionProps {
  children: React.ReactNode;
}

export interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Navigation Types
export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

// Filter Types
export interface EmployeeFilters {
  search: string;
  department: string;
  status: string;
}

export interface TaskFilters {
  search: string;
  priority: string;
  status: string;
  assignee: string;
}

// Sort Types
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// Environment Types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_VERSION: string;
}

// Utility Types
export type Status = 'Active' | 'Inactive';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type UserRole = 'admin' | 'employee';
export type Department = 'Engineering' | 'Sales' | 'Marketing' | 'HR' | 'Finance' | 'Operations';

// Generic Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

