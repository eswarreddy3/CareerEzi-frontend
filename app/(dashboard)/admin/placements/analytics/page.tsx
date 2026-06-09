"use client"

import { useEffect, useMemo, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ComposedChart, Line, Legend,
} from "recharts"
import {
  GraduationCap, TrendingUp, IndianRupee, Building2, Users, Briefcase,
  Award, Download, RotateCcw,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { motion } from "framer-motion"

/* ── Types ──────────────────────────────────────────────────────────────── */
interface Summary {
  total_placed: number; total_selections: number; total_students: number
  placement_rate: number; joined_count: number; total_drives: number
  companies_visited: number; highest_ctc: number | null; lowest_ctc: number | null; avg_ctc: number | null
}
interface BranchRow { branch: string; placed: number; total: number; rate: number; avg_ctc: number | null }
interface CompanyRow { company: string; selections: number; students: number; highest_ctc: number | null }
interface TrendRow { period: string; drives: number; selections: number }
interface AlumniRow { passout_year: number; placed: number; total: number; rate: number; highest_ctc: number | null }
interface TpoRow { officer_id: number; officer_name: string; drives: number; registrations: number; placed: number; conversion_rate: number; avg_ctc: number | null }
interface Analytics {
  summary: Summary
  branch_wise: BranchRow[]
  company_wise: CompanyRow[]
  ctc_distribution: { band: string; count: number }[]
  drives_trend: TrendRow[]
  alumni: AlumniRow[]
  tpo_metrics: TpoRow[]
  filter_options: {
    branches: string[]; passout_years: number[]; industries: string[]
    years: number[]; companies: string[]; drives: { id: number; label: string }[]
  }
}

const STATUS_LABELS: Record<string, string> = {
  selected: "Placed", shortlisted: "Shortlisted", registered: "Registered", rejected: "Rejected", all: "Selections",
}

const PALETTE = ["#6366F1", "#14B8A6", "#F59E0B", "#EC4899", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444", "#06B6D4", "#F97316"]
const TOOLTIP_STYLE = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)" }

const ctc = (v: number | null | undefined) => (v != null ? `₹${v} LPA` : "—")

/* ── KPI card ───────────────────────────────────────────────────────────── */
function Kpi({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ background: `${color}1A` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold truncate">{value}</p>
          {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
        </div>
      </div>
    </GlassCard>
  )
}

function ChartCard({ title, subtitle, children, empty }: {
  title: string; subtitle?: string; children: React.ReactNode; empty?: boolean
}) {
  return (
    <GlassCard className="p-5">
      <div className="mb-4">
        <h2 className="font-semibold">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {empty
        ? <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">No data for the current filters.</div>
        : children}
    </GlassCard>
  )
}

/* ── CSV export ─────────────────────────────────────────────────────────── */
function exportCSV(data: Analytics) {
  const lines: string[] = []
  const cell = (v: any) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
  const block = (title: string, header: string[], rows: any[][]) => {
    lines.push(title); lines.push(header.map(cell).join(","))
    rows.forEach(r => lines.push(r.map(cell).join(",")))
    lines.push("")
  }
  const s = data.summary
  block("Summary", ["Metric", "Value"], [
    ["Total Placed", s.total_placed], ["Total Selections", s.total_selections],
    ["Placement Rate %", s.placement_rate], ["Joined", s.joined_count],
    ["Total Students", s.total_students], ["Drives Conducted", s.total_drives],
    ["Companies Visited", s.companies_visited], ["Highest CTC", s.highest_ctc ?? ""],
    ["Lowest CTC", s.lowest_ctc ?? ""], ["Avg CTC", s.avg_ctc ?? ""],
  ])
  block("Branch-wise", ["Branch", "Placed", "Total", "Rate %", "Avg CTC"],
    data.branch_wise.map(b => [b.branch, b.placed, b.total, b.rate, b.avg_ctc ?? ""]))
  block("Company-wise", ["Company", "Selections", "Students", "Highest CTC"],
    data.company_wise.map(c => [c.company, c.selections, c.students, c.highest_ctc ?? ""]))
  block("Drives Trend", ["Period", "Drives", "Selections"],
    data.drives_trend.map(t => [t.period, t.drives, t.selections]))
  block("Alumni (by batch)", ["Passout Year", "Placed", "Total", "Rate %", "Highest CTC"],
    data.alumni.map(a => [a.passout_year, a.placed, a.total, a.rate, a.highest_ctc ?? ""]))
  block("TPO Performance", ["Officer", "Drives", "Registrations", "Placed", "Conversion %", "Avg CTC"],
    data.tpo_metrics.map(t => [t.officer_name, t.drives, t.registrations, t.placed, t.conversion_rate, t.avg_ctc ?? ""]))

  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = `Placement_Analytics_${new Date().toISOString().slice(0, 10)}.csv`; a.click()
  URL.revokeObjectURL(url)
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function PlacementAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  const [year, setYear] = useState("all")
  const [status, setStatus] = useState("selected")
  const [source, setSource] = useState("all")
  const [passoutYear, setPassoutYear] = useState("all")
  const [branch, setBranch] = useState("all")
  const [industry, setIndustry] = useState("all")
  const [company, setCompany] = useState("all")
  const [driveId, setDriveId] = useState("all")
  const [granularity, setGranularity] = useState<"month" | "quarter">("month")

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = { granularity, status, source }
    if (year !== "all") params.year = year
    if (passoutYear !== "all") params.passout_year = passoutYear
    if (branch !== "all") params.branch = branch
    if (industry !== "all") params.industry = industry
    if (company !== "all") params.company = company
    if (driveId !== "all") params.drive_id = driveId

    api.get("/admin/placement-analytics", { params })
      .then(res => setData(res.data))
      .catch(() => toast.error("Failed to load placement analytics"))
      .finally(() => setLoading(false))
  }, [year, status, source, passoutYear, branch, industry, company, driveId, granularity])

  const opts = data?.filter_options ?? { branches: [], passout_years: [], industries: [], years: [], companies: [], drives: [] }
  const s = data?.summary
  const statusLabel = STATUS_LABELS[status] ?? "Placed"

  const resetFilters = () => {
    setYear("all"); setStatus("selected"); setSource("all"); setPassoutYear("all"); setBranch("all")
    setIndustry("all"); setCompany("all"); setDriveId("all"); setGranularity("month")
  }

  const topCompanies = useMemo(() => (data?.company_wise ?? []).slice(0, 8), [data])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reports &amp; Analysis</h1>
          <p className="text-muted-foreground text-sm">Placement insights for your college</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => data && exportCSV(data)} disabled={!data}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Filter bar */}
      <GlassCard className="p-4 sticky top-2 z-10">
        <div className="flex items-end gap-3 flex-wrap">
          <Filter label="Drive Year">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-32"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {opts.years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </Filter>
          <Filter label="Status">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="all">All Statuses</SelectItem>
              </SelectContent>
            </Select>
          </Filter>
          <Filter label="Source">
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">On + Off Campus</SelectItem>
                <SelectItem value="on_campus">On-Campus (Drives)</SelectItem>
                <SelectItem value="off_campus">Off-Campus</SelectItem>
              </SelectContent>
            </Select>
          </Filter>
          <Filter label="Company">
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {opts.companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Filter>
          <Filter label="Drive">
            <Select value={driveId} onValueChange={setDriveId}>
              <SelectTrigger className="w-52"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drives</SelectItem>
                {opts.drives.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Filter>
          <Filter label="Batch">
            <Select value={passoutYear} onValueChange={setPassoutYear}>
              <SelectTrigger className="w-32"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {opts.passout_years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </Filter>
          <Filter label="Branch">
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="w-32"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {opts.branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </Filter>
          <Filter label="Industry">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {opts.industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </Filter>
          <Filter label="Trend by">
            <Select value={granularity} onValueChange={v => setGranularity(v as "month" | "quarter")}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </Filter>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
          </Button>
        </div>
      </GlassCard>

      {loading || !s ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <Kpi icon={GraduationCap} label={`Total ${statusLabel}`} value={s.total_placed} sub={`${s.total_selections} records`} color="#6366F1" />
            <Kpi icon={TrendingUp} label={`${statusLabel} Rate`} value={`${s.placement_rate}%`} sub={`of ${s.total_students} students`} color="#10B981" />
            <Kpi icon={Award} label="Highest CTC" value={ctc(s.highest_ctc)} color="#F59E0B" />
            <Kpi icon={IndianRupee} label="Avg CTC" value={ctc(s.avg_ctc)} sub={`Lowest ${ctc(s.lowest_ctc)}`} color="#14B8A6" />
            <Kpi icon={Briefcase} label="Drives Conducted" value={s.total_drives} color="#8B5CF6" />
            <Kpi icon={Building2} label="Companies" value={s.companies_visited} sub={`${s.joined_count} joined`} color="#EC4899" />
          </div>

          {/* Branch-wise + CTC distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title={`Branch-wise ${statusLabel}`} subtitle={`Students ${statusLabel.toLowerCase()} per branch`} empty={!data?.branch_wise.length}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data!.branch_wise} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis dataKey="branch" type="category" stroke="var(--muted-foreground)" fontSize={11} width={70} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "var(--secondary)", opacity: 0.4 }}
                    formatter={(v: number, _n, p: any) => [`${v} · ${p.payload.rate}% · avg ${ctc(p.payload.avg_ctc)}`, statusLabel]} />
                  <Bar dataKey="placed" radius={[0, 8, 8, 0]} maxBarSize={26}>
                    {data!.branch_wise.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="CTC Distribution" subtitle="Selections by package band (LPA)" empty={!data?.ctc_distribution.some(d => d.count)}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data!.ctc_distribution} margin={{ left: 0, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="band" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={48} fill="#14B8A6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Drives trend */}
          <ChartCard title="Drives Conducted" subtitle={`Drives and ${statusLabel.toLowerCase()} per ${granularity}`} empty={!data?.drives_trend.length}>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={data!.drives_trend} margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="period" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="drives" name="Drives" radius={[6, 6, 0, 0]} maxBarSize={36} fill="#6366F1" />
                <Line dataKey="selections" name={statusLabel} stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Company-wise + Alumni */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Top Companies by Selections" subtitle="Most selections this period" empty={!topCompanies.length}>
              <ResponsiveContainer width="100%" height={Math.max(220, topCompanies.length * 34)}>
                <BarChart data={topCompanies} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis dataKey="company" type="category" stroke="var(--muted-foreground)" fontSize={11} width={90} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "var(--secondary)", opacity: 0.4 }}
                    formatter={(v: number, _n, p: any) => [`${v} selections · ${p.payload.students} students · top ${ctc(p.payload.highest_ctc)}`, "Selections"]} />
                  <Bar dataKey="selections" radius={[0, 8, 8, 0]} maxBarSize={24}>
                    {topCompanies.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Alumni — by Batch" subtitle={`${statusLabel} vs total per passout year`} empty={!data?.alumni.length}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data!.alumni} margin={{ left: 0, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="passout_year" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "var(--secondary)", opacity: 0.4 }}
                    formatter={(v: number, n: string, p: any) => n === "placed" ? [`${v} · ${p.payload.rate}%`, statusLabel] : [v, "Total"]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="total" name="Total" radius={[6, 6, 0, 0]} maxBarSize={28} fill="var(--secondary)" />
                  <Bar dataKey="placed" name={statusLabel} radius={[6, 6, 0, 0]} maxBarSize={28} fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* TPO performance */}
          <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold flex items-center gap-2"><Users className="w-4 h-4" /> TPO / Officer Performance</h2>
              <p className="text-xs text-muted-foreground">Drives and outcomes by the officer who created them</p>
            </div>
            {!data?.tpo_metrics.length ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No drives in the selected period.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs">
                      <th className="text-left p-3 font-medium">Officer</th>
                      <th className="text-right p-3 font-medium">Drives</th>
                      <th className="text-right p-3 font-medium">Registrations</th>
                      <th className="text-right p-3 font-medium">{statusLabel}</th>
                      <th className="text-right p-3 font-medium">Conversion</th>
                      <th className="text-right p-3 font-medium">Avg CTC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.tpo_metrics.map((t, i) => (
                      <motion.tr key={t.officer_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="hover:bg-muted/20 transition-colors">
                        <td className="p-3 font-medium">{t.officer_name}</td>
                        <td className="p-3 text-right">{t.drives}</td>
                        <td className="p-3 text-right">{t.registrations}</td>
                        <td className="p-3 text-right font-semibold text-success">{t.placed}</td>
                        <td className="p-3 text-right">{t.conversion_rate}%</td>
                        <td className="p-3 text-right">{ctc(t.avg_ctc)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  )
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}
