"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  id: number
  directionChangeTimer: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ensure theme is available
    const currentTheme = theme || "light"

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        id: i,
        directionChangeTimer: Math.random() * 120,
      })
    }
    particlesRef.current = particles

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      // Clear canvas with fade effect based on theme
      const isDark = currentTheme === "dark"
      ctx.fillStyle = isDark ? "rgba(0, 0, 0, 1)" : "rgba(248, 249, 250, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // Update particle positions
      particles.forEach((particle) => {
        particle.directionChangeTimer--
        if (particle.directionChangeTimer <= 0) {
          const angle = Math.random() * Math.PI * 2
          const speed = 0.15
          particle.vx = Math.cos(angle) * speed
          particle.vy = Math.sin(angle) * speed
          particle.directionChangeTimer = 120 + Math.random() * 120
        }

        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance) {
          // Repel particles from cursor
          const angle = Math.atan2(dy, dx)
          const force = ((maxDistance - distance) / maxDistance) * 0.5
          particle.vx -= Math.cos(angle) * force
          particle.vy -= Math.sin(angle) * force
        }

        // Apply friction
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off walls
        if (particle.x - particle.radius < 0 || particle.x + particle.radius > canvas.width) {
          particle.vx *= -1
          particle.x = Math.max(particle.radius, Math.min(canvas.width - particle.radius, particle.x))
        }
        if (particle.y - particle.radius < 0 || particle.y + particle.radius > canvas.height) {
          particle.vy *= -1
          particle.y = Math.max(particle.radius, Math.min(canvas.height - particle.radius, particle.y))
        }

        // Draw particle
        if (isDark) {
          ctx.fillStyle = "rgba(0, 102, 204, 0.6)"
        } else {
          ctx.fillStyle = "rgba(0, 102, 204, 0.6)"
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()

        // Reset shadow for connections
        ctx.shadowBlur = 0
      })

      const connectionDistance = 120
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3
            ctx.strokeStyle = isDark ? `rgba(0, 255, 255, ${opacity})` : `rgba(0, 128, 255, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}
