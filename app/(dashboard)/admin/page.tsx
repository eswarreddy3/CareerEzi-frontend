"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { AdminStatCard, IconTile, SectionHeading, SurfaceTexture, adminCardColor } from "@/components/admin-stat-card"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area, AreaChart, CartesianGrid, XAxis, YAxis,
  Pie, PieChart, Cell, Label as ChartLabel,
} from "recharts"
import {
  Users, TrendingUp, Flame, Star, Mail, AlertTriangle, Loader2,
  Crown, ArrowRight, Trophy, CheckCircle, Upload, X,
  BookOpen, Code2, ClipboardCheck, Activity, Target,
  ArrowUpRight, ArrowDownRight, Minus, ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import Link from "next/link"

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ?? "http://localhost:5000"

function resolveLogoUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith("blob:") || url.startsWith("http")) return url
  return `${BACKEND}${url}`
}

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
  engagement_rate: number
  engagement_delta: number
  days: number
  filter_options: { branches: string[]; sections: string[]; passout_years: number[] }
  zero_activity_count: number
  at_risk_count: number
  avg_mcq_accuracy: number
  total_mcq_attempts: number
  assignment_avg_score: number
  total_assignment_attempts: number
  total_coding_submissions: number
  weekly_trend: { week: string; active: number }[]
  readiness_buckets: { range: string; label: string; count: number }[]
  course_completions: { avg_completion_pct: number }[]
  mcq_topic_stats: { topic: string; accuracy: number; total: number }[]
  assignment_module_stats: { module: string; pass_rate: number; attempts: number }[]
  inactive_count: number
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
  return `${diffDays}d ago`
}

function metricStatus(value: number, good: number, warn: number) {
  if (value >= good) return {
    text: "text-success", bg: "bg-success/15", border: "border-success/30",
    bar: "bg-success", label: "On Track",
  }
  if (value >= warn) return {
    text: "text-warning", bg: "bg-warning/15", border: "border-warning/30",
    bar: "bg-warning", label: "Needs Attention",
  }
  return {
    text: "text-danger", bg: "bg-danger/15", border: "border-danger/30",
    bar: "bg-danger", label: "Critical",
  }
}

const MEDALS = ["🥇", "🥈", "🥉"]
const READINESS_COLORS = ["var(--danger)", "var(--warning)", "var(--primary)", "var(--success)"]

