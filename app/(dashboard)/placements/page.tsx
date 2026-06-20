"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Building2, Calendar, MapPin, Users, Clock,
  CheckCircle, XCircle, ChevronRight, GraduationCap, Plus, Loader2,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { AdminHero, AdminStatCard } from "@/components/admin-stat-card"
import { motion } from "framer-motion"

interface OffCampusSubmission {
  id: number
  company_name: string
  job_role: string
  industry_type: string
  ctc: number | null
  job_location: string | null
  offer_type: string
  offer_date: string
  status: "pending" | "approved" | "rejected"
  admin_note: string | null
  submitted_at: string
}

const INDUSTRY_TYPES = ["IT", "Core", "Services", "Consulting", "Manufacturing", "Other"]
const OFFER_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "internship", label: "Internship" },
  { value: "internship_ppo", label: "Internship + PPO" },
]

function OffCampusModal({
  open, onClose, onCreated,
}: { open: boolean; onClose: () => void; onCreated: (s: OffCampusSubmission) => void }) {
  const [form, setForm] = useState({
    company_name: "", job_role: "", industry_type: "IT", ctc: "",
    job_location: "", offer_type: "full_time", offer_date: "", description: "",
  })
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    if (!form.company_name.trim() || !form.job_role.trim() || !form.offer_date) {
      toast.error("Company, job role and offer date are required")
      return
    }
    setLoading(true)
    try {
      const res = await api.post("/student/off-campus", form)
      toast.success("Submitted for your college admin's approval")
      onCreated(res.data.submission)
      setForm({
        company_name: "", job_role: "", industry_type: "IT", ctc: "",
        job_location: "", offer_type: "full_time", offer_date: "", description: "",
      })
      onClose()
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to submit")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-popover border border-border rounded-2xl shadow-2xl my-auto flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh]">
        <div className="p-5 border-b border-border flex-shrink-0">
          <h2 className="font-semibold">Report Off-Campus Offer</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submit a placement you got outside college drives. Your admin will verify and approve it.
          </p>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Company *</Label>
              <Input value={form.company_name} onChange={e => set("company_name", e.target.value)} placeholder="e.g. Google" />
            </div>
            <div className="space-y-1">
              <Label>Job Role *</Label>
              <Input value={form.job_role} onChange={e => set("job_role", e.target.value)} placeholder="e.g. SDE-1" />
            </div>
            <div className="space-y-1">
              <Label>Industry</Label>
              <Select value={form.industry_type} onValueChange={v => set("industry_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INDUSTRY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Offer Type</Label>
              <Select value={form.offer_type} onValueChange={v => set("offer_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OFFER_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>CTC (LPA)</Label>
              <Input type="number" step="0.1" value={form.ctc} onChange={e => set("ctc", e.target.value)} placeholder="e.g. 12" />
            </div>
            <div className="space-y-1">
              <Label>Offer Date *</Label>
              <Input type="date" value={form.offer_date} onChange={e => set("offer_date", e.target.value)} />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Location</Label>
              <Input value={form.job_location} onChange={e => set("job_location", e.target.value)} placeholder="e.g. Bengaluru" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Notes (optional)</Label>
              <Textarea rows={2} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Any details for your admin" />
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-border flex gap-2 justify-end flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={submit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Submit for Approval
          </Button>
        </div>
      </div>
    </div>
  )
}

const offerTypeLabel = (v: string) => OFFER_TYPES.find(t => t.value === v)?.label ?? v

interface Drive {
  id: number
  company_name: string
  company_logo_url: string | null
  job_role: string
  industry_type: string
  ctc: number | null
  job_location: string | null
  drive_date: string
  registration_deadline: string
  seconds_to_deadline: number
  min_cgpa: number | null
  max_backlogs: number | null
  eligible_branches: string[] | null
  rounds: string[]
  is_eligible: boolean
  registration_status: string | null
  registered_count: number
}

const industryChip: Record<string, string> = {
  IT: "chip chip-primary",
  Core: "chip chip-warning",
  Services: "chip chip-success",
  Consulting: "chip chip-coding",
  Manufacturing: "chip chip-streak",
  Other: "chip",
}

function Countdown({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) return
    const t = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  if (remaining <= 0) return <span className="text-danger text-xs font-medium">Registration Closed</span>

  const d = Math.floor(remaining / 86400)
  const h = Math.floor((remaining % 86400) / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60

  if (d > 1) return <span className="text-success text-xs font-medium">{d}d {h}h left to register</span>
  if (d === 1 || h > 0) return <span className="text-warning text-xs font-medium">{d > 0 ? `${d}d ` : ""}{h}h {m}m left</span>
  return (
    <span className="text-danger text-xs font-medium animate-pulse">
      {m}m {String(s).padStart(2, "0")}s left!
    </span>
  )
}

export default function PlacementsPage() {
  const router = useRouter()
  const [drives, setDrives] = useState<Drive[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [offCampus, setOffCampus] = useState<OffCampusSubmission[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get("/student/drives"),
      api.get("/student/profile/academic"),
      api.get("/student/off-campus"),
    ]).then(([drivesRes, profileRes, ocRes]) => {
      setDrives(drivesRes.data.drives)
      setProfile(profileRes.data)
      setOffCampus(ocRes.data.submissions || [])
    }).catch(() => {
      toast.error("Failed to load placements")
    }).finally(() => setLoading(false))
  }, [])

  const eligible = drives.filter(d => d.is_eligible)
  const registered = drives.filter(d => d.registration_status)
  const open = drives.filter(d => d.seconds_to_deadline > 0)

  return (
    <div className="space-y-6">
      <AdminHero
        icon={Building2}
        title="Placement Drives"
        subtitle="Recruitment drives announced for your college"
        right={
          <Button onClick={() => setShowModal(true)} className="bg-white/15 hover:bg-white/25 text-white border-0">
            <Plus className="w-4 h-4 mr-1.5" /> Report Off-Campus Offer
          </Button>
        }
      />

      {/* Academic profile summary */}
      {!loading && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Your Academic Profile</p>
                {profile?.academic ? (
                  <div className="flex gap-4 text-xs text-muted-foreground mt-0.5">
                    <span>CGPA: <strong className="text-foreground">{profile.academic.cgpa ?? "—"}</strong></span>
                    <span>Backlogs: <strong className="text-foreground">{profile.academic.active_backlogs ?? 0}</strong></span>
                    <span>Status: <strong className="text-foreground capitalize">{profile.academic.placement_status?.replace("_", " ")}</strong></span>
                  </div>
                ) : (
                  <p className="text-xs text-warning mt-0.5">Academic data not uploaded yet — contact your admin</p>
                )}
              </div>
            </div>
            {profile?.has_pending_request && (
              <span className="chip chip-warning text-xs">Correction request pending</span>
            )}
          </div>
        </GlassCard>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3">
          {([
            { label: "Total Drives", value: drives.length, icon: Building2 },
            { label: "Eligible", value: eligible.length, icon: CheckCircle },
            { label: "Registered", value: registered.length, icon: Users },
          ] as const).map((s, i) => (
            <AdminStatCard key={s.label} index={i} icon={s.icon} label={s.label} value={s.value} />
          ))}
        </div>
      )}

      {/* Drives */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      ) : drives.length === 0 ? (
        <GlassCard className="p-12 text-center text-muted-foreground">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No placement drives announced yet.</p>
          <p className="text-xs mt-1">Check back later or contact your placement officer.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {drives.map((drive, i) => (
            <motion.div
              key={drive.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard
                className="p-5 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/placements/${drive.id}`)}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-lg">{drive.company_name}</h2>
                      <span className={industryChip[drive.industry_type] ?? "chip"}>{drive.industry_type}</span>
                      {drive.is_eligible
                        ? <span className="chip chip-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Eligible</span>
                        : <span className="chip chip-danger flex items-center gap-1"><XCircle className="w-3 h-3" /> Not Eligible</span>
                      }
                      {drive.registration_status && (
                        <span className={
                          drive.registration_status === "selected" ? "chip chip-success" :
                          drive.registration_status === "shortlisted" ? "chip chip-warning" :
                          drive.registration_status === "rejected" ? "chip chip-danger" : "chip chip-primary"
                        }>
                          {drive.registration_status}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mt-0.5">{drive.job_role}</p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      {drive.ctc && <span className="text-warning font-medium">₹{drive.ctc} LPA</span>}
                      {drive.job_location && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />{drive.job_location}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />Drive: {new Date(drive.drive_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3 h-3" />{drive.registered_count} registered
                      </span>
                    </div>

                    {drive.rounds?.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {drive.rounds.map((r, ri) => (
                          <span key={r} className="text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">
                            {ri + 1}. {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Countdown seconds={drive.seconds_to_deadline} />
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* My off-campus submissions */}
      {!loading && offCampus.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">My Off-Campus Submissions</h2>
          {offCampus.map(s => (
            <GlassCard key={s.id} className="p-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{s.company_name}</p>
                    <span className={
                      s.status === "approved" ? "chip chip-success" :
                      s.status === "rejected" ? "chip chip-danger" : "chip chip-warning"
                    }>{s.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.job_role} · {offerTypeLabel(s.offer_type)}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    {s.ctc != null && <span className="text-warning font-medium">₹{s.ctc} LPA</span>}
                    {s.job_location && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />{s.job_location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" />Offer: {new Date(s.offer_date).toLocaleDateString()}
                    </span>
                  </div>
                  {s.status === "rejected" && s.admin_note && (
                    <div className="mt-2 bg-danger/10 border border-danger/20 rounded-lg p-2 text-xs text-danger">
                      <span className="font-medium">Admin note: </span>{s.admin_note}
                    </div>
                  )}
                </div>
                <span className={industryChip[s.industry_type] ?? "chip"}>{s.industry_type}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <OffCampusModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={s => setOffCampus(prev => [s, ...prev])}
      />
    </div>
  )
}
