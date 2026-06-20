"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft, CheckCircle, XCircle, Calendar, MapPin,
  Building2, Clock, Users, GraduationCap, Loader2, Send,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { AddToCalendar, placementDriveEvent } from "@/components/add-to-calendar"

interface Drive {
  id: number
  company_name: string
  job_role: string
  industry_type: string
  ctc: number | null
  job_location: string | null
  drive_date: string
  registration_deadline: string
  seconds_to_deadline: number
  venue_or_link: string | null
  rounds: string[]
  min_cgpa: number | null
  max_backlogs: number | null
  eligible_branches: string[] | null
  required_skills: string | null
  description: string | null
  is_eligible: boolean
  registration_status: string | null
  registered_count: number
}

interface AcademicProfile {
  cgpa: number | null
  active_backlogs: number | null
  tenth_percent: number | null
  twelfth_percent: number | null
  placement_status: string
  updated_at: string | null
}

const EDIT_FIELDS = [
  { key: "cgpa", label: "CGPA", type: "number", step: "0.01" },
  { key: "tenth_percent", label: "10th %", type: "number", step: "0.1" },
  { key: "twelfth_percent", label: "12th %", type: "number", step: "0.1" },
  { key: "active_backlogs", label: "Active Backlogs", type: "number", step: "1" },
  { key: "backlog_history", label: "Total Backlogs (History)", type: "number", step: "1" },
  { key: "gap_years", label: "Gap Years", type: "number", step: "1" },
] as const

