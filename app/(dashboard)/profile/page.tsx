"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Pencil, Loader2, Eye, EyeOff, Github, Linkedin, ExternalLink, MessageSquarePlus, Lock, Shield, GraduationCap, AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react"
import { AvatarPicker } from "@/components/avatar-picker"
import { toast } from "sonner"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/authStore"
import api from "@/lib/api"
import { AdminHero } from "@/components/admin-stat-card"
import { CodingProfilesConnect } from "@/components/coding-profiles-connect"
import { CodingProfileStats } from "@/components/coding-profile-stats"
import { PublicProfileSettings } from "@/components/public-profile-settings"
import { SHIELDS, getShieldProgress } from "@/lib/shields"
import { UserAvatar } from "@/components/user-avatar"
import { cn } from "@/lib/utils"

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

type PasswordForm = z.infer<typeof passwordSchema>

interface Activity {
  id: number
  action: string
  details: Record<string, any> | null
  created_at: string
}

function timeAgo(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMins = Math.floor((now.getTime() - d.getTime()) / 60000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

const personalSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number").optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  linkedin: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  github: z.string().url("Enter a valid URL").optional().or(z.literal("")),
})
type PersonalForm = z.infer<typeof personalSchema>

function PersonalInfoSection({ user, updateUser }: { user: any; updateUser: (u: Partial<any>) => void }) {
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PersonalForm>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      phone: user?.phone || "",
      dob: user?.dob || "",
      linkedin: user?.linkedin || "",
      github: user?.github || "",
    },
  })

  const handleAvatarSelect = async (url: string) => {
    try {
      await api.patch("/student/profile", { avatar: url })
      updateUser({ avatar: url } as any)
      toast.success("Avatar updated")
    } catch {
      toast.error("Failed to update avatar")
    }
  }

  const onSave = async (data: PersonalForm) => {
    try {
      await api.patch("/student/profile", {
        phone: data.phone,
        dob: data.dob || null,
        linkedin: data.linkedin,
        github: data.github,
      })
      updateUser({ phone: data.phone, dob: data.dob, linkedin: data.linkedin, github: data.github } as any)
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    }
  }

  const photoUrl = user?.avatar
  const initials = user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "??"

  return (
    <div>
      <h3 className="font-semibold font-serif text-foreground mb-4">Personal Info</h3>
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        {/* Avatar */}
        <div className="space-y-1.5">
          <Label className="text-foreground">Avatar</Label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setAvatarPickerOpen(true)}
              className="relative group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                {photoUrl
                  ? <img src={photoUrl} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-xl font-bold text-primary font-serif">{initials}</span>
                }
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Pencil className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            </button>
            <button type="button" onClick={() => setAvatarPickerOpen(true)} className="text-sm text-primary hover:underline">
              Change avatar
            </button>
          </div>
          <AvatarPicker
            open={avatarPickerOpen}
            onClose={() => setAvatarPickerOpen(false)}
            onSelect={handleAvatarSelect}
            current={photoUrl}
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label className="text-foreground">Mobile Number</Label>
          <Input placeholder="9876543210" className="bg-secondary/50 border-border text-foreground" {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        {/* DOB */}
        <div className="space-y-1.5">
          <Label className="text-foreground">Date of Birth</Label>
          <Input type="date" className="bg-secondary/50 border-border text-foreground" max={new Date().toISOString().split("T")[0]} {...register("dob")} />
          {errors.dob && <p className="text-xs text-destructive">{errors.dob.message}</p>}
        </div>

        {/* LinkedIn */}
        <div className="space-y-1.5">
          <Label className="text-foreground flex items-center gap-1.5">
            <Linkedin className="h-3.5 w-3.5 text-primary" /> LinkedIn URL
          </Label>
          <Input placeholder="https://linkedin.com/in/yourname" className="bg-secondary/50 border-border text-foreground" {...register("linkedin")} />
          {errors.linkedin && <p className="text-xs text-destructive">{errors.linkedin.message}</p>}
        </div>

        {/* GitHub */}
        <div className="space-y-1.5">
          <Label className="text-foreground flex items-center gap-1.5">
            <Github className="h-3.5 w-3.5" /> GitHub URL
          </Label>
          <Input placeholder="https://github.com/yourusername" className="bg-secondary/50 border-border text-foreground" {...register("github")} />
          {errors.github && <p className="text-xs text-destructive">{errors.github.message}</p>}
        </div>

        <Button type="submit" className="bg-primary hover:brightness-110 text-primary-foreground" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save
        </Button>
      </form>
    </div>
  )
}

