"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ParticleBackground } from '@/components/ui/particle-background'
import { NeonButton } from '@/components/ui/neon-button'
import { GlassCard } from '@/components/ui/glass-card'
import { PageTransition } from '@/components/ui/page-transition'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { apiService } from '@/services/apiService'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await apiService.requestPasswordReset({ email })
      setIsSubmitted(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
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
              <GlassCard className="hover-glow bg-white/95 border-blue-200/50 shadow-xl text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    Check Your Email
                  </h1>
                  <p className="text-slate-600">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-blue-800">
                          Email Sent Successfully
                        </p>
                        <p className="text-xs text-blue-600">
                          Check your inbox and spam folder
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-600">
                    <p className="mb-2">
                      The reset link will expire in <strong>15 minutes</strong> for security reasons.
                    </p>
                    <p>
                      If you don't see the email, please check your spam folder or try again.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <NeonButton
                      onClick={() => setIsSubmitted(false)}
                      variant="secondary"
                      className="flex-1"
                    >
                      Try Different Email
                    </NeonButton>
                    <Link href="/login">
                      <NeonButton variant="primary" className="flex-1">
                        Back to Login
                      </NeonButton>
                    </Link>
                  </div>
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
            <p className="text-slate-600">Reset Your Password</p>
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
                  Forgot Your Password?
                </h2>
                <p className="text-slate-600 text-sm">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 smooth-transition"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
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
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </NeonButton>
                </motion.div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Remember your password?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}