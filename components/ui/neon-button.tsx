import type React from "react"

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function NeonButton({ variant = "primary", size = "md", className = "", children, ...props }: NeonButtonProps) {
  const baseStyles = "font-semibold rounded-lg smooth-transition relative overflow-hidden font-heading"

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg",
    secondary: "bg-white border-2 border-primary text-primary hover:bg-primary/5 shadow-sm hover:shadow-md",
    accent: "bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-lg",
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
