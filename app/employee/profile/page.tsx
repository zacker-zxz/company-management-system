"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted">Manage your personal information</p>
        </div>
        <NeonButton onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "accent" : "primary"}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </NeonButton>
      </div>

      {/* Profile Card */}
      <GlassCard className="hover-glow">
        <div className="flex items-start gap-8 mb-8">
          <div className="w-32 h-32 rounded-full border-2 border-primary/50 flex items-center justify-center bg-surface/50">
            <User className="w-16 h-16 text-primary/50" />
          </div>

          <div className="flex-1">
            <h2 className="font-heading text-3xl font-bold mb-2">Alex Johnson</h2>
            <p className="text-primary mb-4">Senior Software Engineer</p>
            <div className="space-y-2 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>alex.johnson@zacker.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Profile Information */}
      <GlassCard className="hover-glow">
        <h2 className="font-heading text-xl font-bold mb-6">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "First Name", value: "Alex", icon: User },
            { label: "Last Name", value: "Johnson", icon: User },
            { label: "Email", value: "alex.johnson@zacker.io", icon: Mail },
            { label: "Phone", value: "+1 (555) 123-4567", icon: Phone },
            { label: "Department", value: "Engineering", icon: Briefcase },
            { label: "Role", value: "Senior Software Engineer", icon: Briefcase },
            { label: "Joining Date", value: "January 15, 2022", icon: Calendar },
            { label: "Employee ID", value: "EMP-2022-001", icon: User },
          ].map((field, i) => {
            const Icon = field.icon
            return (
              <div key={i}>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  {field.label}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={field.value}
                    className="w-full px-4 py-2 bg-surface/50 border border-primary/30 rounded-lg text-foreground focus:outline-none focus:border-primary smooth-transition"
                  />
                ) : (
                  <p className="px-4 py-2 bg-surface/50 rounded-lg text-foreground">{field.value}</p>
                )}
              </div>
            )
          })}
        </div>

        {isEditing && (
          <div className="flex gap-4 mt-8">
            <NeonButton variant="primary">Save Changes</NeonButton>
            <NeonButton variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </NeonButton>
          </div>
        )}
      </GlassCard>

      {/* Employment Details */}
      <GlassCard className="hover-glow">
        <h2 className="font-heading text-xl font-bold mb-6">Employment Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-muted text-sm mb-2">Department</p>
            <p className="font-medium">Engineering</p>
          </div>
          <div>
            <p className="text-muted text-sm mb-2">Team</p>
            <p className="font-medium">Backend Development</p>
          </div>
          <div>
            <p className="text-muted text-sm mb-2">Manager</p>
            <p className="font-medium">John Smith</p>
          </div>
          <div>
            <p className="text-muted text-sm mb-2">Employment Type</p>
            <p className="font-medium">Full-time</p>
          </div>
          <div>
            <p className="text-muted text-sm mb-2">Joining Date</p>
            <p className="font-medium">January 15, 2022</p>
          </div>
          <div>
            <p className="text-muted text-sm mb-2">Years of Experience</p>
            <p className="font-medium">2+ years</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
