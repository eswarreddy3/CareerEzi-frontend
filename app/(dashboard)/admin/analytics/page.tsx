"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts"
import { Users, TrendingUp, Flame, Star, Loader2, Download, Trophy, Zap } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

interface BranchStat {
  branch: string
  avgPoints: number
  count: number
}

interface SectionStat {
  section: string
  avgPoints: number
  count: number
}

interface Analytics {
  total_students: number
  active_this_week: number
  avg_streak: number
  avg_points: number
  engagement_rate: number
  branch_stats: BranchStat[]
  section_stats: SectionStat[]
  top_students: { id: number; name: string; points: number; streak: number; branch: string }[]
}

const COLORS = ["#8B5CF6", "#3B82F6", "#F59E0B", "#EC4899", "#10B981", "#06B6D4"]
const MEDALS = ["🥇", "🥈", "🥉"]

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/admin/analytics")
      .then((res) => setAnalytics(res.data))
      .catch(() => toast.error("Failed to load analytics"))
      .finally(() => setLoading(false))
  }, [])

  function exportCSV() {
    if (!analytics) return
    const rows = [
      ["Name", "Branch", "Points", "Streak"],
      ...analytics.top_students.map(s => [
        `"${s.name}"`, `"${s.branch || ""}"`, s.points, s.streak,
      ]),
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "top_students.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  const engagementRate = analytics?.engagement_rate ??
    (analytics && analytics.total_students > 0
      ? Math.round((analytics.active_this_week / analytics.total_students) * 100)
      : 0)

  const inactiveCount = analytics ? analytics.total_students - analytics.active_this_week : 0

  const engagementData = [
    { name: "Active", value: analytics?.active_this_week ?? 0, fill: "#00D4C8" },
    { name: "Inactive", value: inactiveCount, fill: "#EF4444" },
  ]

  const statCards = [
    { label: "Total Students", value: analytics?.total_students ?? "—", icon: Users, bg: "bg-blue-500/20", text: "text-blue-400" },
    { label: "Active This Week", value: analytics?.active_this_week ?? "—", icon: TrendingUp, bg: "bg-emerald-500/20", text: "text-emerald-400" },
    { label: "Avg Streak", value: analytics?.avg_streak ?? "—", icon: Flame, bg: "bg-orange-500/20", text: "text-orange-400" },
    { label: "Avg Points", value: typeof analytics?.avg_points === "number" ? analytics.avg_points.toLocaleString() : "—", icon: Star, bg: "bg-amber-500/20", text: "text-amber-400" },
    { label: "Engagement Rate", value: `${engagementRate}%`, icon: Zap, bg: "bg-violet-500/20", text: "text-violet-400" },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed performance insights for your college</p>
        </div>
        <Button
          variant="outline"
          onClick={exportCSV}
          className="border-primary/30 text-primary hover:bg-primary/10 gap-2 self-start"
        >
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <GlassCard>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.bg} flex-shrink-0`}>
                  <stat.icon className={`h-5 w-5 ${stat.text}`} />
                </div>
                <div>
                  <p className="text-xl font-bold font-serif text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1: Donut + Branch Avg + Section Avg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Donut */}
        <GlassCard className="min-w-0">
          <h3 className="font-semibold font-serif mb-1 text-foreground">Engagement Overview</h3>
          <p className="text-xs text-muted-foreground mb-3">Active vs inactive this week</p>
          <ChartContainer
            config={{ Active: { color: "#00D4C8" }, Inactive: { color: "#EF4444" } }}
            className="h-[200px] w-full"
          >
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
              >
                {engagementData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ChartContainer>
          <div className="flex justify-around mt-1 pt-2 border-t border-border/50">
            <div className="text-center">
              <p className="text-lg font-bold text-[#00D4C8]">{analytics?.active_this_week ?? 0}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-400">{inactiveCount}</p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-violet-400">{engagementRate}%</p>
              <p className="text-xs text-muted-foreground">Rate</p>
            </div>
          </div>
        </GlassCard>

        {/* Branch Avg Points */}
        <GlassCard className="min-w-0">
          <h3 className="font-semibold font-serif mb-1 text-foreground">Branch Avg Points</h3>
          <p className="text-xs text-muted-foreground mb-3">Average points by branch</p>
          {analytics && analytics.branch_stats.length > 0 ? (
            <ChartContainer
              config={{ avgPoints: { label: "Avg Points", color: "#8B5CF6" } }}
              className="h-[240px] w-full"
            >
              <BarChart data={analytics.branch_stats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis type="number" stroke="#8B92A5" fontSize={11} />
                <YAxis dataKey="branch" type="category" stroke="#8B92A5" fontSize={11} width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgPoints" radius={[0, 4, 4, 0]}>
                  {analytics.branch_stats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No branch data</p>
          )}
        </GlassCard>

        {/* Section Avg Points */}
        <GlassCard className="min-w-0">
          <h3 className="font-semibold font-serif mb-1 text-foreground">Section Avg Points</h3>
          <p className="text-xs text-muted-foreground mb-3">Average points by section</p>
          {analytics && analytics.section_stats && analytics.section_stats.length > 0 ? (
            <ChartContainer
              config={{ avgPoints: { label: "Avg Points", color: "#10B981" } }}
              className="h-[240px] w-full"
            >
              <BarChart data={analytics.section_stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="section" stroke="#8B92A5" fontSize={11} />
                <YAxis stroke="#8B92A5" fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgPoints" radius={[4, 4, 0, 0]}>
                  {analytics.section_stats.map((_, i) => (
                    <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No section data</p>
          )}
        </GlassCard>
      </div>

      {/* Students per Branch */}
      <GlassCard className="min-w-0">
        <h3 className="font-semibold font-serif mb-1 text-foreground">Students per Branch</h3>
        <p className="text-xs text-muted-foreground mb-4">Total student count distribution</p>
        {analytics && analytics.branch_stats.length > 0 ? (
          <ChartContainer
            config={{ count: { label: "Students", color: "#3B82F6" } }}
            className="h-[200px] w-full"
          >
            <BarChart data={analytics.branch_stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
              <XAxis dataKey="branch" stroke="#8B92A5" fontSize={12} />
              <YAxis stroke="#8B92A5" fontSize={12} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {analytics.branch_stats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-10">No branch data available</p>
        )}
      </GlassCard>

      {/* Top 10 Leaderboard with Podium */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-5 w-5 text-amber-400" />
          <h3 className="font-semibold font-serif text-foreground">Top 10 Students</h3>
        </div>

        {/* Podium — top 3 */}
        {analytics && analytics.top_students.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-8">
            {/* 2nd */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-2xl mb-1">🥈</span>
              <div className="text-center mb-2">
                <p className="text-xs font-semibold text-foreground truncate max-w-[72px]">
                  {analytics.top_students[1].name.split(" ")[0]}
                </p>
                <p className="text-xs text-slate-300 font-mono">{analytics.top_students[1].points.toLocaleString()}</p>
              </div>
              <div className="w-16 h-12 bg-slate-500/25 border border-slate-500/40 rounded-t-lg flex items-center justify-center">
                <span className="text-slate-400 font-bold text-sm">2</span>
              </div>
            </motion.div>

            {/* 1st */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-3xl mb-1">🥇</span>
              <div className="text-center mb-2">
                <p className="text-sm font-bold text-foreground truncate max-w-[88px]">
                  {analytics.top_students[0].name.split(" ")[0]}
                </p>
                <p className="text-sm font-bold text-amber-400 font-mono">{analytics.top_students[0].points.toLocaleString()}</p>
              </div>
              <div className="w-20 h-20 bg-amber-500/20 border border-amber-500/40 rounded-t-lg flex items-center justify-center">
                <span className="text-amber-400 font-bold text-lg">1</span>
              </div>
            </motion.div>

            {/* 3rd */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-2xl mb-1">🥉</span>
              <div className="text-center mb-2">
                <p className="text-xs font-semibold text-foreground truncate max-w-[72px]">
                  {analytics.top_students[2].name.split(" ")[0]}
                </p>
                <p className="text-xs text-orange-600 font-mono">{analytics.top_students[2].points.toLocaleString()}</p>
              </div>
              <div className="w-16 h-8 bg-orange-800/25 border border-orange-700/40 rounded-t-lg flex items-center justify-center">
                <span className="text-orange-700 font-bold text-sm">3</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Full list */}
        {analytics && analytics.top_students.length > 0 ? (
          <div className="space-y-2">
            {analytics.top_students.map((s, i) => (
              <motion.div
                key={s.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.04 }}
              >
                <span className="w-8 text-center">
                  {i < 3
                    ? <span className="text-base">{MEDALS[i]}</span>
                    : <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>
                  }
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.branch || "—"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-400" />
                    <span className="text-xs text-muted-foreground">{s.streak}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary w-24 text-right font-mono">
                    {s.points.toLocaleString()} pts
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-10">No students yet</p>
        )}
      </GlassCard>
    </div>
  )
}
