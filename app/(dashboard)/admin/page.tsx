"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Flame, Star, Mail, AlertTriangle, Loader2, Crown, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import Link from "next/link"

interface InactiveStudent {
  id: number
  name: string
  email: string
  branch: string
  section: string
  roll_number: string
  last_active: string | null
}

interface Analytics {
  total_students: number
  active_this_week: number
  avg_streak: number
  avg_points: number
  inactive_students: InactiveStudent[]
  top_students: { id: number; name: string; points: number; streak: number; branch: string }[]
}

function formatLastActive(iso: string | null): string {
  if (!iso) return "Never"
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [remindingId, setRemindingId] = useState<number | null>(null)

  useEffect(() => {
    api.get("/admin/analytics")
      .then((res) => setAnalytics(res.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [])

  async function handleSendReminder(student: InactiveStudent) {
    setRemindingId(student.id)
    try {
      await api.post(`/admin/students/${student.id}/remind`)
      toast.success(`Reminder sent to ${student.name}`)
    } catch {
      toast.error("Failed to send reminder")
    } finally {
      setRemindingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 self-start">
          <Crown className="h-4 w-4 mr-2" />
          {user?.college_name || "Your College"}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.total_students ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.active_this_week ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Active This Week</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/20">
              <Flame className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.avg_streak ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Avg Streak (days)</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Star className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-serif text-foreground">{analytics?.avg_points?.toLocaleString() ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Avg Points</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold font-serif text-foreground">Top Students</h3>
            <Link href="/admin/students">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1 text-xs">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {analytics?.top_students.slice(0, 5).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {s.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.branch || "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{s.points.toLocaleString()}</p>
                  <div className="flex items-center justify-end gap-1">
                    <Flame className="h-3 w-3 text-orange-400" />
                    <span className="text-xs text-muted-foreground">{s.streak}</span>
                  </div>
                </div>
              </div>
            ))}
            {!analytics?.top_students.length && (
              <p className="text-sm text-muted-foreground text-center py-4">No students yet</p>
            )}
          </div>
        </GlassCard>

        {/* Inactive Alert */}
        <GlassCard className={analytics && analytics.inactive_students.length > 0 ? "border-red-500/30 bg-red-500/5" : ""}>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="font-semibold font-serif text-foreground">Inactive Students</h3>
            {analytics && (
              <Badge variant="outline" className="text-red-400 border-red-400/30">
                {analytics.inactive_students.length}
              </Badge>
            )}
          </div>
          {analytics && analytics.inactive_students.length === 0 ? (
            <p className="text-sm text-muted-foreground">All students are active. Great job!</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analytics?.inactive_students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-7 w-7 flex-shrink-0">
                      <AvatarFallback className="bg-red-500/20 text-red-400 text-xs">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Last: {formatLastActive(student.last_active)}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 ml-2 flex-shrink-0"
                    onClick={() => handleSendReminder(student)}
                    disabled={remindingId === student.id}
                  >
                    {remindingId === student.id
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <Mail className="h-3 w-3" />
                    }
                  </Button>
                </div>
              ))}
              {analytics && analytics.inactive_students.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  +{analytics.inactive_students.length - 5} more
                </p>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