function readinessColor(i: number) {
  return READINESS_COLORS[i % READINESS_COLORS.length]
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [remindingId, setRemindingId] = useState<number | null>(null)
  const [remindingAll, setRemindingAll] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [savingLogo, setSavingLogo] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get("/admin/analytics?days=30")
      .then((res) => setAnalytics({ inactive_students: [], inactive_count: 0, ...res.data }))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    api.get("/admin/college-social").then(res => {
      if (res.data.logo_url) setLogoPreview(res.data.logo_url)
    }).catch(() => {})
  }, [])

  async function handleLogoUpload() {
    if (!logoFile) return
    setSavingLogo(true)
    try {
      const form = new FormData()
      form.append("logo", logoFile)
      const res = await api.post("/admin/college-logo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setLogoPreview(res.data.logo_url)
      setLogoFile(null)
      toast.success("College logo updated")
    } catch {
      toast.error("Failed to upload logo")
    } finally {
      setSavingLogo(false)
    }
  }

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

  async function handleRemindAll() {
    if (!analytics?.inactive_students.length) return
    setRemindingAll(true)
    let sent = 0
    for (const student of analytics.inactive_students) {
      try {
        await api.post(`/admin/students/${student.id}/remind`)
        sent++
      } catch {}
    }
    toast.success(`Reminders sent to ${sent} student${sent !== 1 ? "s" : ""}`)
    setRemindingAll(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const data = {
    filter_options: { branches: [], sections: [], passout_years: [] },
    weekly_trend: [] as Analytics["weekly_trend"],
    readiness_buckets: [] as Analytics["readiness_buckets"],
    course_completions: [] as Analytics["course_completions"],
    mcq_topic_stats: [] as Analytics["mcq_topic_stats"],
    assignment_module_stats: [] as Analytics["assignment_module_stats"],
    engagement_delta: 0,
    days: 30,
    zero_activity_count: 0,
    at_risk_count: 0,
    avg_mcq_accuracy: 0,
    total_mcq_attempts: 0,
    assignment_avg_score: 0,
    total_assignment_attempts: 0,
    total_coding_submissions: 0,
    ...analytics,
  }

  const avgCoursePct = data.course_completions.length
    ? Math.round(data.course_completions.reduce((sum, c) => sum + c.avg_completion_pct, 0) / data.course_completions.length)
    : 0
  const readinessTotal = data.readiness_buckets.reduce((sum, b) => sum + b.count, 0)
  const weakestTopic = data.mcq_topic_stats[0]
  const weakestModule = data.assignment_module_stats[0]
  const engagementRate = analytics?.engagement_rate ??
    (analytics && analytics.total_students > 0
      ? Math.round((analytics.active_this_week / analytics.total_students) * 100)
      : 0)

  const inactiveCount = analytics?.inactive_count ?? data.inactive_students?.length ?? 0
  const atRiskCount = data.at_risk_count || 0

  const engagementStatus = metricStatus(engagementRate, 70, 40)
  const mcqStatus = metricStatus(Math.round(data.avg_mcq_accuracy), 70, 50)
  const courseStatus = metricStatus(avgCoursePct, 70, 40)
  const assignmentStatus = metricStatus(Math.round(data.assignment_avg_score), 70, 50)

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg shadow-black/15 ring-1 ring-inset ring-white/10"
        style={{ background: "linear-gradient(120deg, #312E81 0%, #1E1B4B 55%, #3B2C6B 100%)" }}
      >
        <SurfaceTexture />
        {/* soft corner glow */}
        <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          {/* College identity */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl border border-white/30 bg-white/15 flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoPreview ? (
                <img src={resolveLogoUrl(logoPreview)!} alt="College" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {user?.college_name?.[0]?.toUpperCase() ?? "C"}
                </span>
              )}
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white mb-1.5">
                <Crown className="h-3 w-3" />
                {user?.college_name || "Your College"}
              </span>
              <h1 className="text-2xl font-bold font-serif text-white leading-tight">Admin Dashboard</h1>
              <p className="text-sm text-white/80">
                Welcome back, {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : ""}
              </p>
            </div>
          </div>

          {/* Engagement widget + nav buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/20 bg-white/15">
              <div className="text-center">
                <p className="text-2xl font-bold font-serif text-white">{engagementRate}%</p>
                <p className="text-xs text-white/70">Engagement</p>
              </div>
              <div className="h-8 w-px bg-white/25" />
              <div>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-white">
                  {data.engagement_delta > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : data.engagement_delta < 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : <Minus className="h-3 w-3" />}
                  {data.engagement_delta > 0 ? "+" : ""}{data.engagement_delta}%
                </span>
                <p className="text-xs text-white/70">vs last {data.days}d</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/analytics">
                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" /> Analytics
                </Button>
              </Link>
              <Link href="/admin/students">
                <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Students
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {([
          {
            label: "Total Students",
            value: analytics?.total_students ?? 0,
            sub: `${analytics?.active_this_week ?? 0} active this week`,
            icon: Users,
            iconBg: "bg-primary/15",
            iconColor: "text-primary",
            accent: "via-primary",
            trend: null as number | null,
          },
          {
            label: "Active This Week",
            value: `${engagementRate}%`,
            sub: engagementStatus.label,
            icon: Activity,
            iconBg: engagementStatus.bg,
            iconColor: engagementStatus.text,
            accent: engagementRate >= 70 ? "via-success" : engagementRate >= 40 ? "via-warning" : "via-danger",
            trend: data.engagement_delta,
          },
          {
            label: "Avg Points",
            value: typeof analytics?.avg_points === "number" ? analytics.avg_points.toLocaleString() : "—",
            sub: `${analytics?.avg_streak ?? 0} day avg streak`,
            icon: Star,
            iconBg: "bg-warning/15",
            iconColor: "text-warning",
            accent: "via-warning",
            trend: null as number | null,
          },
          {
            label: "At-Risk Students",
            value: atRiskCount,
            sub: atRiskCount === 0 ? "All students active!" : `${inactiveCount} inactive 3+ days`,
            icon: AlertTriangle,
            iconBg: atRiskCount > 0 ? "bg-danger/15" : "bg-success/15",
            iconColor: atRiskCount > 0 ? "text-danger" : "text-success",
            accent: atRiskCount > 0 ? "via-danger" : "via-success",
            trend: null as number | null,
          },
        ] as const).map((stat, i) => (
          <AdminStatCard
            key={stat.label}
            index={i}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            sub={stat.sub}
            trend={stat.trend}
            delay={i * 0.07}
          />
        ))}
      </div>

      {/* ── Learning Health ─────────────────────────────────── */}
      <div className="space-y-3">
        <SectionHeading
          icon={Activity}
          color="#4F46E5"
          title="Learning Health"
          subtitle="Performance across all modules"
          right={
            <Link href="/admin/analytics">
              <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                Deep Dive <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {([
            {
              label: "Course Completion",
              value: avgCoursePct,
              display: `${avgCoursePct}%`,
              sub: "avg across all courses",
              icon: BookOpen,
              href: "/admin/analytics#learning",
              status: courseStatus,
              hasBar: true,
            },
            {
              label: "MCQ Accuracy",
              value: Math.round(data.avg_mcq_accuracy),
              display: `${Math.round(data.avg_mcq_accuracy)}%`,
              sub: weakestTopic ? `Worst: ${weakestTopic.topic}` : `${data.total_mcq_attempts} total attempts`,
              icon: Target,
              href: "/admin/analytics#learning",
              status: mcqStatus,
              hasBar: true,
            },
            {
              label: "Assignment Score",
              value: Math.round(data.assignment_avg_score),
              display: `${Math.round(data.assignment_avg_score)}%`,
              sub: weakestModule ? `Gap: ${weakestModule.module}` : `${data.total_assignment_attempts} attempts`,
              icon: ClipboardCheck,
              href: "/admin/analytics#assessments",
              status: assignmentStatus,
              hasBar: true,
            },
            {
              label: "Coding Submissions",
              value: data.total_coding_submissions,
              display: data.total_coding_submissions.toLocaleString(),
              sub: "total by your students",
              icon: Code2,
              href: "/admin/analytics#coding",
              status: {
                text: "text-coding", bg: "bg-coding/10", border: "border-coding/25",
                bar: "bg-coding", label: "Activity",
              },
              hasBar: false,
            },
          ] as const).map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }} whileHover={{ y: -3 }}>
              <Link href={item.href}>
                <GlassCard className="p-4 h-full card-hover cursor-pointer">
                  <div className="flex items-center justify-between mb-2.5">
                    <IconTile icon={item.icon} color={adminCardColor(i + 4)} size="sm" />
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{item.status.label}</span>
                  </div>
                  <p className="text-2xl font-bold font-serif text-foreground leading-none">{item.display}</p>
                  <p className="text-[11px] font-medium text-foreground/80 mt-1">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{item.sub}</p>
                  {item.hasBar && (
                    <div className="mt-2.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: adminCardColor(i + 4) }}
                        initial={{ width: 0 }} animate={{ width: `${Math.min(item.value as number, 100)}%` }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.9, ease: "easeOut" }} />
                    </div>
                  )}
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Charts ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-3">
          <GlassCard className="relative h-full overflow-hidden border-primary/20 card-hover">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-coding to-success" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <IconTile icon={TrendingUp} color="#3D55C8" />
                <div>
                  <h3 className="font-semibold font-serif text-foreground">Engagement Pulse</h3>
                  <p className="text-xs text-muted-foreground">Weekly active students — last 8 weeks</p>
                </div>
              </div>
              <Badge variant="outline" className={`${engagementStatus.border} ${engagementStatus.text}`}>
                {engagementRate}% this week
              </Badge>
            </div>
            <ChartContainer config={{ active: { label: "Active Students", color: "var(--primary)" } }} className="h-[230px] w-full">
              <AreaChart data={data.weekly_trend} margin={{ top: 8, right: 10, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminPulse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: "var(--primary)", strokeDasharray: "4 3" }} />
                <Area type="monotone" dataKey="active" stroke="var(--primary)" strokeWidth={3} fill="url(#adminPulse)" dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 7, strokeWidth: 2, stroke: "var(--background)" }} animationDuration={1400} />
              </AreaChart>
            </ChartContainer>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="lg:col-span-2">
          <GlassCard className="relative h-full overflow-hidden border-coding/20 card-hover">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-danger via-warning to-success" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <IconTile icon={Target} color="#7B45C9" />
                <div>
                  <h3 className="font-semibold font-serif text-foreground">Readiness Distribution</h3>
                  <p className="text-xs text-muted-foreground">Placement bands for this cohort</p>
                </div>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">{readinessTotal} students</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-4 items-center">
              <ChartContainer config={{ count: { label: "Students", color: "var(--primary)" } }} className="h-[170px] w-full">
                <PieChart>
                  <Pie data={data.readiness_buckets} dataKey="count" nameKey="label" innerRadius={44} outerRadius={70} paddingAngle={4} strokeWidth={0} animationDuration={1200}>
                    {data.readiness_buckets.map((_, i) => <Cell key={i} fill={readinessColor(i)} />)}
                    <ChartLabel
                      content={({ viewBox }) => {
                        const { cx, cy } = viewBox as { cx: number; cy: number }
                        return (
                          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={cx} dy="-4" fontSize="20" fontWeight="700" fill="var(--foreground)">{readinessTotal}</tspan>
                            <tspan x={cx} dy="16" fontSize="10" fill="var(--muted-foreground)">total</tspan>
                          </text>
                        )
                      }}
                    />
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="space-y-2">
                {data.readiness_buckets.map((bucket, i) => {
                  const pct = readinessTotal ? Math.round((bucket.count / readinessTotal) * 100) : 0
                  return (
                    <div key={bucket.label} className="rounded-lg border border-border/60 bg-secondary/20 px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: readinessColor(i) }} />
                          <span className="text-xs font-medium text-foreground">{bucket.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                          <span className="text-xs font-bold" style={{ color: readinessColor(i) }}>{bucket.count}</span>
                        </div>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: readinessColor(i) }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.25 + i * 0.08, duration: 0.8 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Top Students + Inactive ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <IconTile icon={Trophy} color="#C77E33" />
                <div>
                  <h3 className="font-semibold font-serif text-foreground">Top Students</h3>
                  <p className="text-xs text-muted-foreground">Ranked by total points</p>
                </div>
              </div>
              <Link href="/admin/students">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1 text-xs h-7">
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
            <div className="space-y-1.5">
              {analytics?.top_students.slice(0, 5).map((s, i) => (
                <motion.div
                  key={s.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/40 transition-colors group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <div className="w-7 text-center flex-shrink-0">
                    {i < 3 ? (
                      <span className="text-lg">{MEDALS[i]}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground font-bold">{i + 1}</span>
                    )}
                  </div>
                  <UserAvatar name={s.name} photoUrl={(s as any).avatar} size="sm" points={s.points} />
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/students/${s.id}`}>
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{s.name}</p>
                    </Link>
                    <p className="text-xs text-muted-foreground">{s.branch || "—"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary">{s.points.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1">
                      <Flame className="h-3 w-3 text-streak" />
                      <span className="text-xs text-muted-foreground">{s.streak}d</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {!analytics?.top_students.length && (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Users className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No students yet</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className={`h-full transition-colors ${inactiveCount > 0 ? "border-danger/30" : "border-success/20"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <IconTile
                  icon={inactiveCount === 0 ? CheckCircle : AlertTriangle}
                  color={inactiveCount > 0 ? "#C0476F" : "#1E9D6B"}
                />
                <div>
                  <h3 className="font-semibold font-serif text-foreground">Inactive Students</h3>
                  <p className="text-xs text-muted-foreground">3+ days without activity</p>
                </div>
                {inactiveCount > 0 && (
                  <Badge className="bg-danger/15 text-danger border-danger/30 text-xs">{inactiveCount}</Badge>
                )}
              </div>
              {analytics && analytics.inactive_students.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-danger/30 text-danger hover:bg-danger/10 text-xs gap-1 h-7"
                  onClick={handleRemindAll}
                  disabled={remindingAll}
                >
                  {remindingAll ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mail className="h-3 w-3" />}
                  Remind All
                </Button>
              )}
            </div>

            {inactiveCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <p className="text-sm font-medium text-foreground">All students are active!</p>
                <p className="text-xs text-muted-foreground">Great engagement across the cohort</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {analytics?.inactive_students.slice(0, 8).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2.5 rounded-xl bg-danger/5 border border-danger/10 hover:border-danger/25 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UserAvatar name={student.name} photoUrl={(student as any).avatar} size="xs" points={(student as any).points} fallbackClassName="bg-danger/20 text-danger" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                        <p className="text-xs text-danger/80">{formatLastActive(student.last_active)}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-danger/30 text-danger hover:bg-danger/10 ml-2 flex-shrink-0 h-7 w-7 p-0"
                      onClick={() => handleSendReminder(student)}
                      disabled={remindingId === student.id}
                      title={`Send reminder to ${student.name}`}
                    >
                      {remindingId === student.id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <Mail className="h-3 w-3" />
                      }
                    </Button>
                  </div>
                ))}
                {analytics && analytics.inactive_students.length > 8 && (
                  <Link href="/admin/students" className="block text-xs text-primary hover:underline text-center pt-1">
                    +{analytics.inactive_students.length - 8} more students →
                  </Link>
                )}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* ── College Logo ────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <IconTile icon={Upload} color="#1C8B8F" />
            <div>
              <h3 className="font-semibold font-serif text-foreground">College Logo</h3>
              <p className="text-xs text-muted-foreground">Shown as your college profile picture</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl border-2 border-border bg-secondary/50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              {logoPreview ? (
                <img src={resolveLogoUrl(logoPreview)!} alt="College logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-muted-foreground">
                  {user?.college_name?.[0]?.toUpperCase() ?? "?"}
                </span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <label
                htmlFor="admin-logo-input"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border bg-secondary/30 hover:border-primary/50 cursor-pointer transition-colors text-sm text-muted-foreground hover:text-foreground"
              >
                <Upload className="h-4 w-4" />
                {logoFile ? logoFile.name : "Choose logo (JPG, PNG, WEBP — max 2 MB)"}
              </label>
              <input
                id="admin-logo-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setLogoFile(file)
                  setLogoPreview(URL.createObjectURL(file))
                }}
              />
              {logoFile && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleLogoUpload}
                    disabled={savingLogo}
                    className="bg-primary text-primary-foreground h-8"
                  >
                    {savingLogo ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                    Upload Logo
                  </Button>
                  <button
                    type="button"
                    onClick={() => { setLogoFile(null); setLogoPreview(null) }}
                    className="flex items-center gap-1 text-xs text-danger hover:text-danger/80"
                  >
                    <X className="h-3 w-3" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

    </div>
  )
}
