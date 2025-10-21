"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Calendar, Clock, CheckCircle } from "lucide-react"

const attendanceCalendar = [
  { date: 1, status: "present" },
  { date: 2, status: "present" },
  { date: 3, status: "absent" },
  { date: 4, status: "present" },
  { date: 5, status: "present" },
  { date: 6, status: "present" },
  { date: 7, status: "present" },
  { date: 8, status: "present" },
  { date: 9, status: "absent" },
  { date: 10, status: "present" },
  { date: 11, status: "present" },
  { date: 12, status: "present" },
  { date: 13, status: "present" },
  { date: 14, status: "present" },
  { date: 15, status: "present" },
  { date: 16, status: "present" },
  { date: 17, status: "present" },
  { date: 18, status: "present" },
  { date: 19, status: "present" },
  { date: 20, status: "present" },
  { date: 21, status: "present" },
  { date: 22, status: "present" },
  { date: 23, status: "present" },
  { date: 24, status: "present" },
  { date: 25, status: "present" },
  { date: 26, status: "present" },
  { date: 27, status: "present" },
  { date: 28, status: "present" },
  { date: 29, status: "present" },
  { date: 30, status: "present" },
]

export default function AttendancePage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-4xl font-bold mb-2">Attendance</h1>
        <p className="text-muted">Track your attendance and working hours</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="hover-glow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Days Present</p>
              <div className="font-heading text-3xl font-bold text-primary">
                <AnimatedCounter end={28} />
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-primary/50" />
          </div>
        </GlassCard>

        <GlassCard className="hover-glow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Days Absent</p>
              <div className="font-heading text-3xl font-bold text-accent">
                <AnimatedCounter end={2} />
              </div>
            </div>
            <Calendar className="w-8 h-8 text-accent/50" />
          </div>
        </GlassCard>

        <GlassCard className="hover-glow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Attendance Rate</p>
              <div className="font-heading text-3xl font-bold text-primary">
                <AnimatedCounter end={93} suffix="%" />
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-primary/50" />
          </div>
        </GlassCard>

        <GlassCard className="hover-glow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Working Hours</p>
              <div className="font-heading text-3xl font-bold text-primary">
                <AnimatedCounter end={224} />
              </div>
            </div>
            <Clock className="w-8 h-8 text-primary/50" />
          </div>
        </GlassCard>
      </div>

      {/* Calendar */}
      <GlassCard className="hover-glow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">June 2024</h2>
          <div className="flex gap-4">
            <button className="text-primary hover:text-primary-dark smooth-transition">← Previous</button>
            <button className="text-primary hover:text-primary-dark smooth-transition">Next →</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-heading font-bold text-primary text-sm py-2">
              {day}
            </div>
          ))}

          {attendanceCalendar.map((day) => (
            <div
              key={day.date}
              className={`aspect-square flex items-center justify-center rounded-lg font-medium text-sm smooth-transition ${
                day.status === "present"
                  ? "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30"
                  : "bg-accent/20 text-accent border border-accent/50 hover:bg-accent/30"
              }`}
            >
              {day.date}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20 border border-primary/50" />
            <span className="text-muted">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent/20 border border-accent/50" />
            <span className="text-muted">Absent</span>
          </div>
        </div>
      </GlassCard>

      {/* Mark Attendance */}
      <GlassCard className="hover-glow">
        <h2 className="font-heading text-xl font-bold mb-4">Mark Today's Attendance</h2>
        <div className="flex gap-4">
          <NeonButton variant="primary">Mark Present</NeonButton>
          <NeonButton variant="secondary">View History</NeonButton>
        </div>
      </GlassCard>
    </div>
  )
}
