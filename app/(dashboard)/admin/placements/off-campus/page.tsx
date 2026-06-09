"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft, CheckCircle, XCircle, Loader2, MapPin, Calendar, IndianRupee,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { motion } from "framer-motion"

interface OffCampus {
  id: number
  user_id: number
  student_name: string | null
  student_email: string | null
  roll_number: string | null
  branch: string | null
  company_name: string
  job_role: string
  industry_type: string
  ctc: number | null
  job_location: string | null
  offer_type: string
  offer_date: string
  description: string | null
  status: "pending" | "approved" | "rejected"
  admin_note: string | null
  submitted_at: string
}

const industryChip: Record<string, string> = {
  IT: "chip chip-primary",
  Core: "chip chip-warning",
  Services: "chip chip-success",
  Consulting: "chip chip-coding",
  Manufacturing: "chip chip-streak",
  Other: "chip",
}

const offerTypeLabel: Record<string, string> = {
  full_time: "Full-time", internship: "Internship", internship_ppo: "Internship + PPO",
}

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
        <h2 className="font-semibold">Reject Off-Campus Submission</h2>
        <div className="space-y-1">
          <Label>Reason for rejection (shown to student)</Label>
          <Textarea
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Could not verify the offer — please share the offer letter with the placement cell"
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

export default function OffCampusReviewPage() {
  const router = useRouter()
  const [rows, setRows] = useState<OffCampus[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"pending" | "all">("pending")
  const [actionId, setActionId] = useState<number | null>(null)
  const [rejectTarget, setRejectTarget] = useState<number | null>(null)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => { fetchRows() }, [tab])

  async function fetchRows() {
    setLoading(true)
    try {
      const res = await api.get(`/admin/off-campus?status=${tab}`)
      setRows(res.data.submissions)
      setPendingCount(res.data.pending_count || 0)
    } catch {
      toast.error("Failed to load submissions")
    } finally {
      setLoading(false)
    }
  }

  async function approve(id: number) {
    setActionId(id)
    try {
      await api.patch(`/admin/off-campus/${id}`, { action: "approve" })
      toast.success("Approved — counted as a placement")
      setRows(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r))
      setPendingCount(c => Math.max(0, c - 1))
    } catch {
      toast.error("Failed to approve")
    } finally {
      setActionId(null)
    }
  }

  async function reject(id: number, note: string) {
    try {
      await api.patch(`/admin/off-campus/${id}`, { action: "reject", admin_note: note })
      toast.success("Submission rejected")
      setRows(prev => prev.map(r => r.id === id ? { ...r, status: "rejected", admin_note: note } : r))
      setPendingCount(c => Math.max(0, c - 1))
    } catch {
      toast.error("Failed to reject")
    } finally {
      setRejectTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/placements")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Off-Campus Placements</h1>
          <p className="text-sm text-muted-foreground">
            Student-reported offers. Approved ones count towards your placement reports.
          </p>
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
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)}
        </div>
      ) : rows.length === 0 ? (
        <GlassCard className="p-12 text-center text-muted-foreground">
          <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No {tab === "pending" ? "pending" : ""} off-campus submissions.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {rows.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="p-5 space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{r.student_name}</p>
                      <span className={
                        r.status === "pending" ? "chip chip-warning" :
                        r.status === "approved" ? "chip chip-success" : "chip chip-danger"
                      }>{r.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.student_email}</p>
                    {(r.roll_number || r.branch) && (
                      <p className="text-xs text-muted-foreground">
                        {[r.roll_number, r.branch].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Submitted {new Date(r.submitted_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-lg">{r.company_name}</p>
                    <span className={industryChip[r.industry_type] ?? "chip"}>{r.industry_type}</span>
                    <span className="chip">{offerTypeLabel[r.offer_type] ?? r.offer_type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{r.job_role}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    {r.ctc != null && (
                      <span className="flex items-center gap-1 text-warning font-medium">
                        <IndianRupee className="w-3.5 h-3.5" />{r.ctc} LPA
                      </span>
                    )}
                    {r.job_location && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />{r.job_location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />Offer: {new Date(r.offer_date).toLocaleDateString()}
                    </span>
                  </div>
                  {r.description && (
                    <p className="text-sm text-muted-foreground mt-3">
                      <span className="text-xs">Notes: </span>{r.description}
                    </p>
                  )}
                </div>

                {r.status === "rejected" && r.admin_note && (
                  <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 text-sm text-danger">
                    <span className="font-medium">Admin note: </span>{r.admin_note}
                  </div>
                )}

                {r.status === "pending" && (
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-danger border-danger/30 hover:bg-danger/10"
                      onClick={() => setRejectTarget(r.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approve(r.id)}
                      disabled={actionId === r.id}
                    >
                      {actionId === r.id
                        ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        : <CheckCircle className="w-4 h-4 mr-1" />}
                      Approve as Placement
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
