"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
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
  MapPin, Loader2, ChevronRight, Upload, ClipboardCheck,
  Download, AlertCircle, XCircle,
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
  is_active: boolean
  registered_count: number
  created_at: string
}

const schema = z.object({
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

function DriveFormModal({
  open, onClose, onSaved, editing,
}: {
  open: boolean; onClose: () => void; onSaved: (d: Drive) => void; editing: Drive | null
}) {
  const [saving, setSaving] = useState(false)
  const [selectedRounds, setSelectedRounds] = useState<string[]>([])
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [allBranches, setAllBranches] = useState(true)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { industry_type: "IT", is_active: true },
  })

  useEffect(() => {
    if (!open) return
    if (editing) {
      reset({
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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-popover border border-border rounded-2xl shadow-2xl my-auto flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold">{editing ? "Edit Drive" : "New Placement Drive"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="space-y-1">
              <Label>Venue / Link</Label>
              <Input {...register("venue_or_link")} placeholder="Online link or venue address" />
            </div>
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
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={3} placeholder="Drive description, instructions..." />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Save Changes" : "Create Drive"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const CSV_SAMPLE = `roll_number,tenth_percent,twelfth_percent,cgpa,active_backlogs,backlog_history,gap_years
21CS001,85.5,78.2,8.5,0,0,0
21CS002,72.0,68.5,7.2,1,2,0`

function downloadTemplate() {
  const blob = new Blob([CSV_SAMPLE], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "academic_profile_template.csv"
  a.click()
  URL.revokeObjectURL(url)
}

interface UploadResult { updated: number; skipped: string[]; skipped_count: number; errors: string[] }

function BulkUploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)

  useEffect(() => { if (!open) { setFile(null); setResult(null) } }, [open])

  async function handleUpload() {
    if (!file) { toast.error("Please select a CSV file"); return }
    const fd = new FormData()
    fd.append("file", file)
    setUploading(true)
    setResult(null)
    try {
      const res = await api.post("/admin/students/bulk-upload", fd)
      setResult(res.data)
      toast.success(`Updated ${res.data.updated} student profiles`)
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-popover border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
          <h2 className="font-semibold">Bulk Upload Academic Profiles</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Upload CSV by roll number to update student academic data</p>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="w-3 h-3 mr-1.5" /> Template
            </Button>
          </div>
          <pre className="bg-muted/40 rounded-xl p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{CSV_SAMPLE}</pre>
          <div
            className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            {file
              ? <p className="text-sm font-medium">{file.name} <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span></p>
              : <p className="text-sm text-muted-foreground">Click to select CSV file</p>
            }
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <Button className="w-full" onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Upload & Update
          </Button>
          {result && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-success/10 border border-success/20">
                  <p className="text-xl font-bold text-success">{result.updated}</p>
                  <p className="text-xs text-muted-foreground">Updated</p>
                </div>
                <div className="p-2 rounded-xl bg-warning/10 border border-warning/20">
                  <p className="text-xl font-bold text-warning">{result.skipped_count}</p>
                  <p className="text-xs text-muted-foreground">Skipped</p>
                </div>
                <div className="p-2 rounded-xl bg-danger/10 border border-danger/20">
                  <p className="text-xl font-bold text-danger">{result.errors.length}</p>
                  <p className="text-xs text-muted-foreground">Errors</p>
                </div>
              </div>
              {result.skipped.length > 0 && (
                <p className="text-xs text-warning flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Roll numbers not found: {result.skipped.join(", ")}
                </p>
              )}
              {result.errors.map((e, i) => (
                <p key={i} className="text-xs text-danger flex items-start gap-1">
                  <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />{e}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PlacementsAdminPage() {
  const router = useRouter()
  const [drives, setDrives] = useState<Drive[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Drive | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [bulkOpen, setBulkOpen] = useState(false)

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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setBulkOpen(true)}>
            <Upload className="w-4 h-4 mr-2" /> Bulk Upload
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/placements/corrections")}>
            <ClipboardCheck className="w-4 h-4 mr-2" /> Corrections
          </Button>
          <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true) }}>
            <Plus className="w-4 h-4 mr-2" /> New Drive
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Drives", value: drives.length, icon: Building2 },
          { label: "Upcoming", value: upcoming, icon: Calendar },
          { label: "Total Registered", value: totalRegistered, icon: Users },
        ].map(s => (
          <GlassCard key={s.label} className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </GlassCard>
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
      <BulkUploadModal open={bulkOpen} onClose={() => setBulkOpen(false)} />
    </div>
  )
}