function ShieldSection({ points }: { points: number }) {
  const { current, next, progressPct, pointsNeeded } = getShieldProgress(points)

  return (
    <div className="mt-6 pt-5 border-t border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold text-foreground">Shield Rank</h4>
      </div>

      {/* Current shield */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl border mb-4"
        style={
          current.tier > 0
            ? {
                background: `linear-gradient(135deg, ${current.gradientFrom}15, ${current.gradientTo}10)`,
                borderColor: `${current.gradientFrom}50`,
                boxShadow: `0 0 14px ${current.glowColor}`,
              }
            : {}
        }
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          style={
            current.tier > 0
              ? {
                  background: `linear-gradient(135deg, ${current.gradientFrom}, ${current.gradientTo})`,
                  boxShadow: `0 0 10px ${current.glowColor}`,
                }
              : { background: "hsl(var(--secondary))" }
          }
        >
          {current.tier > 0 ? current.emoji : "🛡️"}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-semibold text-sm", current.labelColor)}>
            {current.name} Shield
          </p>
          <p className="text-xs text-muted-foreground">
            {current.tier === 0
              ? `${200 - points} pts to Bronze`
              : next
              ? `${pointsNeeded.toLocaleString()} pts to ${next.name}`
              : "Max tier reached!"}
          </p>
        </div>
        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", current.badgeClass)}>
          {current.tier > 0 ? `Tier ${current.tier}` : "Unranked"}
        </span>
      </div>

      {/* Progress bar to next tier */}
      {next && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{current.name}</span>
            <span>{next.emoji} {next.name} — {next.minPoints.toLocaleString()} pts</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progressPct}%`,
                background:
                  next.tier > 0
                    ? `linear-gradient(90deg, ${next.gradientFrom}, ${next.gradientTo})`
                    : "hsl(var(--primary))",
              }}
            />
          </div>
          <p className="text-right text-xs text-muted-foreground mt-1">{progressPct}%</p>
        </div>
      )}

      {/* All tiers grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {SHIELDS.filter(s => s.tier > 0).map((s) => {
          const earned = points >= s.minPoints
          return (
            <div
              key={s.tier}
              title={`${s.name}: ${s.minPoints.toLocaleString()} pts`}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
                earned
                  ? "border-transparent"
                  : "border-border/40 opacity-35 grayscale"
              )}
              style={
                earned
                  ? {
                      background: `linear-gradient(135deg, ${s.gradientFrom}20, ${s.gradientTo}15)`,
                      borderColor: `${s.gradientFrom}40`,
                      boxShadow: `0 0 8px ${s.glowColor}`,
                    }
                  : {}
              }
            >
              <span className="text-lg leading-none">{s.emoji}</span>
              <span className="text-[10px] font-medium text-muted-foreground leading-none">{s.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface AcademicData {
  tenth_percent: number | null
  twelfth_percent: number | null
  cgpa: number | null
  active_backlogs: number
  backlog_history: number
  gap_years: number
  placement_status: string
  emergency_contact: string | null
  category: string | null
  skills: string | null
  updated_at: string | null
}

const ACADEMIC_FIELDS: { key: keyof AcademicData; label: string; step?: string }[] = [
  { key: "tenth_percent",   label: "10th %",          step: "0.01" },
  { key: "twelfth_percent", label: "12th %",          step: "0.01" },
  { key: "cgpa",            label: "CGPA",            step: "0.01" },
  { key: "active_backlogs", label: "Active Backlogs" },
  { key: "backlog_history", label: "Backlog History" },
  { key: "gap_years",       label: "Gap Years" },
]

const placementStatusChip: Record<string, string> = {
  not_placed: "chip",
  selected: "chip chip-warning",
  joined: "chip chip-success",
}

function AcademicSection() {
  const [loading, setLoading] = useState(true)
  const [academic, setAcademic] = useState<AcademicData | null>(null)
  const [hasPending, setHasPending] = useState(false)
  const [lastRequest, setLastRequest] = useState<any>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchData = () => {
    setLoading(true)
    api.get("/student/profile/academic")
      .then((res) => {
        setAcademic(res.data.academic)
        setHasPending(res.data.has_pending_request)
        setLastRequest(res.data.last_request)
      })
      .catch(() => toast.error("Failed to load academic details"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openForm = () => {
    setForm({
      tenth_percent: academic?.tenth_percent?.toString() ?? "",
      twelfth_percent: academic?.twelfth_percent?.toString() ?? "",
      cgpa: academic?.cgpa?.toString() ?? "",
      active_backlogs: academic?.active_backlogs?.toString() ?? "",
      backlog_history: academic?.backlog_history?.toString() ?? "",
      gap_years: academic?.gap_years?.toString() ?? "",
    })
    setReason("")
    setFormOpen(true)
  }

  const submit = async () => {
    if (!reason.trim()) { toast.error("Please give a reason for the correction"); return }
    setSubmitting(true)
    try {
      const payload: Record<string, any> = { reason: reason.trim() }
      ACADEMIC_FIELDS.forEach(({ key }) => {
        const v = form[key]
        if (v !== undefined && v !== "") payload[key] = v
      })
      await api.post("/student/profile/academic/request-edit", payload)
      toast.success("Correction request submitted")
      setFormOpen(false)
      fetchData()
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to submit request")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-secondary/40 rounded-lg animate-pulse" />)}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold font-serif text-foreground flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" /> Academic Details
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Used to check your eligibility for placement drives</p>
        </div>
        {academic?.placement_status && (
          <span className={placementStatusChip[academic.placement_status] ?? "chip"}>
            {academic.placement_status.replace("_", " ")}
          </span>
        )}
      </div>

      {!academic ? (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">No academic data yet</p>
            <p className="text-xs text-muted-foreground">Your placement cell hasn't uploaded your academic record. Contact your admin.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ACADEMIC_FIELDS.map(({ key, label }) => (
              <div key={key} className="p-3 rounded-xl bg-secondary/30 border border-border">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-bold text-foreground">{academic[key] ?? "—"}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-secondary/30 border border-border">
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{academic.category || "—"}</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/30 border border-border">
              <p className="text-xs text-muted-foreground">Emergency Contact</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{academic.emergency_contact || "—"}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-secondary/30 border border-border">
            <p className="text-xs text-muted-foreground">Skills</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{academic.skills || "—"}</p>
          </div>
        </div>
      )}

      {academic?.updated_at && (
        <p className="text-xs text-muted-foreground">Last updated {timeAgo(academic.updated_at)}</p>
      )}

      {/* Request correction */}
      <div className="pt-4 border-t border-border/50">
        {hasPending ? (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2">
            <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Correction request pending</p>
              <p className="text-xs text-muted-foreground">Your placement cell is reviewing your request. You can submit a new one once it's resolved.</p>
            </div>
          </div>
        ) : !formOpen ? (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Something incorrect?</p>
              <p className="text-xs text-muted-foreground">Request a correction and your admin will review it.</p>
            </div>
            <Button onClick={openForm} className="bg-primary hover:brightness-110 text-primary-foreground">
              Request Correction
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Request a Correction</h4>
            <p className="text-xs text-muted-foreground">Edit the values that are wrong, then tell us why. Your admin reviews every request before any change is applied.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ACADEMIC_FIELDS.map(({ key, label, step }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-foreground">{label}</Label>
                  <Input
                    type="number"
                    step={step}
                    value={form[key] ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="bg-secondary/50 border-border text-foreground"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <Label className="text-foreground">Reason *</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Explain what's wrong and mention any proof you can provide..."
                className="bg-secondary/50 border-border text-foreground"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={submit} disabled={submitting} className="bg-primary hover:brightness-110 text-primary-foreground">
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Submit Request
              </Button>
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Last resolved request */}
        {!hasPending && lastRequest && lastRequest.status !== "pending" && (
          <div className="mt-4 p-3 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-center gap-2">
              {lastRequest.status === "approved"
                ? <CheckCircle2 className="h-4 w-4 text-success" />
                : <XCircle className="h-4 w-4 text-danger" />}
              <p className="text-sm font-medium text-foreground capitalize">Last request {lastRequest.status}</p>
            </div>
            {lastRequest.admin_note && (
              <p className="text-xs text-muted-foreground mt-1">Note: {lastRequest.admin_note}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    api.get("/student/dashboard")
      .then((res) => setActivities(res.data.recent_activity ?? []))
      .catch(() => {})
  }, [])

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??"

  const photoUrl: string | undefined = (user as any)?.avatar

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  const onPasswordSave = async (data: PasswordForm) => {
    try {
      await api.patch("/student/profile", {
        current_password: data.current_password,
        new_password: data.new_password,
      })
      toast.success("Password updated successfully")
      reset()
    } catch (err: any) {
      toast.error("Failed to update password", {
        description: err?.response?.data?.message || "Please try again",
      })
    }
  }

  return (
    <div className="space-y-6">
      <AdminHero icon={GraduationCap} title="Profile & Settings" subtitle="Manage your account and preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: Profile Info ─────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <GlassCard>
            <div className="flex flex-col items-center text-center">
              {/* Avatar with shield border */}
              <div className="relative mb-4">
                <UserAvatar
                  name={user?.name || "?"}
                  photoUrl={photoUrl}
                  size="xl"
                  points={(user as any)?.points ?? 0}
                />
              </div>

              <h2 className="text-xl font-bold font-serif text-foreground">
                {user?.name || "—"}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email || "—"}</p>

              <Badge
                variant="outline"
                className="mt-2 bg-primary/10 border-primary/30 text-primary"
              >
                {user?.role === "student"
                  ? "Student"
                  : user?.role === "college_admin"
                  ? "College Admin"
                  : "Super Admin"}
              </Badge>
            </div>

            {/* Info rows */}
            <div className="mt-6 space-y-3">
              {/* Editable fields */}
              {[
                { label: "Phone", value: (user as any)?.phone || "—" },
                { label: "DOB", value: (user as any)?.dob || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
              {/* Admin-locked fields */}
              {[
                { label: "College", value: user?.college_name || "—" },
                { label: "Branch", value: (user as any)?.branch || "—" },
                { label: "Section", value: (user as any)?.section ? `Section ${(user as any).section}` : "—" },
                { label: "Roll No.", value: (user as any)?.roll_number || "—" },
                { label: "Pass-out Year", value: (user as any)?.passout_year || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <Lock className="h-3 w-3 text-muted-foreground/50" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            {((user as any)?.linkedin || (user as any)?.github) && (
              <div className="mt-4 space-y-2">
                {(user as any)?.linkedin && (
                  <a
                    href={(user as any).linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">LinkedIn</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-60" />
                  </a>
                )}
                {(user as any)?.github && (
                  <a
                    href={(user as any).github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <Github className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">GitHub</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-60" />
                  </a>
                )}
              </div>
            )}

            {/* Shield section */}
            <ShieldSection points={(user as any)?.points ?? 0} />
          </GlassCard>
        </div>

        {/* ── RIGHT: Tabs ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <Tabs defaultValue="account">
              <TabsList className="bg-secondary/50 mb-6">
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="academic"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Academic
                </TabsTrigger>
                <TabsTrigger
                  value="social"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Social Connections
                </TabsTrigger>
                {user?.role === "student" && (
                  <TabsTrigger
                    value="public"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Public Profile
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* Account tab — personal info + change password */}
              <TabsContent value="account">
                <div className="max-w-sm space-y-8">
                  <PersonalInfoSection user={user} updateUser={updateUser} />

                  <div>
                  <h3 className="font-semibold font-serif text-foreground mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handleSubmit(onPasswordSave)} className="space-y-4">
                    {/* Current password */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground">Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showCurrent ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-secondary/50 border-border text-foreground pr-10"
                          {...register("current_password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.current_password && (
                        <p className="text-xs text-destructive">{errors.current_password.message}</p>
                      )}
                    </div>

                    {/* New password */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground">New Password</Label>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          placeholder="Min 8 chars, 1 uppercase, 1 number"
                          className="bg-secondary/50 border-border text-foreground pr-10"
                          {...register("new_password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.new_password && (
                        <p className="text-xs text-destructive">{errors.new_password.message}</p>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Re-enter new password"
                          className="bg-secondary/50 border-border text-foreground pr-10"
                          {...register("confirm_password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirm_password && (
                        <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="bg-primary hover:brightness-110 text-primary-foreground"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Save Password
                    </Button>
                  </form>
                  </div>
                </div>
              </TabsContent>

              {/* Academic tab */}
              <TabsContent value="academic">
                <AcademicSection />
              </TabsContent>

              {/* Social Connections tab — coding profiles */}
              <TabsContent value="social">
                <div className="space-y-6">
                  <CodingProfilesConnect />
                  <CodingProfileStats />
                </div>
              </TabsContent>

              {/* Public Profile tab — username + visibility + share link */}
              {user?.role === "student" && (
                <TabsContent value="public">
                  <PublicProfileSettings />
                </TabsContent>
              )}

              {/* Activity tab */}
              <TabsContent value="activity">
                <div className="max-h-[400px] overflow-y-auto space-y-3">
                  {activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
                  ) : activities.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{a.action}</p>
                        {a.details?.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{a.details.description}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        {a.details?.points && (
                          <p className="text-xs font-medium text-primary">+{a.details.points} pts</p>
                        )}
                        <p className="text-xs text-muted-foreground">{timeAgo(a.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>
      </div>

      {/* Platform Feedback */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold font-serif text-foreground flex items-center gap-2">
              <MessageSquarePlus className="h-4 w-4 text-primary" />
              Platform Feedback
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Found a bug? Have a suggestion? We'd love to hear from you.
            </p>
          </div>
          <FeedbackModal triggerClassName="sm:w-auto" />
        </div>
      </GlassCard>
    </div>
  )
}
