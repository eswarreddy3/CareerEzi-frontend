"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell,
  Line, LineChart, PieChart, Pie, Legend,
} from "recharts"
import {
  Users, TrendingUp, Flame, Loader2, Download,
  Trophy, AlertTriangle, BookOpen, Target, Activity,
  UserX, Send, Code2, GitBranch, ClipboardCheck,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

interface ReadinessBucket { range: string; label: string; count: number }
interface WeekPoint       { week: string; active: number }
interface MCQTopicStat    { topic: string; total: number; correct: number; accuracy: number }
interface CourseStat      { course_id: number; course_title: string; students_started: number; total_students: number; avg_completion_pct: number; total_lessons: number }
interface AtRiskStudent     { id: number; name: string; email: string; branch: string | null; section: string | null; roll_number: string | null; points: number; last_active: string | null }
interface TopStudent        { id: number; name: string; points: number; streak: number; branch: string | null }
interface BranchStat        { branch: string; avgPoints: number; count: number }
interface AssignmentModStat { module: string; attempts: number; passed: number; pass_rate: number; avg_score: number }
interface CodingDiff        { difficulty: string; solved: number; total: number }

interface Analytics {
  total_students: number
  active_this_week: number
  avg_streak: number
  avg_points: number
  engagement_rate: number
  zero_activity_count: number
  weekly_trend: WeekPoint[]
  mcq_topic_stats: MCQTopicStat[]
  course_completions: CourseStat[]
  readiness_buckets: ReadinessBucket[]
  at_risk_students: AtRiskStudent[]
  at_risk_count: number
  branch_stats: BranchStat[]
  assignment_module_stats: AssignmentModStat[]
  coding_summary: CodingDiff[]
  total_coding_submissions: number
  top_students: TopStudent[]
}

const MEDALS = ["🥇", "🥈", "🥉"]

function daysSince(iso: string | null) {
  if (!iso) return null
  const diff = Date.now() - new Date(iso).getTime()
  return Math.floor(diff / 86400000)
}

function accuracyColor(pct: number) {
  if (pct >= 70) return "#10B981"
  if (pct >= 40) return "#F59E0B"
  return "#EF4444"
}

function readinessColor(i: number) {
  return ["#EF4444", "#F59E0B", "#6366F1", "#10B981"][i]
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading]     = useState(true)
  const [reminding, setReminding] = useState<number | null>(null)

  useEffect(() => {
    api.get("/admin/analytics")
      .then(res => setAnalytics(res.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [])

  async function sendRemind(student: AtRiskStudent) {
    setReminding(student.id)
    try {
      await api.post(`/admin/students/${student.id}/remind`)
      toast.success(`Reminder sent to ${student.name}`)
    } catch {
      toast.error("Failed to send reminder")
    } finally {
      setReminding(null)
    }
  }

  function exportCSV() {
    if (!analytics) return
    const rows = [
      ["Name", "Branch", "Points", "Streak"],
      ...analytics.top_students.map(s => [`"${s.name}"`, `"${s.branch || ""}"`, s.points, s.streak]),
    ]
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href = url; a.download = "top_students.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  const a = {
    branch_stats: [],
    assignment_module_stats: [],
    coding_summary: [],
    total_coding_submissions: 0,
    ...analytics!,
  }
  const avgCoursePct = a.course_completions.length
    ? Math.round(a.course_completions.reduce((s, c) => s + c.avg_completion_pct, 0) / a.course_completions.length)
    : 0

  const statCards = [
    { label: "Total Students",    value: a.total_students,                       icon: Users,         bg: "bg-blue-500/10",   text: "text-blue-500"   },
    { label: "Active This Week",  value: a.active_this_week,                     icon: Activity,      bg: "bg-emerald-500/10",text: "text-emerald-500"},
    { label: "Avg Streak",        value: `${a.avg_streak}d`,                     icon: Flame,         bg: "bg-orange-500/10", text: "text-orange-500" },
    { label: "At Risk (14d)",     value: a.at_risk_count,                        icon: AlertTriangle, bg: "bg-red-500/10",    text: "text-red-500"    },
    { label: "Avg Course Done",   value: `${avgCoursePct}%`,                     icon: BookOpen,      bg: "bg-violet-500/10", text: "text-violet-500" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Performance & engagement insights for your college</p>
        </div>
        <Button variant="outline" onClick={exportCSV} className="gap-2 self-start">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </motion.div>

      {/* ── Row 1: Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${s.bg} flex-shrink-0`}>
                  <s.icon className={`h-4 w-4 ${s.text}`} />
                </div>
                <div>
                  <p className="text-xl font-bold font-serif text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* ── Row 2: Weekly trend + Placement readiness ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Weekly activity trend */}
        <GlassCard className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">Weekly Activity Trend</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Distinct active students per week (last 8 weeks)</p>
          {a.weekly_trend.length > 0 ? (
            <ChartContainer config={{ active: { label: "Active Students", color: "#6366F1" } }} className="h-[200px] w-full">
              <LineChart data={a.weekly_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="active" stroke="#6366F1" strokeWidth={2} dot={{ r: 3, fill: "#6366F1" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">No activity data yet</p>
          )}
        </GlassCard>

        {/* Placement readiness */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">Placement Readiness</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Students grouped by total points</p>
          <div className="space-y-3">
            {a.readiness_buckets.map((b, i) => {
              const pct = a.total_students > 0 ? Math.round(b.count / a.total_students * 100) : 0
              return (
                <div key={b.range}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{b.label}</span>
                      <span className="text-xs text-muted-foreground">{b.range} pts</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: readinessColor(i) }}>{b.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: readinessColor(i) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              )
            })}
            {a.zero_activity_count > 0 && (
              <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                <span className="text-red-500 font-semibold">{a.zero_activity_count}</span> students have never been active
              </p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* ── Row 3: MCQ topic accuracy + Course completions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MCQ accuracy by topic */}
        <GlassCard>
          <h3 className="font-semibold font-serif text-foreground mb-1">MCQ Accuracy by Topic</h3>
          <p className="text-xs text-muted-foreground mb-4">College-wide — sorted weakest first</p>
          {a.mcq_topic_stats.length > 0 ? (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {a.mcq_topic_stats.slice(0, 12).map(t => (
                <div key={t.topic}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground truncate max-w-[60%]">{t.topic}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{t.correct}/{t.total}</span>
                      <span className="text-xs font-semibold w-10 text-right" style={{ color: accuracyColor(t.accuracy) }}>
                        {t.accuracy}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: accuracyColor(t.accuracy) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${t.accuracy}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No MCQ data yet</p>
          )}
          {a.mcq_topic_stats.length > 0 && (
            <div className="flex gap-4 mt-4 pt-3 border-t border-border/50">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt;40% weak</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 40–69%</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> ≥70% good</span>
            </div>
          )}
        </GlassCard>

        {/* Course completion rates */}
        <GlassCard>
          <h3 className="font-semibold font-serif text-foreground mb-1">Course Completion Rates</h3>
          <p className="text-xs text-muted-foreground mb-4">Avg % completed · among students who started</p>
          {a.course_completions.length > 0 ? (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {a.course_completions.map(c => (
                <div key={c.course_id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground truncate max-w-[60%]">{c.course_title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{c.students_started} students</span>
                      <span className="text-xs font-semibold text-primary w-8 text-right">{c.avg_completion_pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${c.avg_completion_pct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No course progress yet</p>
          )}
        </GlassCard>
      </div>

      {/* ── Row 4: Branch performance chart ── */}
      {a.branch_stats.length > 0 && (
        <GlassCard>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="h-4 w-4 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">Branch Performance</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Average points per branch</p>
          <ChartContainer
            config={{ avgPoints: { label: "Avg Points", color: "#6366F1" } }}
            className="h-[220px] w-full"
          >
            <BarChart data={a.branch_stats} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} />
              <YAxis dataKey="branch" type="category" stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} width={72} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(val: number, _: string, props: { payload?: BranchStat }) => [
                  `${val} pts · ${props.payload?.count ?? 0} students`, "Avg Points"
                ]}
              />
              <Bar dataKey="avgPoints" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {a.branch_stats.map((_, i) => (
                  <Cell key={i} fill={["#6366F1","#8B5CF6","#3B82F6","#06B6D4","#10B981","#F59E0B"][i % 6]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </GlassCard>
      )}

      {/* ── Row 5: Assignment pass rates + Coding breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Assignment module pass rates */}
        <GlassCard className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">Assignment Pass Rates</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">% of attempts scoring ≥50% per module</p>
          {a.assignment_module_stats.length > 0 ? (
            <ChartContainer
              config={{ pass_rate: { label: "Pass Rate %", color: "#10B981" }, avg_score: { label: "Avg Score %", color: "#6366F1" } }}
              className="h-[240px] w-full"
            >
              <BarChart data={[...a.assignment_module_stats].reverse()} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="module" type="category" stroke="var(--muted-foreground)" fontSize={10} tick={{ fill: "var(--muted-foreground)" }} width={110} />
                <ChartTooltip content={<ChartTooltipContent />} formatter={(val: number) => [`${val}%`]} />
                <Bar dataKey="pass_rate" name="Pass Rate %" radius={[0, 3, 3, 0]} maxBarSize={18}>
                  {a.assignment_module_stats.map((s) => (
                    <Cell key={s.module} fill={s.pass_rate >= 70 ? "#10B981" : s.pass_rate >= 40 ? "#F59E0B" : "#EF4444"} />
                  ))}
                </Bar>
                <Bar dataKey="avg_score" name="Avg Score %" radius={[0, 3, 3, 0]} maxBarSize={18} fill="#6366F140" />
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">No assignment attempts yet</p>
          )}
        </GlassCard>

        {/* Coding difficulty breakdown */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold font-serif text-foreground">Coding Problems Solved</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Unique problems solved across all students</p>
          {a.coding_summary.some(d => d.solved > 0) ? (
            <>
              <ChartContainer
                config={{
                  Easy:   { label: "Easy",   color: "#10B981" },
                  Medium: { label: "Medium", color: "#F59E0B" },
                  Hard:   { label: "Hard",   color: "#EF4444" },
                }}
                className="h-[160px] w-full"
              >
                <PieChart>
                  <Pie data={a.coding_summary} dataKey="solved" nameKey="difficulty" cx="50%" cy="50%" innerRadius={40} outerRadius={68} paddingAngle={3}>
                    {a.coding_summary.map((d) => (
                      <Cell key={d.difficulty} fill={d.difficulty === "Easy" ? "#10B981" : d.difficulty === "Medium" ? "#F59E0B" : "#EF4444"} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ChartContainer>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/50">
                {a.coding_summary.map(d => (
                  <div key={d.difficulty} className="text-center">
                    <p className="text-base font-bold font-serif" style={{ color: d.difficulty === "Easy" ? "#10B981" : d.difficulty === "Medium" ? "#F59E0B" : "#EF4444" }}>
                      {d.solved}<span className="text-xs text-muted-foreground font-normal">/{d.total}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{d.difficulty}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {a.total_coding_submissions.toLocaleString()} total submissions
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">No coding submissions yet</p>
          )}
        </GlassCard>
      </div>

      {/* ── Row 6: At-risk students ── */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserX className="h-4 w-4 text-red-500" />
            <h3 className="font-semibold font-serif text-foreground">At-Risk Students</h3>
            {a.at_risk_count > 0 && (
              <Badge variant="destructive" className="text-xs">{a.at_risk_count}</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Inactive for 14+ days</p>
        </div>

        {a.at_risk_students.length > 0 ? (
          <div className="space-y-2">
            {a.at_risk_students.map((s, i) => {
              const days = daysSince(s.last_active)
              return (
                <motion.div
                  key={s.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-red-500">
                      {s.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[s.branch, s.section].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-foreground">{s.points} pts</p>
                      <p className="text-xs text-red-400">
                        {days === null ? "Never active" : `${days}d ago`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-xs border-primary/30 text-primary hover:bg-primary/10"
                      disabled={reminding === s.id}
                      onClick={() => sendRemind(s)}
                    >
                      {reminding === s.id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <Send className="h-3 w-3" />
                      }
                      Remind
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            All students active in the last 14 days
          </p>
        )}
      </GlassCard>

      {/* ── Row 7: Top 10 leaderboard ── */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-4 w-4 text-amber-400" />
          <h3 className="font-semibold font-serif text-foreground">Top 10 Students</h3>
        </div>

        {a.top_students.length > 0 ? (
          <div className="space-y-1.5">
            {a.top_students.map((s, i) => (
              <motion.div
                key={s.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/40 transition-colors"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <span className="w-7 text-center flex-shrink-0">
                  {i < 3
                    ? <span className="text-base">{MEDALS[i]}</span>
                    : <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>
                  }
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.branch || "—"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-400" />
                    <span className="text-xs text-muted-foreground">{s.streak}d</span>
                  </div>
                  <span className="text-sm font-semibold text-primary w-24 text-right font-mono">
                    {s.points.toLocaleString()} pts
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No students yet</p>
        )}
      </GlassCard>
    </div>
  )
}
