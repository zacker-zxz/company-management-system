"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ParticleBackground } from '@/components/ui/particle-background'
import { NeonButton } from '@/components/ui/neon-button'
import { GlassCard } from '@/components/ui/glass-card'
import { PageTransition } from '@/components/ui/page-transition'
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { apiService } from '@/services/apiService'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
      verifyToken(tokenParam)
    } else {
      setError('Invalid reset link. Please request a new password reset.')
      setIsValidToken(false)
    }
  }, [searchParams])

  const verifyToken = async (token: string) => {
    try {
      await apiService.verifyResetToken(token)
      setIsValidToken(true)
    } catch (error) {
      setIsValidToken(false)
      setError('Invalid or expired reset link. Please request a new password reset.')
    }
  }

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate passwords
    const passwordErrors = validatePassword(newPassword)
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join('. '))
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      await apiService.resetPassword({ token, newPassword })
      setIsSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidToken === null) {
    return (
      <PageTransition>
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden flex items-center justify-center px-4">
          <ParticleBackground />
          <div className="relative z-10 w-full max-w-md">
            <GlassCard className="hover-glow bg-white/95 border-blue-200/50 shadow-xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Verifying reset link...</p>
            </GlassCard>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (isValidToken === false) {
    return (
      <PageTransition>
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden flex items-center justify-center px-4">
          <ParticleBackground />

          <div className="relative z-10 w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="hover-glow bg-white/95 border-red-200/50 shadow-xl text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Invalid Reset Link
                  </h1>
                  <p className="text-slate-600">
                    {error}
                  </p>
                </div>

                <div className="space-y-4">
                  <Link href="/forgot-password">
                    <NeonButton variant="primary" className="w-full">
                      Request New Reset Link
                    </NeonButton>
                  </Link>
                  <Link href="/login">
                    <NeonButton variant="secondary" className="w-full">
                      Back to Login
                    </NeonButton>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (isSuccess) {
    return (
      <PageTransition>
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden flex items-center justify-center px-4">
          <ParticleBackground />

          <div className="relative z-10 w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="hover-glow bg-white/95 border-green-200/50 shadow-xl text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Password Reset Successfully
                  </h1>
                  <p className="text-slate-600">
                    Your password has been reset successfully. You can now log in with your new password.
                  </p>
                </div>

                <div className="space-y-4">
                  <Link href="/login">
                    <NeonButton variant="primary" className="w-full">
                      Go to Login
                    </NeonButton>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden flex items-center justify-center px-4">
        <ParticleBackground />

        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Link href="/login" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
            <Link href="/">
              <div className="font-heading text-3xl font-bold text-primary mb-2 hover:opacity-80 smooth-transition">
                Zacker
              </div>
            </Link>
            <p className="text-slate-600">Create New Password</p>
          </motion.div>

          {/* Reset Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="hover-glow bg-white/95 border-blue-200/50 shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  Set New Password
                </h2>
                <p className="text-slate-600 text-sm">
                  Please enter your new password below. Make sure it's strong and secure.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-12 bg-white border border-blue-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 smooth-transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 bg-white border border-blue-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 smooth-transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Password Requirements */}
                <div className="text-sm text-slate-600">
                  <p className="font-medium mb-2">Password Requirements:</p>
                  <ul className="space-y-1">
                    <li className={`flex items-center gap-2 ${newPassword.length >= 8 ? 'text-green-600' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center gap-2 ${/(?=.*[a-z])/.test(newPassword) ? 'text-green-600' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[a-z])/.test(newPassword) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      One lowercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${/(?=.*[A-Z])/.test(newPassword) ? 'text-green-600' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[A-Z])/.test(newPassword) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      One uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${/(?=.*\d)/.test(newPassword) ? 'text-green-600' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(newPassword) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      One number
                    </li>
                    <li className={`flex items-center gap-2 ${/(?=.*[@$!%*?&])/.test(newPassword) ? 'text-green-600' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[@$!%*?&])/.test(newPassword) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      One special character
                    </li>
                  </ul>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {error && (
                    <div className="text-red-600 text-sm text-center mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  <NeonButton
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </NeonButton>
                </motion.div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
