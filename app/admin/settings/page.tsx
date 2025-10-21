"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Moon, Sun } from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark")

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted">Manage system settings and preferences</p>
      </div>

      {/* Theme Settings */}
      <GlassCard className="hover-glow">
        <h2 className="font-heading text-xl font-bold mb-6">Theme Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg border border-primary/10">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted">Use dark theme for the interface</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-6 h-6 rounded border-primary/30"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg border border-primary/10">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Light Mode</p>
                <p className="text-sm text-muted">Use light theme for the interface</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={theme === "light"}
              onChange={() => setTheme(theme === "light" ? "dark" : "light")}
              className="w-6 h-6 rounded border-primary/30"
            />
          </div>
        </div>
      </GlassCard>

      {/* Profile Settings */}
      <GlassCard className="hover-glow">
        <h2 className="font-heading text-xl font-bold mb-6">Profile Settings</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Admin Name</label>
            <input
              type="text"
              defaultValue="Admin User"
              className="w-full px-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary smooth-transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              defaultValue="admin@zacker.io"
              className="w-full px-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary smooth-transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select className="w-full px-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary smooth-transition">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>

          <NeonButton variant="primary">Save Changes</NeonButton>
        </div>
      </GlassCard>

      {/* Security Settings */}
      <GlassCard className="hover-glow">
        <h2 className="font-heading text-xl font-bold mb-6">Security Settings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-surface/50 rounded-lg border border-primary/10">
            <p className="font-medium mb-2">Change Password</p>
            <p className="text-sm text-muted mb-4">Update your password regularly for security</p>
            <NeonButton variant="secondary" size="sm">
              Change Password
            </NeonButton>
          </div>

          <div className="p-4 bg-surface/50 rounded-lg border border-primary/10">
            <p className="font-medium mb-2">Two-Factor Authentication</p>
            <p className="text-sm text-muted mb-4">Add an extra layer of security to your account</p>
            <NeonButton variant="secondary" size="sm">
              Enable 2FA
            </NeonButton>
          </div>
        </div>
      </GlassCard>

      {/* System Settings */}
      <GlassCard className="hover-glow">
        <h2 className="font-heading text-xl font-bold mb-6">System Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg border border-primary/10">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted">Receive email alerts for important events</p>
            </div>
            <input type="checkbox" defaultChecked className="w-6 h-6 rounded border-primary/30" />
          </div>

          <div className="flex items-center justify-between p-4 bg-surface/50 rounded-lg border border-primary/10">
            <div>
              <p className="font-medium">System Maintenance Mode</p>
              <p className="text-sm text-muted">Enable maintenance mode for system updates</p>
            </div>
            <input type="checkbox" className="w-6 h-6 rounded border-primary/30" />
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
