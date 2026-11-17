"use client"

import { useEffect, useState, useCallback } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Search, Mail, Flame, Star, ArrowDownWideNarrow, ArrowUpNarrowWide, KeyRound, Loader2 } from "lucide-react"
import { PaginationBar } from "@/components/pagination-bar"
import type { SortDir } from "@/components/sort-button"
import { toast } from "sonner"
import api from "@/lib/api"
import {
  apiMessage, remindStudent, resendLogin, resendLoginBulk, resendSummary,
  welcomeLabel, WELCOME_TONE_CLASS, type WelcomeStatus,
} from "@/lib/admin-students"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"

interface Student {
  id: number
  name: string
  email: string
  roll_number: string | null
  branch: string | null
  section: string | null
  passout_year: number | null
  points: number
  streak: number
  last_active: string | null
  is_inactive: boolean
  last_reminded_at: string | null
  onboarded: WelcomeStatus["onboarded"]
  welcome_requested_at: WelcomeStatus["welcome_requested_at"]
  welcome_sent_at: WelcomeStatus["welcome_sent_at"]
  welcome_error: WelcomeStatus["welcome_error"]
}

const STATUS_OPTIONS: [string, string][] = [
  ["all", "All students"],
  ["active", "Active"],
  ["inactive", "Inactive (3d+)"],
  ["pending", "Never logged in"],
]

