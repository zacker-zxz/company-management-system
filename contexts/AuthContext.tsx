"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User, UserLoginRequest, UserLoginResponse, AuthContextType } from '@/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated
  const isAuthenticated = Boolean(user && token)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          setToken(storedToken)
          setRefreshToken(storedRefreshToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Clear invalid data
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Refresh access token
  const refreshAccessToken = useCallback(async (): Promise<void> => {
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        const newToken = data.data.accessToken
        setToken(newToken)
        localStorage.setItem('accessToken', newToken)
      } else {
        throw new Error('Invalid refresh response')
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Clear auth state on refresh failure
      logout()
      throw error
    }
  }, [refreshToken])

  // Login function
  const login = useCallback(async (credentials: UserLoginRequest): Promise<void> => {
    try {
      setIsLoading(true)
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.success && data.data) {
        const { user: userData, accessToken, refreshToken: newRefreshToken } = data.data as UserLoginResponse
        
        // Store auth data
        setUser(userData)
        setToken(accessToken)
        setRefreshToken(newRefreshToken)
        
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        
        // Redirect based on role
        if (userData.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/employee/dashboard')
        }
      } else {
        throw new Error('Invalid login response')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Revoke refresh token on server
      if (refreshToken) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        await fetch(`${baseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear auth state
      setUser(null)
      setToken(null)
      setRefreshToken(null)
      
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      
      router.push('/login')
    }
  }, [token, refreshToken, router])

  // Verify token validity
  const verifyToken = useCallback(async (): Promise<boolean> => {
    if (!token) return false

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${baseUrl}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.success && data.data.valid
      }
      
      return false
    } catch (error) {
      console.error('Token verification failed:', error)
      return false
    }
  }, [token])

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!token || !refreshToken) return

    const refreshInterval = setInterval(async () => {
      try {
        await refreshAccessToken()
      } catch (error) {
        console.error('Auto-refresh failed:', error)
        logout()
      }
    }, 14 * 60 * 1000) // Refresh every 14 minutes (token expires in 15)

    return () => clearInterval(refreshInterval)
  }, [token, refreshToken, refreshAccessToken, logout])

  // Protected route check
  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated) return false
    
    const isValid = await verifyToken()
    if (!isValid) {
      logout()
      return false
    }
    
    return true
  }, [isAuthenticated, verifyToken, logout])

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    login,
    logout,
    refreshAccessToken,
    isLoading,
    isAuthenticated,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'admin' | 'employee'
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login')
        return
      }

      if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
        router.push('/login')
        return
      }
    }, [isAuthenticated, isLoading, user, router, requiredRole])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Verifying access...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
      return null
    }

    return <Component {...props} />
  }
}

