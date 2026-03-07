"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Search, Flame, Mail, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

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
  return `${diffDays} days ago`
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [remindingId, setRemindingId] = useState<number | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")
  const [sectionFilter, setSectionFilter] = useState("all")

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (branchFilter !== "all") params.set("branch", branchFilter)
    if (sectionFilter !== "all") params.set("section", sectionFilter)
    params.set("per_page", "100")

    setLoading(true)
    const timeout = setTimeout(() => {
      api.get(`/admin/students?${params}`)
        .then((res) => {
          setStudents(res.data.students)
          setTotal(res.data.total)
        })
        .catch(() => toast.error("Failed to load students"))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery, branchFilter, sectionFilter])

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

  const branches = Array.from(new Set(students.map(s => s.branch).filter(Boolean))).sort()
  const sections = Array.from(new Set(students.map(s => s.section).filter(Boolean))).sort()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Students</h1>
        <p className="text-muted-foreground mt-1">Manage and monitor your college students</p>
      </div>

      <GlassCard>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h3 className="font-semibold font-serif text-foreground">
            Student Directory
            <span className="ml-2 text-sm font-normal text-muted-foreground">({total})</span>
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 lg:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full lg:w-64 bg-secondary/50 border-border text-foreground"
              />
            </div>

            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-[130px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-[130px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">#</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Roll No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Branch / Sec</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Points</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Streak</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
                  <th className="py-3 px-4 hidden xl:table-cell"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={cn(
                      "border-b border-border/50 transition-colors hover:bg-secondary/30",
                      student.is_inactive && "bg-red-500/5"
                    )}
                  >
                    <td className="py-3 px-4 text-sm text-muted-foreground">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={cn(
                            "text-xs",
                            student.is_inactive ? "bg-red-500/20 text-red-400" : "bg-secondary text-foreground"
                          )}>
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-sm text-muted-foreground">
                      {student.roll_number || "—"}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-sm text-muted-foreground">
                      {student.branch || "—"}{student.section ? ` / ${student.section}` : ""}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium text-foreground">
                      {student.points.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right hidden lg:table-cell">
                      <div className="flex items-center justify-end gap-1">
                        <Flame className={cn("h-3 w-3", student.streak > 0 ? "text-orange-500" : "text-muted-foreground")} />
                        <span className="text-sm text-foreground">{student.streak}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn("text-sm", student.is_inactive ? "text-red-400" : "text-muted-foreground")}>
                        {formatLastActive(student.last_active)}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      {student.is_inactive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleRemind(student)}
                          disabled={remindingId === student.id}
                        >
                          {remindingId === student.id
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : <><Mail className="h-3 w-3 mr-1" />Remind</>
                          }
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {students.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No students found</p>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
