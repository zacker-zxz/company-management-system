"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ParticleBackground } from "@/components/ui/particle-background"
import { NeonButton } from "@/components/ui/neon-button"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { PageTransition } from "@/components/ui/page-transition"
import { StaggerContainer } from "@/components/ui/stagger-container"
import { Shield, Zap, Lock, Brain, Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("light")

  useEffect(() => {
    setMounted(true)
    setCurrentTheme(theme || "light")
  }, [theme])

  useEffect(() => {
    setCurrentTheme(theme || "light")
    // Force re-render by updating a dummy state
    setMounted(prev => prev)
  }, [theme])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <PageTransition key={currentTheme}>
      <div className={`relative min-h-screen overflow-hidden ${currentTheme === 'dark' ? 'bg-black' : 'bg-background'}`}>
        <ParticleBackground />

        {/* Navigation */}
        <nav className={`relative z-10 flex items-center justify-between px-8 py-6 border-b border-primary/10 backdrop-blur-sm ${currentTheme === 'dark' ? 'bg-black/80' : 'bg-white/50'}`}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-2xl font-bold text-primary"
          >
            Zacker
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-4"
          >
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 border border-primary/20 hover:border-primary/40 smooth-transition"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 min-h-screen flex items-center justify-center px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-6xl md:text-7xl font-bold mb-6 text-primary"
            >
              Zacker
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-black dark:text-white mb-8 font-light"
            >
              Enterprise Blockchain Management Platform
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-black dark:text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Build smart data and workforce ecosystems for enterprises with cutting-edge blockchain technology.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link href="/login">
                <NeonButton size="lg" variant="primary">
                  Get Started
                </NeonButton>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className={`relative z-10 px-8 py-20 ${currentTheme === 'dark' ? 'bg-gray-900/50' : 'bg-surface-light/50'}`}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-heading text-4xl font-bold mb-12 text-center text-primary"
            >
              About Zacker
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-black dark:text-white text-center mb-16 max-w-3xl mx-auto"
            >
              Zacker is a private blockchain management company that builds smart data and workforce ecosystems for
              enterprises. We combine cutting-edge technology with enterprise-grade security.
            </motion.p>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "Secure Data", desc: "Enterprise-grade encryption" },
                { icon: Zap, title: "Smart Workforce", desc: "Automated management systems" },
                { icon: Lock, title: "Decentralization", desc: "Distributed architecture" },
                { icon: Brain, title: "AI Integration", desc: "Intelligent automation" },
              ].map((feature, i) => (
                <GlassCard key={i} className="text-center hover-glow">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-heading text-lg font-bold mb-2 text-black dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-black dark:text-gray-300">{feature.desc}</p>
                </GlassCard>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Features Section */}
        <section className={`relative z-10 px-8 py-20 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-background'}`}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-heading text-4xl font-bold mb-12 text-center text-primary"
            >
              Key Features
            </motion.h2>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Secure Data Management",
                  desc: "Advanced encryption and security protocols ensure your data is always protected.",
                },
                {
                  title: "Smart Workforce Ecosystem",
                  desc: "Manage your team with intelligent automation and real-time insights.",
                },
                {
                  title: "Automated Workflows",
                  desc: "Streamline operations with intelligent automation and task management.",
                },
                {
                  title: "AI-Powered Analytics",
                  desc: "Get actionable insights with advanced AI-driven analytics and reporting.",
                },
              ].map((feature, i) => (
                <GlassCard key={i} className="hover-glow">
                  <h3 className="font-heading text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                  <p className="text-black dark:text-gray-300">{feature.desc}</p>
                </GlassCard>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Stats Section */}
        <section className={`relative z-10 px-8 py-20 ${currentTheme === 'dark' ? 'bg-gray-900/50' : 'bg-surface-light/50'}`}>
          <div className="max-w-6xl mx-auto">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Active Enterprises", value: 500 },
                { label: "Transactions Processed", value: 1000000 },
                { label: "Team Members", value: 250 },
              ].map((stat, i) => (
                <GlassCard key={i} className="text-center">
                  <div className="font-heading text-4xl font-bold text-primary mb-2">
                    <AnimatedCounter end={stat.value} />
                  </div>
                  <p className="text-black dark:text-white">{stat.label}</p>
                </GlassCard>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Contact Section */}
        <section className={`relative z-10 px-8 py-20 ${currentTheme === 'dark' ? 'bg-gray-900/50' : 'bg-surface-light/50'}`}>
          <div className="max-w-2xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-heading text-4xl font-bold mb-12 text-center text-primary"
            >
              Get In Touch
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="hover-glow">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-primary/20 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary smooth-transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-primary/20 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary smooth-transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Message</label>
                    <textarea
                      placeholder="Your message"
                      rows={4}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-primary/20 rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary smooth-transition resize-none"
                    />
                  </div>
                  <NeonButton type="submit" size="lg" className="w-full">
                    Send Message
                  </NeonButton>
                </form>
              </GlassCard>
            </motion.div>

          </div>
        </section>

        {/* Footer */}
        <footer className={`relative z-10 border-t border-primary/10 px-8 py-8 backdrop-blur-sm ${currentTheme === 'dark' ? 'bg-black/80' : 'bg-white/50'}`}>
          <div className="max-w-6xl mx-auto flex items-center justify-center">
            <p className="text-sm text-muted">© 2025 Zacker. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
