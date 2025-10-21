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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect based on user type
    if (userType === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/employee/dashboard")
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
            <p className="text-muted">Blockchain Management System</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="hover-glow">
              {/* User Type Tabs */}
              <div className="flex gap-2 mb-8 bg-surface-light p-1 rounded-lg">
                <button
                  onClick={() => setUserType("employee")}
                  className={`flex-1 py-2 rounded-md font-medium smooth-transition ${
                    userType === "employee" ? "bg-primary text-white" : "text-muted hover:text-foreground"
                  }`}
                >
                  Employee
                </button>
                <button
                  onClick={() => setUserType("admin")}
                  className={`flex-1 py-2 rounded-md font-medium smooth-transition ${
                    userType === "admin" ? "bg-primary text-white" : "text-muted hover:text-foreground"
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2 text-foreground">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white border border-primary/20 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary smooth-transition"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2 text-foreground">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white border border-primary/20 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary smooth-transition"
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
                    <span className="text-muted">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-primary hover:text-primary-dark smooth-transition">
                    Forgot Password?
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <NeonButton type="submit" size="lg" className="w-full">
                    Sign In
                  </NeonButton>
                </motion.div>
              </form>
            </GlassCard>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-8 text-sm text-muted"
          >
            <p>
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:text-primary-dark smooth-transition">
                Contact Administrator
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