function Countdown({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds)
  useEffect(() => {
    if (remaining <= 0) return
    const t = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  if (remaining <= 0) return <span className="text-danger font-medium">Registration Closed</span>
  const d = Math.floor(remaining / 86400)
  const h = Math.floor((remaining % 86400) / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  if (d > 0) return <span className="text-success font-medium">{d}d {h}h {m}m remaining</span>
  if (h > 0) return <span className="text-warning font-medium">{h}h {m}m remaining</span>
  return <span className="text-danger font-medium animate-pulse">{m}m {String(s).padStart(2, "0")}s remaining!</span>
}

export default function DriveDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [drive, setDrive] = useState<Drive | null>(null)
  const [academic, setAcademic] = useState<AcademicProfile | null>(null)
  const [hasPendingRequest, setHasPendingRequest] = useState(false)
  const [lastRequest, setLastRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  // Edit request modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFields, setEditFields] = useState<Record<string, string>>({})
  const [editReason, setEditReason] = useState("")
  const [submittingEdit, setSubmittingEdit] = useState(false)

  function openEditModal() {
    if (academic) {
      setEditFields({
        cgpa: academic.cgpa != null ? String(academic.cgpa) : "",
        tenth_percent: academic.tenth_percent != null ? String(academic.tenth_percent) : "",
        twelfth_percent: academic.twelfth_percent != null ? String(academic.twelfth_percent) : "",
        active_backlogs: academic.active_backlogs != null ? String(academic.active_backlogs) : "",
        backlog_history: (academic as any).backlog_history != null ? String((academic as any).backlog_history) : "",
        gap_years: (academic as any).gap_years != null ? String((academic as any).gap_years) : "",
      })
    }
    setShowEditModal(true)
  }

  useEffect(() => {
    Promise.all([
      api.get(`/student/drives/${id}`),
      api.get("/student/profile/academic"),
    ]).then(([driveRes, profileRes]) => {
      setDrive(driveRes.data.drive)
      setAcademic(profileRes.data.academic)
      setHasPendingRequest(profileRes.data.has_pending_request)
      setLastRequest(profileRes.data.last_request)
    }).catch(() => toast.error("Failed to load drive details"))
      .finally(() => setLoading(false))
  }, [id])

  async function handleRegister() {
    setRegistering(true)
    try {
      await api.post(`/student/drives/${id}/register`)
      toast.success("Registered successfully!")
      setDrive(prev => prev ? { ...prev, registration_status: "registered", registered_count: prev.registered_count + 1 } : prev)
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Registration failed")
    } finally {
      setRegistering(false)
    }
  }

  async function handleEditRequest() {
    const hasField = Object.values(editFields).some(v => v !== "")
    if (!hasField) { toast.error("Enter at least one field to correct"); return }
    if (!editReason.trim()) { toast.error("Please provide a reason"); return }

    setSubmittingEdit(true)
    try {
      const payload: any = { reason: editReason }
      for (const [k, v] of Object.entries(editFields)) {
        if (v !== "") payload[k] = parseFloat(v)
      }
      await api.post("/student/profile/academic/request-edit", payload)
      toast.success("Correction request submitted — admin will review it")
      setHasPendingRequest(true)
      setShowEditModal(false)
      setEditFields({})
      setEditReason("")
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to submit request")
    } finally {
      setSubmittingEdit(false)
    }
  }

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )

  if (!drive) return (
    <div className="text-center py-20 text-muted-foreground">Drive not found.</div>
  )

  const deadlinePassed = drive.seconds_to_deadline <= 0

  return (
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => router.push("/placements")}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Drives
      </Button>

      {/* Main drive card */}
      <GlassCard className="p-6 space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{drive.company_name}</h1>
              <span className="chip chip-primary">{drive.industry_type}</span>
              {drive.is_eligible
                ? <span className="chip chip-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> You're Eligible</span>
                : <span className="chip chip-danger flex items-center gap-1"><XCircle className="w-3 h-3" /> Not Eligible</span>
              }
            </div>
            <p className="text-muted-foreground mt-1">{drive.job_role}</p>
          </div>
          <div className="text-right">
            <Countdown seconds={drive.seconds_to_deadline} />
            <p className="text-xs text-muted-foreground mt-0.5">
              Deadline: {new Date(drive.registration_deadline).toLocaleString()}
            </p>
            {drive.drive_date && (
              <div className="mt-2 flex justify-end">
                <AddToCalendar event={placementDriveEvent(drive)} compact />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "CTC", value: drive.ctc ? `₹${drive.ctc} LPA` : "Not disclosed" },
            { label: "Location", value: drive.job_location || "TBD" },
            { label: "Drive Date", value: new Date(drive.drive_date).toLocaleDateString() },
            { label: "Registered", value: `${drive.registered_count} students` },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-medium text-sm mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {drive.rounds?.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Interview Process</p>
            <div className="flex flex-wrap gap-2">
              {drive.rounds.map((r, i) => (
                <span key={r} className="chip chip-primary">{i + 1}. {r}</span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm border-t border-border pt-4">
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
          <div>
            <p className="text-xs text-muted-foreground">Required Skills</p>
            <p className="text-sm mt-0.5">{drive.required_skills}</p>
          </div>
        )}
        {drive.venue_or_link && (
          <div>
            <p className="text-xs text-muted-foreground">Venue / Link</p>
            <p className="text-sm mt-0.5">{drive.venue_or_link}</p>
          </div>
        )}
        {drive.description && (
          <div className="bg-muted/30 rounded-xl p-4 text-sm">
            {drive.description}
          </div>
        )}

        {/* Register button */}
        <div className="border-t border-border pt-4">
          {drive.registration_status ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium">
                You're registered — status: <strong className="capitalize">{drive.registration_status}</strong>
              </span>
            </div>
          ) : deadlinePassed ? (
            <p className="text-muted-foreground text-sm">Registration is closed for this drive.</p>
          ) : !drive.is_eligible ? (
            <p className="text-muted-foreground text-sm">You don't meet the eligibility criteria for this drive.</p>
          ) : (
            <Button onClick={handleRegister} disabled={registering} className="w-full sm:w-auto">
              {registering && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Register for this Drive
            </Button>
          )}
        </div>
      </GlassCard>

      {/* Academic profile (read-only) */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold flex items-center gap-2">
            <GraduationCap className="w-4 h-4" /> Your Academic Profile
          </h2>
          {!hasPendingRequest && (
            <Button variant="outline" size="sm" onClick={openEditModal}>
              Request Correction
            </Button>
          )}
          {hasPendingRequest && (
            <span className="chip chip-warning text-xs">Correction request pending</span>
          )}
        </div>

        {academic ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: "CGPA", value: academic.cgpa ?? "—" },
              { label: "10th %", value: academic.tenth_percent ?? "—" },
              { label: "12th %", value: academic.twelfth_percent ?? "—" },
              { label: "Backlogs", value: academic.active_backlogs ?? 0 },
              { label: "Backlog History", value: (academic as any).backlog_history ?? 0 },
              { label: "Gap Years", value: (academic as any).gap_years ?? 0 },
            ].map(f => (
              <div key={f.label} className="text-center p-3 bg-muted/30 rounded-xl">
                <p className="text-lg font-bold">{f.value}</p>
                <p className="text-xs text-muted-foreground">{f.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-warning bg-warning/10 border border-warning/20 rounded-xl p-4">
            Your academic data has not been uploaded yet. Contact your placement officer.
          </div>
        )}

        {lastRequest && lastRequest.status === "rejected" && (
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 text-sm">
            <p className="font-medium text-danger">Last correction request was rejected</p>
            {lastRequest.admin_note && <p className="text-muted-foreground mt-1">{lastRequest.admin_note}</p>}
          </div>
        )}
      </GlassCard>

      {/* Edit request modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-popover border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
              <h2 className="font-semibold">Request Data Correction</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>✕</Button>
            </div>
            <div className="overflow-y-auto p-5 space-y-4">
              <p className="text-xs text-muted-foreground">
                Only fill the fields that need correction. Leave others blank. Your admin will review and apply the changes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EDIT_FIELDS.map(f => (
                  <div key={f.key} className="space-y-1">
                    <Label className="text-xs">{f.label}</Label>
                    <Input
                      type={f.type}
                      step={(f as any).step}
                      value={editFields[f.key] ?? ""}
                      onChange={e => setEditFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <Label>Reason for correction *</Label>
                <Textarea
                  rows={3}
                  placeholder="Explain why the current data is incorrect..."
                  value={editReason}
                  onChange={e => setEditReason(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button onClick={handleEditRequest} disabled={submittingEdit}>
                  {submittingEdit && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Send className="w-4 h-4 mr-2" /> Submit Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
