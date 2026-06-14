"use client"

import { useEffect, useState, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { AdminStatCard } from "@/components/admin-stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Building2, Plus, Pencil, Trash2, Users, Calendar,
  MapPin, Loader2, ChevronRight, ChevronLeft, Check,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"

const BRANCHES = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIDS", "AIML", "CSD", "Other"]
const ROUNDS = ["Aptitude", "GD", "Technical", "HR Interview", "Coding Test", "Case Study"]
const INDUSTRY_TYPES = ["IT", "Core", "Services", "Consulting", "Manufacturing", "Other"]

interface Drive {
  id: number
  drive_code: string | null
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
  required_skills: string | null
  description: string | null
  hr_name: string | null
  hr_email: string | null
  hr_phone: string | null
  is_active: boolean
  registered_count: number
  created_at: string
}

const schema = z.object({
  drive_code: z.string().optional(),
  company_name: z.string().min(1, "Company name is required"),
  job_role: z.string().min(1, "Job role is required"),
  industry_type: z.enum(["IT", "Core", "Services", "Consulting", "Manufacturing", "Other"]),
  ctc: z.string().optional(),
  job_location: z.string().optional(),
  drive_date: z.string().min(1, "Drive date is required"),
  registration_deadline: z.string().min(1, "Deadline is required"),
  venue_or_link: z.string().optional(),
  min_cgpa: z.string().optional(),
  max_backlogs: z.string().optional(),
  required_skills: z.string().optional(),
  description: z.string().optional(),
  hr_name: z.string().optional(),
  hr_email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  hr_phone: z.string().optional(),
  is_active: z.boolean().optional(),
})
type FormData = z.infer<typeof schema>

const industryChip: Record<string, string> = {
  IT: "chip chip-primary",
  Core: "chip chip-warning",
  Services: "chip chip-success",
  Consulting: "chip chip-coding",
  Manufacturing: "chip chip-streak",
  Other: "chip",
}

function formatDeadline(isoStr: string, seconds: number) {
  if (seconds <= 0) return "Closed"
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  if (d > 0) return `${d}d ${h}h left`
  if (h > 0) return `${h}h left`
  return "< 1h left"
}

const STEP_META: { title: string; fields: (keyof FormData)[] }[] = [
  { title: "Company & Role",        fields: ["drive_code", "company_name", "job_role", "industry_type", "ctc", "job_location"] },
  { title: "Schedule & Eligibility", fields: ["drive_date", "registration_deadline", "venue_or_link", "min_cgpa", "max_backlogs", "required_skills"] },
  { title: "HR & Notes",            fields: ["hr_name", "hr_email", "hr_phone", "description"] },
]

function DriveFormModal({
  open, onClose, onSaved, editing,
}: {
  open: boolean; onClose: () => void; onSaved: (d: Drive) => void; editing: Drive | null
}) {
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(0)
  const [selectedRounds, setSelectedRounds] = useState<string[]>([])
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [allBranches, setAllBranches] = useState(true)

  const { register, handleSubmit, control, reset, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { industry_type: "IT", is_active: true },
  })

  useEffect(() => {
    if (!open) return
    setStep(0)
    if (editing) {
      reset({
        drive_code: editing.drive_code ?? "",
        company_name: editing.company_name,
        job_role: editing.job_role,
        industry_type: editing.industry_type as FormData["industry_type"],
        ctc: editing.ctc?.toString() ?? "",
        job_location: editing.job_location ?? "",
        drive_date: editing.drive_date?.slice(0, 16) ?? "",
        registration_deadline: editing.registration_deadline?.slice(0, 16) ?? "",
        min_cgpa: editing.min_cgpa?.toString() ?? "",
        max_backlogs: editing.max_backlogs?.toString() ?? "",
        required_skills: editing.required_skills ?? "",
        description: editing.description ?? "",
        hr_name: editing.hr_name ?? "",
        hr_email: editing.hr_email ?? "",
        hr_phone: editing.hr_phone ?? "",
        is_active: editing.is_active,
      })
      setSelectedRounds(editing.rounds || [])
      if (editing.eligible_branches) {
        setAllBranches(false)
        setSelectedBranches(editing.eligible_branches)
      } else {
        setAllBranches(true)
        setSelectedBranches([])
      }
    } else {
      reset({ industry_type: "IT", is_active: true })
      setSelectedRounds([])
      setSelectedBranches([])
      setAllBranches(true)
    }
  }, [open, editing, reset])

  async function onSubmit(data: FormData) {
    setSaving(true)
    try {
      const payload = {
        ...data,
        ctc: data.ctc ? parseFloat(data.ctc) : null,
        min_cgpa: data.min_cgpa ? parseFloat(data.min_cgpa) : null,
        max_backlogs: data.max_backlogs ? parseInt(data.max_backlogs) : null,
        rounds: selectedRounds,
        eligible_branches: allBranches ? null : selectedBranches,
      }
      const res = editing
        ? await api.patch(`/admin/drives/${editing.id}`, payload)
        : await api.post("/admin/drives", payload)
      onSaved(res.data as Drive ?? res.data.drive)
      toast.success(editing ? "Drive updated" : "Drive created")
      onClose()
    } catch {
      toast.error("Failed to save drive")
    } finally {
      setSaving(false)
    }
  }

  const isLast = step === STEP_META.length - 1

  async function goNext() {
    const ok = await trigger(STEP_META[step].fields)
    if (ok) setStep((s) => Math.min(s + 1, STEP_META.length - 1))
  }

  // Jump to the first step that has a validation error on final submit
  function onInvalid(errs: Record<string, unknown>) {
    for (let i = 0; i < STEP_META.length; i++) {
      if (STEP_META[i].fields.some((f) => errs[f])) { setStep(i); return }
    }
  }

  // Enter advances steps instead of submitting (except on the last step / textarea)
  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && !(e.target as HTMLElement).matches("textarea") && !isLast) {
      e.preventDefault()
      goNext()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-popover border border-border rounded-2xl shadow-2xl my-auto flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold">{editing ? "Edit Drive" : "New Placement Drive"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-3 border-b border-border flex-shrink-0">
          {STEP_META.map((s, i) => {
            const isActive = i === step
            const isDone = i < step
            return (
              <button
                type="button"
                key={s.title}
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 flex-1 min-w-0 rounded-lg px-2 py-1.5 transition-colors ${isActive ? "bg-primary/10" : "hover:bg-muted/50"}`}
              >
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
                  isActive ? "bg-primary text-primary-foreground"
                  : isDone ? "bg-success/15 text-success"
                  : "bg-secondary text-muted-foreground"
                }`}>
                  {isDone ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <span className={`text-xs font-medium truncate hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.title}
                </span>
              </button>
            )
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} onKeyDown={handleKeyDown} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            {/* ── Step 1 — Company & Role ── */}
            {step === 0 && (
            <section className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Drive ID / Code</Label>
                <Input {...register("drive_code")} placeholder="e.g. DRV-2026-014" />
              </div>
              <div className="space-y-1">
                <Label>Company Name *</Label>
                <Input {...register("company_name")} placeholder="e.g. Infosys" />
                {errors.company_name && <p className="text-danger text-xs">{errors.company_name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Job Role *</Label>
                <Input {...register("job_role")} placeholder="e.g. Software Engineer" />
                {errors.job_role && <p className="text-danger text-xs">{errors.job_role.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Industry Type *</Label>
                <Controller name="industry_type" control={control} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1">
                <Label>CTC (LPA)</Label>
                <Input {...register("ctc")} type="number" step="0.5" placeholder="e.g. 6.5" />
              </div>
              <div className="space-y-1">
                <Label>Job Location</Label>
                <Input {...register("job_location")} placeholder="e.g. Bangalore" />
              </div>
            </div>
            </section>
            )}

            {/* ── Step 2 — Schedule & Eligibility ── */}
            {step === 1 && (
            <section className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Drive Date *</Label>
                <Input {...register("drive_date")} type="datetime-local" />
                {errors.drive_date && <p className="text-danger text-xs">{errors.drive_date.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Registration Deadline *</Label>
                <Input {...register("registration_deadline")} type="datetime-local" />
                {errors.registration_deadline && <p className="text-danger text-xs">{errors.registration_deadline.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Venue / Link</Label>
                <Input {...register("venue_or_link")} placeholder="Online link or venue address" />
              </div>
              <div className="space-y-1">
                <Label>Minimum CGPA</Label>
                <Input {...register("min_cgpa")} type="number" step="0.1" min="0" max="10" placeholder="e.g. 6.5" />
              </div>
              <div className="space-y-1">
                <Label>Max Active Backlogs</Label>
                <Input {...register("max_backlogs")} type="number" min="0" placeholder="e.g. 0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Eligible Branches</Label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={allBranches} onChange={e => setAllBranches(e.target.checked)} />
                All branches eligible
              </label>
              {!allBranches && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {BRANCHES.map(b => (
                    <label key={b} className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(b)}
                        onChange={e => setSelectedBranches(prev =>
                          e.target.checked ? [...prev, b] : prev.filter(x => x !== b)
                        )}
                      />
                      {b}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Interview Rounds</Label>
              <div className="flex flex-wrap gap-2">
                {ROUNDS.map(r => (
                  <label key={r} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRounds.includes(r)}
                      onChange={e => setSelectedRounds(prev =>
                        e.target.checked ? [...prev, r] : prev.filter(x => x !== r)
                      )}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Required Skills</Label>
              <Input {...register("required_skills")} placeholder="e.g. Java, SQL, Problem Solving" />
            </div>
            </section>
            )}

            {/* ── Step 3 — HR Contact & Notes ── */}
            {step === 2 && (
            <section className="space-y-4">
            <p className="text-xs text-muted-foreground">Recruiter contact details and notes for students — all optional.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Contact Name</Label>
                <Input {...register("hr_name")} placeholder="e.g. Priya Sharma" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input {...register("hr_email")} type="email" placeholder="hr@company.com" />
                {errors.hr_email && <p className="text-danger text-xs">{errors.hr_email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <Input {...register("hr_phone")} placeholder="9876543210" />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea {...register("description")} rows={3} placeholder="Drive description, instructions..." />
            </div>
            </section>
            )}
          </div>

          {/* Wizard footer */}
          <div className="flex items-center justify-between gap-3 p-4 border-t border-border flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
            >
              {step === 0 ? "Cancel" : (<><ChevronLeft className="w-4 h-4 mr-1" /> Back</>)}
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Step {step + 1} of {STEP_META.length}</span>
              {isLast ? (
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editing ? "Save Changes" : "Create Drive"}
                </Button>
              ) : (
                <Button type="button" onClick={goNext}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function PlacementDrivesPage() {
  const router = useRouter()
  const [drives, setDrives] = useState<Drive[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Drive | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => { fetchDrives() }, [])

  async function fetchDrives() {
    try {
      const res = await api.get("/admin/drives")
      setDrives(res.data.drives)
    } catch {
      toast.error("Failed to load drives")
    } finally {
      setLoading(false)
    }
  }

  function handleSaved(drive: Drive) {
    setDrives(prev => {
      const idx = prev.findIndex(d => d.id === drive.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = drive; return next }
      return [drive, ...prev]
    })
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this drive? All registrations will also be removed.")) return
    setDeleting(id)
    try {
      await api.delete(`/admin/drives/${id}`)
      setDrives(prev => prev.filter(d => d.id !== id))
      toast.success("Drive deleted")
    } catch {
      toast.error("Failed to delete")
    } finally {
      setDeleting(null)
    }
  }

  const upcoming = drives.filter(d => d.seconds_to_deadline > 0 && d.is_active).length
  const totalRegistered = drives.reduce((s, d) => s + (d.registered_count || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Placement Drives</h1>
          <p className="text-muted-foreground text-sm">Manage recruitment drives for your college</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> New Drive
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Drives", value: drives.length, icon: Building2 },
          { label: "Upcoming", value: upcoming, icon: Calendar },
          { label: "Total Registered", value: totalRegistered, icon: Users },
        ].map((s, i) => (
          <AdminStatCard key={s.label} index={i} icon={s.icon} label={s.label} value={s.value} delay={i * 0.06} />
        ))}
      </div>

      {/* Drives list */}
      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : drives.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No drives yet. Create your first drive.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {drives.map((drive, i) => {
              const deadlinePassed = drive.seconds_to_deadline <= 0
              return (
                <motion.div
                  key={drive.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate">{drive.company_name}</span>
                      <span className={industryChip[drive.industry_type] ?? "chip"}>{drive.industry_type}</span>
                      {!drive.is_active && <span className="chip chip-danger">Inactive</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                      <span>{drive.job_role}</span>
                      {drive.ctc && <span className="text-warning font-medium">₹{drive.ctc} LPA</span>}
                      {drive.job_location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{drive.job_location}</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Drive: {new Date(drive.drive_date).toLocaleDateString()}
                      </span>
                      <span className={deadlinePassed ? "text-danger" : "text-success"}>
                        Deadline: {deadlinePassed ? "Closed" : formatDeadline(drive.registration_deadline, drive.seconds_to_deadline)}
                      </span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{drive.registered_count} registered</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => router.push(`/admin/placements/${drive.id}`)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => { setEditing(drive); setModalOpen(true) }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => handleDelete(drive.id)}
                      disabled={deleting === drive.id}
                    >
                      {deleting === drive.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4 text-danger" />}
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </GlassCard>

      <DriveFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        editing={editing}
      />
    </div>
  )
}
