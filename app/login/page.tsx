"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ParticleBackground } from "@/components/ui/particle-background"
import { NeonButton } from "@/components/ui/neon-button"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [userType, setUserType] = useState<"admin" | "employee">("employee")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // email field now contains username
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redirect based on user role
        if (data.user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/employee/dashboard")
        }
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center px-4">
        <ParticleBackground />

        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Link href="/">
              <div className="font-heading text-3xl font-bold text-primary mb-2 hover:opacity-80 smooth-transition">
                Zacker
              </div>
            </Link>
            <p className="text-cyan-300">Blockchain Management System</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="hover-glow bg-slate-900/90 border-cyan-500/20">
              {/* User Type Tabs - Hidden for now, only admin login */}
              <input type="hidden" value="admin" />

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2 text-cyan-300">Username</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username"
                    className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 smooth-transition"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2 text-cyan-300">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 smooth-transition"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-primary/30" />
                    <span className="text-cyan-300">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-cyan-400 hover:text-cyan-300 smooth-transition">
                    Forgot Password?
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  {error && (
                    <div className="text-red-400 text-sm text-center mb-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      {error}
                    </div>
                  )}
  
                  <NeonButton type="submit" size="lg" className="w-full dark:shadow-primary/30 dark:hover:shadow-primary/50" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
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
