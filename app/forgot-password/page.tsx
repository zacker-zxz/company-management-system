"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ParticleBackground } from "@/components/ui/particle-background"
import { NeonButton } from "@/components/ui/neon-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Lock } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center px-4">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/">
            <div className="font-heading text-3xl font-bold text-primary mb-2 hover:opacity-80 smooth-transition">
              Zacker
            </div>
          </Link>
          <p className="text-muted">Reset Your Password</p>
        </div>

        {/* Reset Card */}
        <GlassCard className="hover-glow">
          {!submitted ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>

              <p className="text-center text-muted mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-surface/50 border border-primary/30 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary smooth-transition"
                    required
                  />
                </div>

                <NeonButton type="submit" size="lg" className="w-full">
                  Send Reset Link
                </NeonButton>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="font-heading text-xl font-bold mb-3">Check Your Email</h2>
              <p className="text-muted mb-6">
                We've sent a password reset link to <span className="text-primary">{email}</span>
              </p>
              <p className="text-sm text-muted mb-6">The link will expire in 24 hours.</p>
            </div>
          )}
        </GlassCard>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/login" className="text-primary hover:text-primary-dark smooth-transition">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
