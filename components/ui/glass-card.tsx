import type React from "react"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "dark"
}

export function GlassCard({ children, className = "", variant = "default" }: GlassCardProps) {
  const glassClass = variant === "dark" ? "glass-dark" : "glass"

  return <div className={`${glassClass} p-6 ${className}`}>{children}</div>
}