function formatLastActive(iso: string | null): string {
  if (!iso) return "Never"
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays}d ago`
}

// [sort key, label, direction a fresh pick starts with]
const SORT_OPTIONS: [string, string, SortDir][] = [
  ["points", "Points", "desc"],
  ["streak", "Streak", "desc"],
  ["last_active", "Last active", "desc"],
  ["name", "Name", "asc"],
  ["roll_number", "Roll number", "asc"],
  ["section", "Section", "asc"],
  ["passout_year", "Batch", "asc"],
]

export default function BranchAdminStudentsPage() {
  const { user } = useAuthStore()
  const [students, setStudents] = useState<Student[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [sortKey, setSortKey] = useState("points")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [remindingId, setRemindingId] = useState<number | null>(null)
  const [status, setStatus] = useState("all")
  const [resendingId, setResendingId] = useState<number | null>(null)
  const [resendingAll, setResendingAll] = useState(false)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page), per_page: String(pageSize), sort: sortKey, order: sortDir,
      })
      if (search) params.set("search", search)
      if (status !== "all") params.set("status", status)
      const res = await api.get(`/branch-admin/students?${params}`)
      setStudents(res.data.students)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch {
      toast.error("Failed to load students")
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, sortKey, sortDir, search, status])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  function changeSort(key: string) {
    setSortKey(key)
    setSortDir(SORT_OPTIONS.find(([k]) => k === key)?.[2] ?? "asc")
    setPage(1)
  }

  async function sendReminder(id: number, name: string) {
    setRemindingId(id)
    try {
      toast.success(await remindStudent("/branch-admin", id))
      fetchStudents()
    } catch (err) {
      toast.error(apiMessage(err, "Failed to send reminder"))
    } finally {
      setRemindingId(null)
    }
  }

  async function handleResendLogin(s: Student) {
    if (!confirm(`Send ${s.name} new login details? They get a new temporary password at ${s.email}; any earlier one stops working.`)) return
    setResendingId(s.id)
    try {
      toast.success(await resendLogin(s.id))
      fetchStudents()
    } catch (err) {
      toast.error(apiMessage(err, "Failed to resend login details"))
    } finally {
      setResendingId(null)
    }
  }

  async function handleResendAll() {
    if (!confirm(`Send new login details to every ${user?.branch ?? ""} student who never logged in? Each gets a new temporary password.`)) return
    setResendingAll(true)
    try {
      toast.success(resendSummary(await resendLoginBulk({ filter: {} })))
      fetchStudents()
    } catch (err) {
      toast.error(apiMessage(err, "Failed to resend login details"))
    } finally {
      setResendingAll(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">
          {user?.branch} Students
        </h1>
        <p className="text-muted-foreground mt-1">
          {total} students · {user?.college_name}
        </p>
      </div>

      {/* Search */}
      <GlassCard className="border-border/60">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or roll number..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="pl-10 bg-secondary/40 border-border"
            />
          </div>
          <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Search
          </Button>
          {search && (
            <Button variant="outline" className="border-border" onClick={() => { setSearchInput(""); setSearch(""); setPage(1) }}>
              Clear
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1) }}>
            <SelectTrigger className="h-8 w-[160px] bg-secondary/40 border-border text-xs" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">Sort by</span>
          <Select value={sortKey} onValueChange={changeSort}>
            <SelectTrigger className="h-8 w-[150px] bg-secondary/40 border-border text-xs" aria-label="Sort by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border"
            onClick={() => { setSortDir(d => d === "asc" ? "desc" : "asc"); setPage(1) }}
            title={sortDir === "asc" ? "Ascending" : "Descending"}
            aria-label={`Sort ${sortDir === "asc" ? "ascending" : "descending"} — click to reverse`}
          >
            {sortDir === "asc" ? <ArrowUpNarrowWide className="h-4 w-4" /> : <ArrowDownWideNarrow className="h-4 w-4" />}
          </Button>
          {status === "pending" && total > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="ml-auto h-8 border-warning/30 text-warning hover:bg-warning/10 text-xs gap-1.5"
              onClick={handleResendAll}
              disabled={resendingAll}
            >
              {resendingAll ? <Loader2 className="h-3 w-3 animate-spin" /> : <KeyRound className="h-3 w-3" />}
              Resend login to all ({total})
            </Button>
          )}
        </div>
      </GlassCard>

      {/* Student list */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <GlassCard key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </GlassCard>
            ))
          : students.length === 0
          ? (
              <div className="flex flex-col items-center py-20 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-foreground">No students found</p>
                <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
              </div>
            )
          : students.map(s => (
              <GlassCard key={s.id} className="hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className={cn(
                      "text-sm font-bold",
                      s.is_inactive ? "bg-danger/20 text-danger" : "bg-primary/20 text-primary"
                    )}>
                      {s.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground truncate">{s.name}</p>
                      {s.section && (
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                          Section {s.section}
                        </Badge>
                      )}
                      {s.is_inactive && (
                        <Badge variant="outline" className="text-xs border-danger/30 text-danger bg-danger/10">
                          Inactive
                        </Badge>
                      )}
                      {!s.onboarded && (
                        <Badge variant="outline" className="text-xs border-warning/30 text-warning bg-warning/10">
                          Never logged in
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                      <span>{s.email}</span>
                      {s.roll_number && <span>· {s.roll_number}</span>}
                      {s.passout_year && <span>· {s.passout_year}</span>}
                      <span>· {formatLastActive(s.last_active)}</span>
                    </div>
                    {(() => {
                      const w = welcomeLabel(s)
                      return w ? (
                        <p className={cn("text-xs mt-0.5", WELCOME_TONE_CLASS[w.tone])} title={s.welcome_error ?? undefined}>
                          {w.text}
                        </p>
                      ) : null
                    })()}
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-warning">
                        <Star className="h-3 w-3" />{s.points.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-streak">
                        <Flame className="h-3 w-3" />{s.streak}d
                      </span>
                    </div>
                    {!s.onboarded && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-warning/30 text-warning hover:bg-warning/10 text-xs"
                        onClick={() => handleResendLogin(s)}
                        disabled={resendingId === s.id}
                      >
                        {resendingId === s.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <KeyRound className="h-3 w-3 mr-1" />}
                        Resend login
                      </Button>
                    )}
                    {s.is_inactive && s.onboarded && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-danger/30 text-danger hover:bg-danger/10 text-xs"
                        onClick={() => sendReminder(s.id, s.name)}
                        disabled={remindingId === s.id}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Remind
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
      </div>

      {/* Pagination */}
      <PaginationBar
        page={page}
        pages={pages}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => { setPageSize(n); setPage(1) }}
        disabled={loading}
        itemLabel="students"
      />
    </div>
  )
}
