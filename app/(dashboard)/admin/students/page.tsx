"use client"

import { useEffect, useState, useMemo, useCallback, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { AdminStatCard, AdminHero } from "@/components/admin-stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/user-avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import {
  Users, Search, Flame, Mail, Loader2, Download,
  ChevronUp, ChevronDown, ChevronsUpDown, AlertTriangle,
  CheckCircle, ExternalLink, FileDown, Pencil, Columns3,
  GraduationCap, Activity, Filter,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { generateStudentPDF, StudentPerformance } from "@/lib/student-report"

interface Student {
  id: number
  name: string
  email: string
  roll_number: string
  branch: string
  section: string
  passout_year: number
  points: number
  streak: number
  last_active: string | null
  is_inactive: boolean
  // Academic profile (separate table — may be null if never filled)
  cgpa: number | null
  tenth_percent: number | null
  twelfth_percent: number | null
  active_backlogs: number | null
  backlog_history: number | null
  gap_years: number | null
  placement_status: "not_placed" | "selected" | "joined" | null
  category: string | null
}

interface ExportStudent {
  id: number; name: string; email: string; roll_number: string
  branch: string; section: string; passout_year: number | string
  phone: string; linkedin: string; github: string
  status: string; points: number; streak: number; last_active: string | null
  mcq_attempts: number; mcq_correct: number; mcq_accuracy: number
  coding_submissions: number; coding_solved: number
  assignments_completed: number; assignment_avg_score: number
  lessons_completed: number
}

type SortKey = "name" | "points" | "streak" | "last_active"
type SortDir = "asc" | "desc"

const OPTIONAL_COLUMNS = [
  { key: "roll_no",         label: "Roll No" },
  { key: "branch_sec",      label: "Branch / Sec" },
  { key: "year",            label: "Year" },
  { key: "cgpa",            label: "CGPA" },
  { key: "tenth_percent",   label: "10th %" },
  { key: "twelfth_percent", label: "12th %" },
  { key: "active_backlogs", label: "Backlogs" },
  { key: "backlog_history", label: "Backlog History" },
  { key: "gap_years",       label: "Gap Years" },
  { key: "category",        label: "Category" },
  { key: "placement_status", label: "Placement" },
  { key: "status",          label: "Status" },
  { key: "points",          label: "Points" },
  { key: "streak",          label: "Streak" },
  { key: "last_active",     label: "Last Active" },
] as const

type ColKey = typeof OPTIONAL_COLUMNS[number]["key"]

const DEFAULT_VISIBLE: Record<ColKey, boolean> = {
  roll_no: true,
  branch_sec: true,
  year: false,
  cgpa: true,
  tenth_percent: false,
  twelfth_percent: false,
  active_backlogs: false,
  backlog_history: false,
  gap_years: false,
  category: false,
  placement_status: false,
  status: true,
  points: true,
  streak: true,
  last_active: true,
}

const PLACEMENT_META: Record<string, { label: string; chip: string }> = {
  not_placed: { label: "Not Placed", chip: "chip chip-warning" },
  selected:   { label: "Selected",   chip: "chip chip-primary" },
  joined:     { label: "Joined",     chip: "chip chip-success" },
}

function fmtNum(v: number | null | undefined): ReactNode {
  return (v === null || v === undefined)
    ? <span className="text-muted-foreground/40">—</span>
    : v
}

function formatLastActive(iso: string | null): string {
  if (!iso) return "Never"
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return diffMins <= 1 ? "Just now" : `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays === 1) return "Yesterday"
  return `${diffDays}d ago`
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="h-3 w-3 ml-1 opacity-30" />
  return sortDir === "asc"
    ? <ChevronUp className="h-3 w-3 ml-1 text-primary" />
    : <ChevronDown className="h-3 w-3 ml-1 text-primary" />
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}
const rowVariant = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.15 } },
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [remindingId, setRemindingId] = useState<number | null>(null)
  const [remindingSelected, setRemindingSelected] = useState(false)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [exportingCSV, setExportingCSV] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")
  const [sectionFilter, setSectionFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [sortKey, setSortKey] = useState<SortKey>("points")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const [visibleCols, setVisibleCols] = useState<Record<ColKey, boolean>>(DEFAULT_VISIBLE)
  const [colPopoverOpen, setColPopoverOpen] = useState(false)

  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [editForm, setEditForm] = useState({
    name: "", branch: "", section: "", roll_number: "", passout_year: "",
    cgpa: "", tenth_percent: "", twelfth_percent: "",
    active_backlogs: "", backlog_history: "", gap_years: "",
    category: "", placement_status: "not_placed",
  })
  const [editSaving, setEditSaving] = useState(false)

  function openEdit(student: Student) {
    setEditStudent(student)
    const str = (v: number | null | undefined) => (v === null || v === undefined ? "" : String(v))
    setEditForm({
      name: student.name,
      branch: student.branch || "",
      section: student.section || "",
      roll_number: student.roll_number || "",
      passout_year: student.passout_year ? String(student.passout_year) : "",
      cgpa: str(student.cgpa),
      tenth_percent: str(student.tenth_percent),
      twelfth_percent: str(student.twelfth_percent),
      active_backlogs: str(student.active_backlogs),
      backlog_history: str(student.backlog_history),
      gap_years: str(student.gap_years),
      category: student.category || "",
      placement_status: student.placement_status || "not_placed",
    })
  }

  async function saveEdit() {
    if (!editStudent) return
    setEditSaving(true)
    try {
      const res = await api.patch(`/admin/students/${editStudent.id}`, {
        name: editForm.name.trim(),
        branch: editForm.branch.trim(),
        section: editForm.section.trim(),
        roll_number: editForm.roll_number.trim(),
        passout_year: editForm.passout_year ? parseInt(editForm.passout_year) : null,
        cgpa: editForm.cgpa.trim() === "" ? null : parseFloat(editForm.cgpa),
        tenth_percent: editForm.tenth_percent.trim() === "" ? null : parseFloat(editForm.tenth_percent),
        twelfth_percent: editForm.twelfth_percent.trim() === "" ? null : parseFloat(editForm.twelfth_percent),
        active_backlogs: editForm.active_backlogs.trim() === "" ? 0 : parseInt(editForm.active_backlogs),
        backlog_history: editForm.backlog_history.trim() === "" ? 0 : parseInt(editForm.backlog_history),
        gap_years: editForm.gap_years.trim() === "" ? 0 : parseInt(editForm.gap_years),
        category: editForm.category.trim(),
        placement_status: editForm.placement_status,
      })
      setStudents(prev => prev.map(s => s.id === editStudent.id ? { ...s, ...res.data } : s))
      toast.success("Student updated")
      setEditStudent(null)
    } catch {
      toast.error("Failed to update student")
    } finally {
      setEditSaving(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (branchFilter !== "all") params.set("branch", branchFilter)
    if (sectionFilter !== "all") params.set("section", sectionFilter)
    if (yearFilter !== "all") params.set("passout_year", yearFilter)
    params.set("per_page", "200")

    setLoading(true)
    const timeout = setTimeout(() => {
      api.get(`/admin/students?${params}`)
        .then((res) => {
          setStudents(res.data.students)
          setTotal(res.data.total)
          setSelectedIds(new Set())
        })
        .catch(() => toast.error("Failed to load students"))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery, branchFilter, sectionFilter, yearFilter])

  async function handleRemind(student: Student) {
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

  async function handleRemindSelected() {
    const toRemind = students.filter(s => selectedIds.has(s.id) && s.is_inactive)
    if (!toRemind.length) { toast.info("No inactive students in selection"); return }
    setRemindingSelected(true)
    let sent = 0
    for (const s of toRemind) {
      try { await api.post(`/admin/students/${s.id}/remind`); sent++ } catch {}
    }
    toast.success(`Reminders sent to ${sent} student${sent !== 1 ? "s" : ""}`)
    setRemindingSelected(false)
  }

  async function handleDownloadReport(student: Student) {
    setDownloadingId(student.id)
    try {
      const res = await api.get(`/admin/students/${student.id}/performance`)
      generateStudentPDF(res.data as StudentPerformance)
    } catch {
      toast.error("Failed to load report")
    } finally {
      setDownloadingId(null)
    }
  }

  async function exportCSV() {
    setExportingCSV(true)
    try {
      const res = await api.get("/admin/students/export")
      const all: ExportStudent[] = res.data.students
      const headers = [
        "Roll No", "Name", "Email", "Branch", "Section", "Batch Year",
        "Phone", "LinkedIn", "GitHub", "Status", "Points", "Streak", "Last Active",
        "MCQ Attempts", "MCQ Correct", "MCQ Accuracy (%)",
        "Coding Submissions", "Coding Problems Solved",
        "Assignments Completed", "Assignment Avg Score (%)", "Lessons Completed",
      ]
      const rows = all.map(s => [
        s.roll_number, s.name, s.email, s.branch, s.section, s.passout_year,
        s.phone, s.linkedin, s.github, s.status, s.points, s.streak,
        s.last_active ? new Date(s.last_active).toLocaleDateString("en-IN") : "Never",
        s.mcq_attempts, s.mcq_correct, s.mcq_accuracy,
        s.coding_submissions, s.coding_solved,
        s.assignments_completed, s.assignment_avg_score, s.lessons_completed,
      ])
      const csv = [headers, ...rows]
        .map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
        .join("\n")
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a"); a.href = url
      a.download = `NAC_Student_Report_${new Date().toISOString().slice(0, 10)}.csv`
      a.click(); URL.revokeObjectURL(url)
      toast.success(`Exported ${all.length} students`)
    } catch {
      toast.error("Failed to export")
    } finally {
      setExportingCSV(false)
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }

  function toggleCol(key: ColKey) {
    setVisibleCols(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const sortedStudents = useMemo(() => {
    let list = [...students]
    if (statusFilter === "active") list = list.filter(s => !s.is_inactive)
    if (statusFilter === "inactive") list = list.filter(s => s.is_inactive)
    list.sort((a, b) => {
      let av: string | number, bv: string | number
      if (sortKey === "name") { av = a.name.toLowerCase(); bv = b.name.toLowerCase() }
      else if (sortKey === "points") { av = a.points; bv = b.points }
      else if (sortKey === "streak") { av = a.streak; bv = b.streak }
      else {
        av = a.last_active ? new Date(a.last_active).getTime() : 0
        bv = b.last_active ? new Date(b.last_active).getTime() : 0
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1
      if (av > bv) return sortDir === "asc" ? 1 : -1
      return 0
    })
    return list
  }, [students, sortKey, sortDir, statusFilter])

  const branches = useMemo(() => Array.from(new Set(students.map(s => s.branch).filter(Boolean))).sort(), [students])
  const sections = useMemo(() => Array.from(new Set(students.map(s => s.section).filter(Boolean))).sort(), [students])
  const years = useMemo(() => Array.from(new Set(students.map(s => s.passout_year).filter(Boolean))).sort(), [students])

  const inactiveCount = students.filter(s => s.is_inactive).length
  const activeCount = students.length - inactiveCount

  const allVisibleIds = sortedStudents.map(s => s.id)
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedIds.has(id))

  function toggleSelectAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(allVisibleIds))
  }

  function toggleSelect(id: number) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const activeFilters = [branchFilter, sectionFilter, yearFilter, statusFilter].filter(f => f !== "all").length
  const show = useCallback((key: ColKey) => visibleCols[key], [visibleCols])

  const statCards = [
    { label: "Total Students", value: total,            icon: GraduationCap },
    { label: "Active",         value: activeCount,       icon: CheckCircle },
    { label: "Inactive",       value: inactiveCount,     icon: AlertTriangle },
    { label: "Selected",       value: selectedIds.size,  icon: Activity },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHero
        icon={GraduationCap}
        eyebrow="College"
        title="Students"
        subtitle="Manage and monitor your college students"
        right={
          <>
            {selectedIds.size > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="bg-white/15 hover:bg-white/25 text-white border-0 gap-1.5 h-8"
                onClick={handleRemindSelected}
                disabled={remindingSelected}
              >
                {remindingSelected ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mail className="h-3 w-3" />}
                Remind ({selectedIds.size})
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="bg-white/15 hover:bg-white/25 text-white border-0 gap-1.5 h-8"
              onClick={exportCSV}
              disabled={exportingCSV}
            >
              {exportingCSV ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
              Export CSV
            </Button>
          </>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <AdminStatCard
            key={s.label}
            index={i}
            icon={s.icon}
            label={s.label}
            value={loading ? "—" : s.value.toLocaleString()}
            delay={i * 0.07}
          />
        ))}
      </div>

      {/* Main table card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <GlassCard>
          {/* Toolbar */}
          <div className="flex flex-col gap-3 mb-5">
            {/* Row 1: search + filters + column toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search name, email, roll no…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/40"
                />
                {searchQuery && (
                  <button
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery("")}
                  >
                    <span className="sr-only">Clear</span>
                    ×
                  </button>
                )}
              </div>

              {/* Filters */}
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-[120px] h-9 bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger className="w-[110px] h-9 bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[100px] h-9 bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[115px] h-9 bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Column visibility toggle */}
              <Popover open={colPopoverOpen} onOpenChange={setColPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "h-9 gap-1.5 border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 ml-auto",
                      colPopoverOpen && "bg-secondary/60 text-foreground"
                    )}
                  >
                    <Columns3 className="h-3.5 w-3.5" />
                    Columns
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-52 p-2 bg-popover border-border shadow-xl">
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                    Visible Columns
                  </p>
                  <div className="space-y-0.5">
                    {OPTIONAL_COLUMNS.map(col => (
                      <button
                        key={col.key}
                        onClick={() => toggleCol(col.key)}
                        className={cn(
                          "flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-sm transition-colors",
                          visibleCols[col.key]
                            ? "text-foreground hover:bg-secondary/60"
                            : "text-muted-foreground hover:bg-secondary/40"
                        )}
                      >
                        <span className={cn(
                          "h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                          visibleCols[col.key] ? "bg-primary border-primary" : "border-border"
                        )}>
                          {visibleCols[col.key] && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              width="10" height="10" viewBox="0 0 10 10" fill="none"
                            >
                              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                          )}
                        </span>
                        {col.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-border flex gap-1.5 px-1">
                    <button
                      onClick={() => setVisibleCols(Object.fromEntries(OPTIONAL_COLUMNS.map(c => [c.key, true])) as Record<ColKey, boolean>)}
                      className="flex-1 text-xs text-primary hover:underline"
                    >
                      Show all
                    </button>
                    <button
                      onClick={() => setVisibleCols(DEFAULT_VISIBLE)}
                      className="flex-1 text-xs text-muted-foreground hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Active filter chips */}
            {activeFilters > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1.5"
              >
                {branchFilter !== "all" && (
                  <FilterChip label={`Branch: ${branchFilter}`} onRemove={() => setBranchFilter("all")} />
                )}
                {sectionFilter !== "all" && (
                  <FilterChip label={`Section: ${sectionFilter}`} onRemove={() => setSectionFilter("all")} />
                )}
                {yearFilter !== "all" && (
                  <FilterChip label={`Year: ${yearFilter}`} onRemove={() => setYearFilter("all")} />
                )}
                {statusFilter !== "all" && (
                  <FilterChip label={`Status: ${statusFilter}`} onRemove={() => setStatusFilter("all")} />
                )}
                <button
                  onClick={() => { setBranchFilter("all"); setSectionFilter("all"); setYearFilter("all"); setStatusFilter("all") }}
                  className="text-xs text-muted-foreground hover:text-foreground underline ml-1"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-7 w-7 text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Loading students…</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <table className="w-full border-collapse" style={{ tableLayout: "auto" }}>
                <thead>
                  <tr className="bg-secondary/40 border-b border-border">
                    <th className="py-3 px-3 w-10">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={toggleSelectAll}
                        className="border-border"
                      />
                    </th>
                    {/* Name — always visible */}
                    <th className="text-left py-3 px-3 min-w-[180px]">
                      <button
                        onClick={() => toggleSort("name")}
                        className="flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                      >
                        Student <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </th>
                    {show("roll_no") && (
                      <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Roll No
                      </th>
                    )}
                    {show("branch_sec") && (
                      <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Branch / Sec
                      </th>
                    )}
                    {show("year") && (
                      <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Batch
                      </th>
                    )}
                    {show("cgpa") && (
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        CGPA
                      </th>
                    )}
                    {show("tenth_percent") && (
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        10th %
                      </th>
                    )}
                    {show("twelfth_percent") && (
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        12th %
                      </th>
                    )}
                    {show("active_backlogs") && (
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Backlogs
                      </th>
                    )}
                    {show("backlog_history") && (
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Backlog Hist.
                      </th>
                    )}
                    {show("gap_years") && (
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Gap Yrs
                      </th>
                    )}
                    {show("category") && (
                      <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Category
                      </th>
                    )}
                    {show("placement_status") && (
                      <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Placement
                      </th>
                    )}
                    {show("status") && (
                      <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                    )}
                    {show("points") && (
                      <th className="text-right py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => toggleSort("points")}
                          className="flex items-center justify-end ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                        >
                          Points <SortIcon col="points" sortKey={sortKey} sortDir={sortDir} />
                        </button>
                      </th>
                    )}
                    {show("streak") && (
                      <th className="text-right py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => toggleSort("streak")}
                          className="flex items-center justify-end ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                        >
                          Streak <SortIcon col="streak" sortKey={sortKey} sortDir={sortDir} />
                        </button>
                      </th>
                    )}
                    {show("last_active") && (
                      <th className="text-right py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => toggleSort("last_active")}
                          className="flex items-center justify-end ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                        >
                          Last Active <SortIcon col="last_active" sortKey={sortKey} sortDir={sortDir} />
                        </button>
                      </th>
                    )}
                    <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <motion.tbody variants={staggerContainer} initial="hidden" animate="show">
                  <AnimatePresence mode="popLayout">
                    {sortedStudents.map((student, idx) => (
                      <motion.tr
                        key={student.id}
                        variants={rowVariant}
                        exit="exit"
                        layout
                        className={cn(
                          "border-b border-border/40 transition-colors group",
                          "hover:bg-primary/[0.04]",
                          student.is_inactive && "bg-danger/[0.03] hover:bg-danger/[0.06]",
                          selectedIds.has(student.id) && "bg-primary/[0.06] hover:bg-primary/[0.08]",
                        )}
                      >
                        <td className="py-3 px-3">
                          <Checkbox
                            checked={selectedIds.has(student.id)}
                            onCheckedChange={() => toggleSelect(student.id)}
                            className="border-border"
                          />
                        </td>

                        {/* Student cell — always visible */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar
                              name={student.name}
                              photoUrl={(student as any).avatar}
                              size="sm"
                              points={student.points}
                              fallbackClassName={student.is_inactive ? "bg-danger/20 text-danger" : undefined}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate leading-tight">{student.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                            </div>
                          </div>
                        </td>

                        {show("roll_no") && (
                          <td className="py-3 px-3 text-sm text-muted-foreground whitespace-nowrap">
                            {student.roll_number || <span className="text-muted-foreground/40">—</span>}
                          </td>
                        )}
                        {show("branch_sec") && (
                          <td className="py-3 px-3 text-sm text-muted-foreground whitespace-nowrap">
                            {student.branch
                              ? <>{student.branch}{student.section && <span className="text-muted-foreground/50"> / {student.section}</span>}</>
                              : <span className="text-muted-foreground/40">—</span>
                            }
                          </td>
                        )}
                        {show("year") && (
                          <td className="py-3 px-3 text-sm text-muted-foreground whitespace-nowrap">
                            {student.passout_year || <span className="text-muted-foreground/40">—</span>}
                          </td>
                        )}
                        {show("cgpa") && (
                          <td className="py-3 px-3 text-right text-sm font-medium text-foreground tabular-nums whitespace-nowrap">
                            {student.cgpa != null
                              ? student.cgpa.toFixed(2)
                              : <span className="text-muted-foreground/40">—</span>}
                          </td>
                        )}
                        {show("tenth_percent") && (
                          <td className="py-3 px-3 text-right text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                            {student.tenth_percent != null ? `${student.tenth_percent}%` : <span className="text-muted-foreground/40">—</span>}
                          </td>
                        )}
                        {show("twelfth_percent") && (
                          <td className="py-3 px-3 text-right text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                            {student.twelfth_percent != null ? `${student.twelfth_percent}%` : <span className="text-muted-foreground/40">—</span>}
                          </td>
                        )}
                        {show("active_backlogs") && (
                          <td className="py-3 px-3 text-right text-sm tabular-nums whitespace-nowrap">
                            {student.active_backlogs != null ? (
                              <span className={cn(student.active_backlogs > 0 ? "text-danger font-medium" : "text-muted-foreground")}>
                                {student.active_backlogs}
                              </span>
                            ) : <span className="text-muted-foreground/40">—</span>}
                          </td>
                        )}
                        {show("backlog_history") && (
                          <td className="py-3 px-3 text-right text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                            {fmtNum(student.backlog_history)}
                          </td>
                        )}
                        {show("gap_years") && (
                          <td className="py-3 px-3 text-right text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                            {fmtNum(student.gap_years)}
                          </td>
                        )}
                        {show("category") && (
                          <td className="py-3 px-3 text-sm text-muted-foreground whitespace-nowrap">
                            {student.category || <span className="text-muted-foreground/40">—</span>}
                          </td>
                        )}
                        {show("placement_status") && (
                          <td className="py-3 px-3 whitespace-nowrap">
                            {student.placement_status ? (
                              <span className={PLACEMENT_META[student.placement_status]?.chip ?? "chip"}>
                                {PLACEMENT_META[student.placement_status]?.label ?? student.placement_status}
                              </span>
                            ) : <span className="text-muted-foreground/40">—</span>}
                          </td>
                        )}
                        {show("status") && (
                          <td className="py-3 px-3">
                            {student.is_inactive ? (
                              <span className="chip chip-danger">Inactive</span>
                            ) : (
                              <span className="chip chip-success">Active</span>
                            )}
                          </td>
                        )}
                        {show("points") && (
                          <td className="py-3 px-3 text-right">
                            <span className="text-sm font-semibold text-foreground tabular-nums">
                              {student.points.toLocaleString()}
                            </span>
                          </td>
                        )}
                        {show("streak") && (
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Flame className={cn("h-3.5 w-3.5", student.streak > 0 ? "text-streak" : "text-muted-foreground/40")} />
                              <span className={cn("text-sm tabular-nums font-medium", student.streak > 0 ? "text-foreground" : "text-muted-foreground/60")}>
                                {student.streak}
                              </span>
                            </div>
                          </td>
                        )}
                        {show("last_active") && (
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <span className={cn(
                              "text-sm tabular-nums",
                              student.is_inactive ? "text-danger" : "text-muted-foreground"
                            )}>
                              {formatLastActive(student.last_active)}
                            </span>
                          </td>
                        )}

                        {/* Actions — always visible */}
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-end gap-1">
                            {student.is_inactive && (
                              <ActionBtn
                                title="Send reminder"
                                onClick={() => handleRemind(student)}
                                disabled={remindingId === student.id}
                                className="border-danger/30 text-danger hover:bg-danger/10"
                              >
                                {remindingId === student.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                              </ActionBtn>
                            )}
                            <ActionBtn
                              title="Edit student"
                              onClick={() => openEdit(student)}
                              className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </ActionBtn>
                            <Link href={`/admin/students/${student.id}`}>
                              <ActionBtn
                                title="View profile"
                                className="border-primary/30 text-primary hover:bg-primary/10"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </ActionBtn>
                            </Link>
                            <ActionBtn
                              title="Download report"
                              onClick={() => handleDownloadReport(student)}
                              disabled={downloadingId === student.id}
                              className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                            >
                              {downloadingId === student.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
                            </ActionBtn>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>

              {sortedStudents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-3"
                >
                  <div className="h-16 w-16 rounded-full bg-secondary/60 flex items-center justify-center">
                    <Users className="h-7 w-7 text-muted-foreground/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">No students found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Try adjusting your filters or search query</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {!loading && sortedStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between mt-3"
            >
              <p className="text-xs text-muted-foreground">
                {selectedIds.size > 0
                  ? <span className="text-primary font-medium">{selectedIds.size} selected · </span>
                  : null}
                Showing {sortedStudents.length} of {total} students
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Filter className="h-3 w-3" />
                {activeFilters > 0 ? `${activeFilters} filter${activeFilters > 1 ? "s" : ""} active` : "No filters"}
              </div>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>

      {/* Edit dialog */}
      <Dialog open={!!editStudent} onOpenChange={(open) => { if (!open) setEditStudent(null) }}>
        <DialogContent className="bg-popover border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Student</DialogTitle>
          </DialogHeader>
          {editStudent && (
            <div className="flex items-center gap-3 py-1 px-3 rounded-lg bg-secondary/40 border border-border mb-1">
              <UserAvatar name={editStudent.name} size="sm" points={editStudent.points} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{editStudent.name}</p>
                <p className="text-xs text-muted-foreground truncate">{editStudent.email}</p>
              </div>
            </div>
          )}
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-sm">Full Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-sm">Roll Number</Label>
              <Input
                value={editForm.roll_number}
                onChange={(e) => setEditForm(f => ({ ...f, roll_number: e.target.value }))}
                className="bg-secondary/50 border-border text-foreground"
                placeholder="e.g. 21CS001"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-sm">Branch</Label>
                <Input
                  value={editForm.branch}
                  onChange={(e) => setEditForm(f => ({ ...f, branch: e.target.value }))}
                  className="bg-secondary/50 border-border text-foreground"
                  placeholder="e.g. CSE"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-sm">Section</Label>
                <Input
                  value={editForm.section}
                  onChange={(e) => setEditForm(f => ({ ...f, section: e.target.value }))}
                  className="bg-secondary/50 border-border text-foreground"
                  placeholder="e.g. A"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-sm">Passout Year</Label>
              <Input
                type="number"
                value={editForm.passout_year}
                onChange={(e) => setEditForm(f => ({ ...f, passout_year: e.target.value }))}
                className="bg-secondary/50 border-border text-foreground"
                placeholder="e.g. 2026"
              />
            </div>

            {/* Academic details */}
            <div className="pt-2 mt-1 border-t border-border">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                <GraduationCap className="h-3.5 w-3.5" />
                Academic Details
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">CGPA</Label>
                  <Input
                    type="number" step="0.01" min="0" max="10"
                    value={editForm.cgpa}
                    onChange={(e) => setEditForm(f => ({ ...f, cgpa: e.target.value }))}
                    className="bg-secondary/50 border-border text-foreground"
                    placeholder="8.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">10th %</Label>
                  <Input
                    type="number" step="0.01" min="0" max="100"
                    value={editForm.tenth_percent}
                    onChange={(e) => setEditForm(f => ({ ...f, tenth_percent: e.target.value }))}
                    className="bg-secondary/50 border-border text-foreground"
                    placeholder="90"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">12th %</Label>
                  <Input
                    type="number" step="0.01" min="0" max="100"
                    value={editForm.twelfth_percent}
                    onChange={(e) => setEditForm(f => ({ ...f, twelfth_percent: e.target.value }))}
                    className="bg-secondary/50 border-border text-foreground"
                    placeholder="92"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">Backlogs</Label>
                  <Input
                    type="number" min="0"
                    value={editForm.active_backlogs}
                    onChange={(e) => setEditForm(f => ({ ...f, active_backlogs: e.target.value }))}
                    className="bg-secondary/50 border-border text-foreground"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">Backlog Hist.</Label>
                  <Input
                    type="number" min="0"
                    value={editForm.backlog_history}
                    onChange={(e) => setEditForm(f => ({ ...f, backlog_history: e.target.value }))}
                    className="bg-secondary/50 border-border text-foreground"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">Gap Years</Label>
                  <Input
                    type="number" min="0"
                    value={editForm.gap_years}
                    onChange={(e) => setEditForm(f => ({ ...f, gap_years: e.target.value }))}
                    className="bg-secondary/50 border-border text-foreground"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">Category</Label>
                  <Input
                    value={editForm.category}
                    onChange={(e) => setEditForm(f => ({ ...f, category: e.target.value }))}
                    className="bg-secondary/50 border-border text-foreground"
                    placeholder="e.g. General"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">Placement Status</Label>
                  <Select
                    value={editForm.placement_status}
                    onValueChange={(v) => setEditForm(f => ({ ...f, placement_status: v }))}
                  >
                    <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_placed">Not Placed</SelectItem>
                      <SelectItem value="selected">Selected</SelectItem>
                      <SelectItem value="joined">Joined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-border text-muted-foreground" onClick={() => setEditStudent(null)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={saveEdit}
              disabled={editSaving || !editForm.name.trim()}
            >
              {editSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium"
    >
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:text-primary/60 transition-colors">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </motion.span>
  )
}

function ActionBtn({
  children, title, onClick, disabled, className,
}: {
  children: ReactNode
  title?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-7 w-7 flex items-center justify-center rounded-md border transition-colors disabled:opacity-50",
        className,
      )}
    >
      {children}
    </motion.button>
  )
}
