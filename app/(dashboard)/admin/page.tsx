"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area, AreaChart, CartesianGrid, XAxis, YAxis,
  Pie, PieChart, Cell, Label as ChartLabel,
} from "recharts"
import {
  Users, TrendingUp, Flame, Star, Mail, AlertTriangle, Loader2,
  Crown, ArrowRight, Share2, Trophy, CheckCircle, Upload, X,
  BookOpen, Code2, ClipboardCheck,
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
  return `${diffDays} days ago`
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <label className="space-y-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 min-w-[125px] rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/50 focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

const MEDALS = ["🥇", "🥈", "🥉"]

const READINESS_COLORS = ["var(--danger)", "var(--warning)", "var(--primary)", "var(--success)"]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

function readinessColor(i: number) {
  return READINESS_COLORS[i % READINESS_COLORS.length]
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [remindingId, setRemindingId] = useState<number | null>(null)
  const [remindingAll, setRemindingAll] = useState(false)

  const [linkedin, setLinkedin] = useState("")
  const [linkedinEmbeds, setLinkedinEmbeds] = useState(["", "", ""])
  const [instagram, setInstagram] = useState("")
  const [instagramEmbeds, setInstagramEmbeds] = useState(["", "", ""])
  const [savingSocial, setSavingSocial] = useState(false)

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
      setLinkedin(res.data.linkedin_url ?? "")
      const li = res.data.linkedin_post_embeds ?? []
      setLinkedinEmbeds([li[0] ?? "", li[1] ?? "", li[2] ?? ""])
      setInstagram(res.data.instagram_url ?? "")
      const ig = res.data.instagram_post_embeds ?? []
      setInstagramEmbeds([ig[0] ?? "", ig[1] ?? "", ig[2] ?? ""])
      if (res.data.logo_url) setLogoPreview(res.data.logo_url)
    }).catch(() => {})
  }, [])

  async function handleSaveSocial() {
    setSavingSocial(true)
    try {
      await api.patch("/admin/college-social", {
        linkedin_url: linkedin.trim() || null,
        linkedin_post_embeds: linkedinEmbeds.map(u => u.trim()).filter(Boolean),
        instagram_url: instagram.trim() || null,
        instagram_post_embeds: instagramEmbeds.map(u => u.trim()).filter(Boolean),
      })
      toast.success("Social links saved")
    } catch {
      toast.error("Failed to save social links")
    } finally {
      setSavingSocial(false)
    }
  }

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
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
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
  const readinessTotal = data.readiness_buckets.reduce((sum, bucket) => sum + bucket.count, 0)
  const weakestTopic = data.mcq_topic_stats[0]
  const weakestModule = data.assignment_module_stats[0]
  const engagementRate = analytics?.engagement_rate ??
    (analytics && analytics.total_students > 0
      ? Math.round((analytics.active_this_week / analytics.total_students) * 100)
      : 0)

  const stats = [
    {
      label: "Total Students",
      value: analytics?.total_students ?? "—",
      icon: Users,
      bg: "bg-primary/20",
      text: "text-primary",
    },
    {
      label: "Avg Streak",
      value: analytics?.avg_streak ?? "—",
      icon: Flame,
      bg: "bg-streak/20",
      text: "text-streak",
      sub: "days",
    },
    {
      label: "Avg Points",
      value: typeof analytics?.avg_points === "number" ? analytics.avg_points.toLocaleString() : "—",
      icon: Star,
      bg: "bg-warning/20",
      text: "text-warning",
    },
    {
      label: "Inactive",
      value: analytics?.inactive_count ?? data.inactive_students.length,
      icon: AlertTriangle,
      bg: "bg-danger/20",
      text: "text-danger",
      sub: "inactive 3+ days",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-coding/10 p-5 shadow-2xl shadow-primary/5 flex flex-col xl:flex-row xl:items-start justify-between gap-4"
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)] pointer-events-none" />
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : ""}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Engagement {data.engagement_delta >= 0 ? "up" : "down"} {Math.abs(data.engagement_delta)}% vs previous {data.days} days
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap justify-start xl:justify-end">
            <Badge className="bg-warning/20 text-warning border-warning/30">
              <Crown className="h-4 w-4 mr-2" />
              {user?.college_name || "Your College"}
            </Badge>
            <Link href="/admin/analytics">
              <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> Full Analytics
              </Button>
            </Link>
            <Link href="/admin/students">
              <Button size="sm" variant="outline" className="border-border text-muted-foreground hover:text-foreground gap-1">
                <Users className="h-3.5 w-3.5" /> Students
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Core stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ y: -4, scale: 1.01 }}>
            <GlassCard className="h-full relative overflow-hidden border-primary/10 hover:border-primary/30 transition-colors">
              <motion.div
                className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ delay: i * 0.2, duration: 2.4, repeat: Infinity, repeatDelay: 5 }}
              />
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.bg} flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 ${stat.text}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold font-serif text-foreground leading-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  {stat.sub && <p className="text-xs text-muted-foreground/70">{stat.sub}</p>}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Today&apos;s Action Board</p>
            <h2 className="text-xl font-bold font-serif text-foreground">Admin priorities</h2>
          </div>
          <Link href="/admin/analytics">
            <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
              Open Deep Analytics <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
          {
            label: "Course Completion",
            value: `${avgCoursePct}%`,
            sub: "average across active courses",
            icon: BookOpen,
            tone: "text-primary",
            href: "/admin/analytics#learning",
          },
          {
            label: "Weak MCQ Topic",
            value: weakestTopic ? `${weakestTopic.accuracy}%` : "-",
            sub: weakestTopic ? `${weakestTopic.topic} - ${weakestTopic.total} attempts` : "no attempts yet",
            icon: AlertTriangle,
            tone: "text-danger",
            href: "/admin/analytics#learning",
          },
          {
            label: "Assignment Gap",
            value: weakestModule ? `${weakestModule.pass_rate}%` : "-",
            sub: weakestModule ? `${weakestModule.module} - ${weakestModule.attempts} attempts` : "no attempts yet",
            icon: ClipboardCheck,
            tone: "text-warning",
            href: "/admin/analytics#assessments",
          },
          {
            label: "Coding Activity",
            value: data.total_coding_submissions.toLocaleString(),
            sub: "submissions in selected cohort",
            icon: Code2,
            tone: "text-coding",
            href: "/admin/analytics#coding",
          },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }} whileHover={{ y: -3 }}>
            <Link href={item.href}>
              <GlassCard className="p-4 h-full relative overflow-hidden border-border/80 hover:border-primary/35 transition-colors cursor-pointer">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary/70 to-coding/0" />
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-secondary/60 p-2">
                  <item.icon className={`h-4 w-4 ${item.tone}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`mt-1 text-xl font-bold font-serif ${item.tone}`}>{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">{item.sub}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/60" />
              </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-3">
          <GlassCard className="relative h-full overflow-hidden border-primary/20">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-coding to-success" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold font-serif text-foreground">Engagement Pulse</h3>
                <p className="text-xs text-muted-foreground">Active students across the selected period</p>
              </div>
              <Badge variant="outline" className="border-success/30 text-success">{engagementRate}% live</Badge>
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
          <GlassCard className="relative h-full overflow-hidden border-coding/20">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-danger via-warning to-success" />
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold font-serif text-foreground">Readiness Distribution</h3>
                <p className="text-xs text-muted-foreground">Placement bands for this cohort</p>
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
                    <button key={bucket.label} type="button" className="w-full text-left rounded-lg border border-border/60 bg-secondary/20 px-3 py-2 hover:border-primary/40 hover:bg-secondary/40 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-foreground">{bucket.label}</span>
                        <span className="text-xs font-bold" style={{ color: readinessColor(i) }}>{bucket.count}</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: readinessColor(i) }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.25 + i * 0.08, duration: 0.8 }} />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                <h3 className="font-semibold font-serif text-foreground">Top Students</h3>
              </div>
              <Link href="/admin/students">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1 text-xs">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {analytics?.top_students.slice(0, 5).map((s, i) => (
                <motion.div
                  key={s.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <span className="w-6 text-center text-base">
                    {i < 3 ? MEDALS[i] : <span className="text-xs text-muted-foreground font-medium">{i + 1}</span>}
                  </span>
                  <UserAvatar name={s.name} photoUrl={(s as any).avatar} size="sm" points={s.points} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.branch || "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{s.points.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1">
                      <Flame className="h-3 w-3 text-streak" />
                      <span className="text-xs text-muted-foreground">{s.streak}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {!analytics?.top_students.length && (
                <p className="text-sm text-muted-foreground text-center py-6">No students yet</p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Inactive Alert */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className={`h-full ${analytics && analytics.inactive_students.length > 0 ? "border-danger/30 bg-danger/5" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {analytics?.inactive_students.length === 0
                  ? <CheckCircle className="h-5 w-5 text-success" />
                  : <AlertTriangle className="h-5 w-5 text-danger" />
                }
                <h3 className="font-semibold font-serif text-foreground">Inactive Students</h3>
                {analytics && (
                  <Badge variant="outline" className="text-danger border-danger/30 text-xs">
                    {analytics.inactive_students.length}
                  </Badge>
                )}
              </div>
              {analytics && analytics.inactive_students.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-danger/30 text-danger hover:bg-danger/10 text-xs gap-1"
                  onClick={handleRemindAll}
                  disabled={remindingAll}
                >
                  {remindingAll ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mail className="h-3 w-3" />}
                  Remind All
                </Button>
              )}
            </div>

            {analytics && analytics.inactive_students.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <CheckCircle className="h-10 w-10 text-success/50" />
                <p className="text-sm text-muted-foreground">All students are active!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {analytics?.inactive_students.slice(0, 8).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <UserAvatar name={student.name} photoUrl={(student as any).avatar} size="xs" fallbackClassName="bg-danger/20 text-danger" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Last: {formatLastActive(student.last_active)}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-danger/30 text-danger hover:bg-danger/10 ml-2 flex-shrink-0"
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
                {analytics && analytics.inactive_students.length > 8 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{analytics.inactive_students.length - 8} more —{" "}
                    <Link href="/admin/students" className="text-primary hover:underline">view all</Link>
                  </p>
                )}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* College Logo */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <Upload className="h-5 w-5 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">College Logo</h3>
            <span className="text-xs text-muted-foreground">Shown as your college profile picture</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl border border-border bg-secondary/50 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border bg-secondary/30 hover:border-primary/50 cursor-pointer transition-colors text-sm text-muted-foreground hover:text-foreground"
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

      {/* Social Links */}
      {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <Share2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">College Social Links</h3>
            <span className="text-xs text-muted-foreground">Shown in the College Feed for all students</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            LinkedIn
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-foreground">
                  <span className="w-4 h-4 rounded bg-[#0A66C2] inline-flex items-center justify-center text-white text-[9px] font-bold">in</span>
                  LinkedIn Profile URL
                </Label>
                <Input value={linkedin} onChange={e => setLinkedin(e.target.value)}
                  placeholder="https://www.linkedin.com/company/college" className="bg-secondary/50" />
              </div>
              <div className="space-y-2 rounded-xl border border-[#0A66C2]/20 bg-[#0A66C2]/5 p-3">
                <p className="text-xs font-semibold text-foreground">LinkedIn Post Embeds (up to 3)</p>
                <p className="text-xs text-muted-foreground">On any post → ··· → Embed this post → copy the <code className="bg-secondary px-1 rounded">src=</code> URL.</p>
                {[0, 1, 2].map(i => (
                  <Input key={i} value={linkedinEmbeds[i]}
                    onChange={e => {
                      let val = e.target.value
                      const m = val.match(/src=["']([^"']+)["']/)
                      if (m) val = m[1]
                      setLinkedinEmbeds(prev => { const n = [...prev]; n[i] = val; return n })
                    }}
                    placeholder="Paste iframe src URL or full <iframe> code"
                    className="bg-secondary/50 text-xs font-mono" />
                ))}
              </div>
            </div>

            Instagram
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-foreground">
                  <span className="w-4 h-4 rounded-md inline-flex items-center justify-center text-white text-[9px]"
                    style={{ background: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)" }}>◉</span>
                  Instagram Profile URL
                </Label>
                <Input value={instagram} onChange={e => setInstagram(e.target.value)}
                  placeholder="https://www.instagram.com/college_handle/" className="bg-secondary/50" />
              </div>
              <div className="space-y-2 rounded-xl border border-[#E1306C]/20 bg-[#E1306C]/5 p-3">
                <p className="text-xs font-semibold text-foreground">Instagram Post URLs (up to 3)</p>
                <p className="text-xs text-muted-foreground">Open a post → copy its URL from the address bar. e.g. <code className="bg-secondary px-1 rounded">https://www.instagram.com/p/ABC123/</code></p>
                {[0, 1, 2].map(i => (
                  <Input key={i} value={instagramEmbeds[i]}
                    onChange={e => setInstagramEmbeds(prev => { const n = [...prev]; n[i] = e.target.value; return n })}
                    placeholder="https://www.instagram.com/p/..."
                    className="bg-secondary/50 text-xs font-mono" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveSocial} disabled={savingSocial} className="bg-primary text-primary-foreground">
              {savingSocial ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Social Links
            </Button>
          </div>
        </GlassCard>
      </motion.div> */}
    </div>
  )
}
