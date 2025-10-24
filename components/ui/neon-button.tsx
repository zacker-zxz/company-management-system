import type React from "react"

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function NeonButton({ variant = "primary", size = "md", className = "", children, ...props }: NeonButtonProps) {
  const baseStyles = "font-semibold rounded-lg smooth-transition relative overflow-hidden font-heading"

  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl shadow-indigo-500/50 hover:shadow-purple-500/75 border border-indigo-500/30 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-purple-500 dark:text-black dark:shadow-cyan-500/60 dark:hover:shadow-purple-500/80 dark:border-cyan-400/50",
    secondary: "bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:from-slate-900 hover:to-slate-800 shadow-md hover:shadow-lg border border-slate-600 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-purple-400 dark:text-black dark:shadow-cyan-400/50 dark:hover:shadow-purple-400/70 dark:border-cyan-300/40",
    accent: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl shadow-cyan-500/50 hover:shadow-blue-500/75 border border-cyan-400/30 dark:bg-gradient-to-r dark:from-purple-500 dark:to-pink-500 dark:text-black dark:shadow-purple-500/60 dark:hover:shadow-pink-500/80 dark:border-purple-400/50",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
