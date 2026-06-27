"use client"

import { useEffect, useMemo, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { AdminStatCard, AdminHero } from "@/components/admin-stat-card"
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
interface PlacedStudent {
  name: string; roll_number: string | null; email: string | null; branch: string | null
  gender: string | null; passout_year: number | null; company: string; industry: string | null
  ctc: number | null; source: string; status: string; date: string | null
}
interface Analytics {
  summary: Summary
  branch_wise: BranchRow[]
  company_wise: CompanyRow[]
  ctc_distribution: { band: string; count: number }[]
  drives_trend: TrendRow[]
  alumni: AlumniRow[]
  tpo_metrics: TpoRow[]
  placed_students: PlacedStudent[]
  filter_options: {
    branches: string[]; genders: string[]; passout_years: number[]; industries: string[]
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
function Kpi({ icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub?: string; color: string
}) {
  return <AdminStatCard index={0} icon={icon} label={label} value={value} sub={sub} color={color} />
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

/* ── Excel export (multi-sheet, styled) ─────────────────────────────────── */
interface ExportFilters {
  year: string; status: string; source: string; passoutYear: string
  branch: string; gender: string; industry: string; company: string; driveId: string
  granularity: string; driveLabel: string
}

const SOURCE_LABELS: Record<string, string> = {
  all: "On + Off Campus", on_campus: "On-Campus (Drives)", off_campus: "Off-Campus",
}

const GENDER_LABELS: Record<string, string> = {
  male: "Male", female: "Female", other: "Other", prefer_not_to_say: "Prefer not to say",
}

// Each sheet gets its own header accent colour.
const SHEET_THEMES: Record<string, string> = {
  Filters: "475569", Summary: "4F46E5", "Branch-wise": "0D9488",
  "Company-wise": "DB2777", "Drives Trend": "2563EB", Alumni: "D97706",
  "TPO Performance": "7C3AED", "Placed Students": "059669",
}

async function exportXLSX(data: Analytics, filters: ExportFilters) {
  const ExcelJS = (await import("exceljs")).default
  const wb = new ExcelJS.Workbook()
  wb.creator = "CareerEzi Placement Cell"
  wb.created = new Date()

  const headerFill = (hex: string) => ({
    type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: `FF${hex}` },
  })

  // Build a sheet: bold white header row on a coloured fill, zebra body, autofilter, frozen header.
  const makeSheet = (
    name: string, columns: { header: string; key: string; width: number }[], rows: any[],
  ) => {
    const ws = wb.addWorksheet(name, {
      properties: { tabColor: { argb: `FF${SHEET_THEMES[name] ?? "4F46E5"}` } },
      views: [{ state: "frozen", ySplit: 1 }],
    })
    ws.columns = columns.map(c => ({ header: c.header, key: c.key, width: c.width }))

    const head = ws.getRow(1)
    head.height = 22
    head.eachCell(cell => {
      cell.fill = headerFill(SHEET_THEMES[name] ?? "4F46E5")
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 }
      cell.alignment = { vertical: "middle", horizontal: "left" }
      cell.border = { bottom: { style: "thin", color: { argb: "FFFFFFFF" } } }
    })

    rows.forEach((r, i) => {
      const row = ws.addRow(r)
      if (i % 2 === 1) {
        row.eachCell(cell => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } }
        })
      }
    })
    if (columns.length) {
      ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } }
    }
    return ws
  }

  const all = (v: string) => (v === "all" || v === "" ? "All" : v)

  // ── Summary sheet ──
  const s = data.summary
  makeSheet("Summary",
    [{ header: "Metric", key: "k", width: 28 }, { header: "Value", key: "v", width: 20 }],
    [
      { k: "Total Placed", v: s.total_placed }, { k: "Total Selections", v: s.total_selections },
      { k: "Placement Rate %", v: s.placement_rate }, { k: "Joined", v: s.joined_count },
      { k: "Total Students", v: s.total_students }, { k: "Drives Conducted", v: s.total_drives },
      { k: "Companies Visited", v: s.companies_visited }, { k: "Highest CTC", v: s.highest_ctc ?? "" },
      { k: "Lowest CTC", v: s.lowest_ctc ?? "" }, { k: "Avg CTC", v: s.avg_ctc ?? "" },
    ])

  // ── Branch-wise ──
  makeSheet("Branch-wise",
    [
      { header: "Branch", key: "branch", width: 24 }, { header: "Placed", key: "placed", width: 10 },
      { header: "Total", key: "total", width: 10 }, { header: "Rate %", key: "rate", width: 10 },
      { header: "Avg CTC", key: "avg_ctc", width: 12 },
    ],
    data.branch_wise.map(b => ({ ...b, avg_ctc: b.avg_ctc ?? "" })))

  // ── Company-wise ──
  makeSheet("Company-wise",
    [
      { header: "Company", key: "company", width: 28 }, { header: "Selections", key: "selections", width: 12 },
      { header: "Students", key: "students", width: 10 }, { header: "Highest CTC", key: "highest_ctc", width: 12 },
    ],
    data.company_wise.map(c => ({ ...c, highest_ctc: c.highest_ctc ?? "" })))

  // ── Drives Trend ──
  makeSheet("Drives Trend",
    [
      { header: "Period", key: "period", width: 14 }, { header: "Drives", key: "drives", width: 10 },
      { header: "Selections", key: "selections", width: 12 },
    ],
    data.drives_trend)

  // ── Alumni ──
  makeSheet("Alumni",
    [
      { header: "Passout Year", key: "passout_year", width: 14 }, { header: "Placed", key: "placed", width: 10 },
      { header: "Total", key: "total", width: 10 }, { header: "Rate %", key: "rate", width: 10 },
      { header: "Highest CTC", key: "highest_ctc", width: 12 },
    ],
    data.alumni.map(a => ({ ...a, highest_ctc: a.highest_ctc ?? "" })))

  // ── TPO Performance ──
  makeSheet("TPO Performance",
    [
      { header: "Officer", key: "officer_name", width: 24 }, { header: "Drives", key: "drives", width: 10 },
      { header: "Registrations", key: "registrations", width: 14 }, { header: "Placed", key: "placed", width: 10 },
      { header: "Conversion %", key: "conversion_rate", width: 14 }, { header: "Avg CTC", key: "avg_ctc", width: 12 },
    ],
    data.tpo_metrics.map(t => ({ ...t, avg_ctc: t.avg_ctc ?? "" })))

  // ── Placed Students ──
  makeSheet("Placed Students",
    [
      { header: "Name", key: "name", width: 24 }, { header: "Roll No", key: "roll_number", width: 16 },
      { header: "Email", key: "email", width: 30 }, { header: "Branch", key: "branch", width: 18 },
      { header: "Gender", key: "gender", width: 12 }, { header: "Batch", key: "passout_year", width: 10 },
      { header: "Company", key: "company", width: 24 }, { header: "Industry", key: "industry", width: 18 },
      { header: "CTC (LPA)", key: "ctc", width: 12 }, { header: "Source", key: "source", width: 14 },
      { header: "Status", key: "status", width: 14 }, { header: "Date", key: "date", width: 14 },
    ],
    (data.placed_students ?? []).map(p => ({
      ...p,
      roll_number: p.roll_number ?? "", email: p.email ?? "", branch: p.branch ?? "",
      gender: p.gender ? (GENDER_LABELS[p.gender] ?? p.gender) : "",
      passout_year: p.passout_year ?? "", industry: p.industry ?? "", ctc: p.ctc ?? "",
      date: p.date ? p.date.slice(0, 10) : "",
    })))

  // ── Filters sheet (kept last) ──
  makeSheet("Filters",
    [{ header: "Filter", key: "k", width: 28 }, { header: "Value", key: "v", width: 40 }],
    [
      { k: "Generated", v: new Date().toLocaleString() },
      { k: "Drive Year", v: all(filters.year) },
      { k: "Status", v: STATUS_LABELS[filters.status] ?? "Placed" },
      { k: "Source", v: SOURCE_LABELS[filters.source] ?? "On + Off Campus" },
      { k: "Batch (Passout Year)", v: all(filters.passoutYear) },
      { k: "Branch", v: all(filters.branch) },
      { k: "Gender", v: filters.gender === "all" || filters.gender === "" ? "All" : (GENDER_LABELS[filters.gender] ?? filters.gender) },
      { k: "Industry", v: all(filters.industry) },
      { k: "Company", v: all(filters.company) },
      { k: "Drive", v: filters.driveId === "all" ? "All" : (filters.driveLabel || filters.driveId) },
      { k: "Trend Granularity", v: filters.granularity },
    ])

  // ── Filename reflects active filters ──
  const slug = (v: string) => v.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  const parts = [
    filters.status !== "selected" ? STATUS_LABELS[filters.status] : "",
    filters.source !== "all" ? filters.source : "",
    filters.branch !== "all" ? filters.branch : "",
    filters.gender !== "all" ? filters.gender : "",
    filters.passoutYear !== "all" ? filters.passoutYear : "",
    filters.company !== "all" ? filters.company : "",
    filters.year !== "all" ? filters.year : "",
  ].filter(Boolean).map(slug)
  const suffix = parts.length ? `_${parts.join("_")}` : ""

  const buf = await wb.xlsx.writeBuffer()
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `Placement_Report${suffix}_${new Date().toISOString().slice(0, 10)}.xlsx`
  a.click()
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
  const [gender, setGender] = useState("all")
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
    if (gender !== "all") params.gender = gender
    if (industry !== "all") params.industry = industry
    if (company !== "all") params.company = company
    if (driveId !== "all") params.drive_id = driveId

    api.get("/admin/placement-analytics", { params })
      .then(res => setData(res.data))
      .catch(() => toast.error("Failed to load placement analytics"))
      .finally(() => setLoading(false))
  }, [year, status, source, passoutYear, branch, gender, industry, company, driveId, granularity])

  const opts = data?.filter_options ?? { branches: [], genders: [], passout_years: [], industries: [], years: [], companies: [], drives: [] }
  const s = data?.summary
  const statusLabel = STATUS_LABELS[status] ?? "Placed"

  const resetFilters = () => {
    setYear("all"); setStatus("selected"); setSource("all"); setPassoutYear("all"); setBranch("all")
    setGender("all"); setIndustry("all"); setCompany("all"); setDriveId("all"); setGranularity("month")
  }

  const [exporting, setExporting] = useState(false)
  const handleExport = async () => {
    if (!data) return
    setExporting(true)
    try {
      await exportXLSX(data, {
        year, status, source, passoutYear, branch, gender, industry, company, driveId, granularity,
        driveLabel: opts.drives.find(d => String(d.id) === driveId)?.label ?? "",
      })
    } catch {
      toast.error("Failed to generate Excel report")
    } finally {
      setExporting(false)
    }
  }

  const topCompanies = useMemo(() => (data?.company_wise ?? []).slice(0, 8), [data])

  return (
    <div className="space-y-6">
      <AdminHero
        icon={TrendingUp}
        eyebrow="Placement Cell"
        title="Reports & Analysis"
        subtitle="Placement insights for your college"
        right={
          <Button variant="outline" size="sm" onClick={handleExport} disabled={!data || exporting} className="bg-white/15 hover:bg-white/25 text-white border-0">
            <Download className="w-4 h-4 mr-2" /> {exporting ? "Exporting…" : "Export Excel"}
          </Button>
        }
      />

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
          <Filter label="Gender">
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                {(opts.genders ?? []).map(g => <SelectItem key={g} value={g}>{GENDER_LABELS[g] ?? g}</SelectItem>)}
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
