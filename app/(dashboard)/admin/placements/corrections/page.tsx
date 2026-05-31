"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { motion } from "framer-motion"

interface EditRequest {
  id: number
  user_id: number
  student_name: string
  student_email: string
  roll_number: string | null
  branch: string | null
  tenth_percent: number | null
  twelfth_percent: number | null
  cgpa: number | null
  active_backlogs: number | null
  backlog_history: number | null
  gap_years: number | null
  reason: string
  status: "pending" | "approved" | "rejected"
  admin_note: string | null
  requested_at: string
  reviewed_at: string | null
  current: {
    tenth_percent: number | null
    twelfth_percent: number | null
    cgpa: number | null
    active_backlogs: number | null
    backlog_history: number | null
    gap_years: number | null
    placement_status: string
  } | null
}

const FIELDS: { key: keyof EditRequest; label: string }[] = [
  { key: "cgpa", label: "CGPA" },
  { key: "tenth_percent", label: "10th %" },
  { key: "twelfth_percent", label: "12th %" },
  { key: "active_backlogs", label: "Active Backlogs" },
  { key: "backlog_history", label: "Backlog History" },
  { key: "gap_years", label: "Gap Years" },
]

function RejectModal({
  open, onClose, onReject,
}: { open: boolean; onClose: () => void; onReject: (note: string) => void }) {
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    await onReject(note)
    setLoading(false)
    setNote("")
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-6 space-y-4">
        <h2 className="font-semibold">Reject Correction Request</h2>
        <div className="space-y-1">
          <Label>Reason for rejection (shown to student)</Label>
          <Textarea
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. CGPA change not supported without official marksheet"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={submit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Reject
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}

export default function CorrectionsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<EditRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"pending" | "all">("pending")
  const [actionId, setActionId] = useState<number | null>(null)
  const [rejectTarget, setRejectTarget] = useState<number | null>(null)

  useEffect(() => { fetchRequests() }, [tab])

  async function fetchRequests() {
    setLoading(true)
    try {
      const res = await api.get(`/admin/profile-corrections?status=${tab}`)
      setRequests(res.data.requests)
    } catch {
      toast.error("Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  async function approve(id: number) {
    setActionId(id)
    try {
      await api.post(`/admin/profile-corrections/${id}/approve`)
      toast.success("Approved and applied")
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r))
    } catch {
      toast.error("Failed to approve")
    } finally {
      setActionId(null)
    }
  }

  async function reject(id: number, note: string) {
    try {
      await api.post(`/admin/profile-corrections/${id}/reject`, { admin_note: note })
      toast.success("Request rejected")
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected", admin_note: note } : r))
    } finally {
      setRejectTarget(null)
    }
  }

  const pendingCount = requests.filter(r => r.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/placements")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Profile Correction Requests</h1>
          <p className="text-sm text-muted-foreground">Students requesting changes to their academic data</p>
        </div>
        <div className="flex gap-2">
          {(["pending", "all"] as const).map(t => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t)}
            >
              {t === "pending" ? `Pending${pendingCount > 0 ? ` (${pendingCount})` : ""}` : "All"}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      ) : requests.length === 0 ? (
        <GlassCard className="p-12 text-center text-muted-foreground">
          <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No {tab === "pending" ? "pending" : ""} correction requests.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {requests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="p-5 space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{req.student_name}</p>
                      <span className={
                        req.status === "pending" ? "chip chip-warning" :
                        req.status === "approved" ? "chip chip-success" : "chip chip-danger"
                      }>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{req.student_email}</p>
                    {(req.roll_number || req.branch) && (
                      <p className="text-xs text-muted-foreground">
                        {[req.roll_number, req.branch].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(req.requested_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Side by side comparison */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-muted/40 text-xs text-muted-foreground">
                        <th className="text-left p-2 font-medium">Field</th>
                        <th className="text-left p-2 font-medium">Current Value</th>
                        <th className="text-left p-2 font-medium">Requested Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {FIELDS.filter(f => req[f.key] !== null && req[f.key] !== undefined).map(f => (
                        <tr key={f.key} className="hover:bg-muted/20">
                          <td className="p-2 font-medium">{f.label}</td>
                          <td className="p-2 text-muted-foreground">
                            {req.current ? (req.current[f.key as keyof typeof req.current] ?? "—") : "—"}
                          </td>
                          <td className="p-2 font-medium text-primary">
                            {req[f.key] as string | number}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-muted/30 rounded-xl p-3 text-sm">
                  <span className="text-xs text-muted-foreground">Student's reason: </span>
                  {req.reason}
                </div>

                {req.admin_note && (
                  <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 text-sm text-danger">
                    <span className="font-medium">Admin note: </span>{req.admin_note}
                  </div>
                )}

                {req.status === "pending" && (
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-danger border-danger/30 hover:bg-danger/10"
                      onClick={() => setRejectTarget(req.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approve(req.id)}
                      disabled={actionId === req.id}
                    >
                      {actionId === req.id
                        ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        : <CheckCircle className="w-4 h-4 mr-1" />}
                      Approve & Apply
                    </Button>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <RejectModal
        open={rejectTarget !== null}
        onClose={() => setRejectTarget(null)}
        onReject={note => reject(rejectTarget!, note)}
      />
    </div>
  )
}
