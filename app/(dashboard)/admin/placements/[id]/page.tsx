"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft, Bell, Building2, Calendar, MapPin,
  Users, Loader2, CheckCircle, XCircle, BookOpen,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { motion } from "framer-motion"

interface Drive {
  id: number
  company_name: string
  job_role: string
  industry_type: string
  ctc: number | null
  job_location: string | null
  drive_date: string
  registration_deadline: string
  venue_or_link: string | null
  rounds: string[]
  min_cgpa: number | null
  max_backlogs: number | null
  eligible_branches: string[] | null
  required_skills: string | null
  description: string | null
  is_active: boolean
  registered_count: number
}

interface EligibleStudent {
  id: number
  name: string
  email: string
  roll_number: string | null
  branch: string | null
  section: string | null
  cgpa: number | null
  active_backlogs: number | null
  placement_status: string
  registration_status: string | null
}

const statusChip: Record<string, string> = {
  registered: "chip chip-primary",
  shortlisted: "chip chip-warning",
  selected: "chip chip-success",
  rejected: "chip chip-danger",
}

const placementStatusChip: Record<string, string> = {
  not_placed: "chip",
  selected: "chip chip-success",
  joined: "chip chip-primary",
}

export default function DriveDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [drive, setDrive] = useState<Drive | null>(null)
  const [students, setStudents] = useState<EligibleStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [notifying, setNotifying] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => { fetchAll() }, [id])

  async function fetchAll() {
    try {
      const [driveRes, stuRes] = await Promise.all([
        api.get(`/admin/drives`),
        api.get(`/admin/drives/${id}/eligible-students`),
      ])
      const found = driveRes.data.drives.find((d: Drive) => d.id === parseInt(id))
      setDrive(found ?? null)
      setStudents(stuRes.data.students)
    } catch {
      toast.error("Failed to load drive data")
    } finally {
      setLoading(false)
    }
  }

  async function handleNotify() {
    if (!confirm(`Send drive notification email to all eligible students?`)) return
    setNotifying(true)
    try {
      const res = await api.post(`/admin/drives/${id}/notify`)
      toast.success(`Sent to ${res.data.sent} students${res.data.failed > 0 ? `, ${res.data.failed} failed` : ""}`)
    } catch {
      toast.error("Failed to send notifications")
    } finally {
      setNotifying(false)
    }
  }

  async function updateStatus(userId: number, status: string) {
    setUpdatingId(userId)
    try {
      await api.patch(`/admin/drives/${id}/students/${userId}/status`, { status })
      setStudents(prev => prev.map(s => s.id === userId ? { ...s, registration_status: status } : s))
      toast.success("Status updated")
    } catch {
      toast.error("Failed to update status")
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )

  if (!drive) return (
    <div className="text-center py-20 text-muted-foreground">Drive not found.</div>
  )

  const registered = students.filter(s => s.registration_status)
  const shortlisted = students.filter(s => s.registration_status === "shortlisted")
  const selected = students.filter(s => s.registration_status === "selected")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/placements")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      </div>

      {/* Drive info card */}
      <GlassCard className="p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{drive.company_name}</h1>
              <span className="chip chip-primary">{drive.industry_type}</span>
              {!drive.is_active && <span className="chip chip-danger">Inactive</span>}
            </div>
            <p className="text-muted-foreground mt-1">{drive.job_role}</p>
          </div>
          <Button onClick={handleNotify} disabled={notifying}>
            {notifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bell className="w-4 h-4 mr-2" />}
            Notify Eligible Students
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: "CTC", value: drive.ctc ? `₹${drive.ctc} LPA` : "Not disclosed" },
            { label: "Location", value: drive.job_location || "TBD" },
            { label: "Drive Date", value: new Date(drive.drive_date).toLocaleDateString() },
            { label: "Deadline", value: new Date(drive.registration_deadline).toLocaleDateString() },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-medium text-sm mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {drive.rounds?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Interview Rounds</p>
            <div className="flex flex-wrap gap-2">
              {drive.rounds.map((r, i) => (
                <span key={r} className="chip chip-primary">{i + 1}. {r}</span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Min CGPA</p>
            <p className="font-medium">{drive.min_cgpa ?? "No minimum"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Max Backlogs</p>
            <p className="font-medium">{drive.max_backlogs ?? "No limit"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Eligible Branches</p>
            <p className="font-medium">{drive.eligible_branches ? drive.eligible_branches.join(", ") : "All branches"}</p>
          </div>
        </div>

        {drive.required_skills && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Required Skills</p>
            <p className="text-sm mt-0.5">{drive.required_skills}</p>
          </div>
        )}
        {drive.description && (
          <div className="mt-4 p-3 bg-muted/30 rounded-xl text-sm">
            {drive.description}
          </div>
        )}
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Eligible", value: students.length },
          { label: "Registered", value: registered.length },
          { label: "Shortlisted", value: shortlisted.length },
          { label: "Selected", value: selected.length },
        ].map(s => (
          <GlassCard key={s.label} className="p-4 text-center">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Eligible students table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" /> Eligible Students ({students.length})
          </h2>
        </div>
        {students.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No eligible students found for this drive's criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs">
                  <th className="text-left p-3 font-medium">Student</th>
                  <th className="text-left p-3 font-medium">Roll No</th>
                  <th className="text-left p-3 font-medium">Branch</th>
                  <th className="text-left p-3 font-medium">CGPA</th>
                  <th className="text-left p-3 font-medium">Backlogs</th>
                  <th className="text-left p-3 font-medium">Placement</th>
                  <th className="text-left p-3 font-medium">Drive Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-3">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </td>
                    <td className="p-3 text-muted-foreground">{s.roll_number || "—"}</td>
                    <td className="p-3">{s.branch || "—"}{s.section ? ` / ${s.section}` : ""}</td>
                    <td className="p-3 font-medium">{s.cgpa ?? "—"}</td>
                    <td className="p-3">{s.active_backlogs ?? 0}</td>
                    <td className="p-3">
                      <span className={placementStatusChip[s.placement_status] ?? "chip"}>
                        {s.placement_status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3">
                      {s.registration_status ? (
                        <Select
                          value={s.registration_status}
                          onValueChange={val => updateStatus(s.id, val)}
                          disabled={updatingId === s.id}
                        >
                          <SelectTrigger className="h-7 text-xs w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["registered", "shortlisted", "selected", "rejected"].map(v => (
                              <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-muted-foreground text-xs">Not registered</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
