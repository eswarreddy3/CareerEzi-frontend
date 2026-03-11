"use client"

import { useState, useEffect, useCallback, type FormEvent } from "react"
import { Plus, Search, RefreshCw, Ban, CheckCircle2, Trash2, Loader2, Lock, LayoutGrid } from "lucide-react"
import { toast } from "sonner"
import { GlassCard } from "@/components/glass-card"
import { ModalForm } from "@/components/modal-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

interface College {
  id: number
  name: string
  location: string
  package: string | null
  package_id: number | null
  plan_type: string | null
  allowed_domain_ids: string[] | null
  allowed_course_ids: string[] | null
  student_count: number
  is_active: boolean
  activated_at: string | null
  created_at: string
}

interface Package {
  id: number
  name: string
  plan_type: string
  price: number
}

interface Domain {
  id: string
  title: string
  icon_color: string
}

interface CourseOption {
  id: string
  title: string
  category: string
  icon_color: string
}

type CollegeAction = { type: "deactivate" | "activate" | "delete"; college: College }

function getStatus(college: College): "active" | "pending" | "inactive" {
  if (college.is_active) return "active"
  if (!college.activated_at) return "pending"
  return "inactive"
}

const statusConfig = {
  active: { label: "Active", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  pending: { label: "Pending", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  inactive: { label: "Inactive", className: "bg-red-500/20 text-red-400 border-red-500/30" },
}

// Domain selector shows for any paid plan (base, pro, enterprise) — not free
function hasDomainControl(planType: string | null) {
  return planType === "base" || planType === "pro" || planType === "enterprise"
}

function DomainCheckboxList({
  domains,
  selected,
  onToggle,
}: {
  domains: Domain[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-primary" />
        <Label className="text-foreground">Available Domains</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        Check the domains this college can access. Unchecked domains will be locked for all students.
      </p>
      <div className="grid grid-cols-1 gap-2 mt-2 max-h-52 overflow-y-auto pr-1">
        {domains.map((domain) => (
          <label
            key={domain.id}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30 border border-border hover:border-primary/40 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={selected.includes(domain.id)}
              onCheckedChange={() => onToggle(domain.id)}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className={cn("text-sm font-medium", domain.icon_color)}>{domain.title}</span>
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-primary">{selected.length} of {domains.length} domains selected</p>
      )}
      {selected.length === 0 && (
        <p className="text-xs text-amber-400">No domains selected — all domains will be locked.</p>
      )}
    </div>
  )
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  // Create modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState("")
  const [selectedDomainIds, setSelectedDomainIds] = useState<string[]>([])

  // Edit domains + courses modal
  const [editDomainCollege, setEditDomainCollege] = useState<College | null>(null)
  const [editDomainIds, setEditDomainIds] = useState<string[]>([])
  const [editCourseIds, setEditCourseIds] = useState<string[]>([])
  const [isSavingDomains, setIsSavingDomains] = useState(false)

  // Confirm dialog
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [confirm, setConfirm] = useState<CollegeAction | null>(null)

  const fetchColleges = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (statusFilter !== "all") params.status = statusFilter
      const res = await api.get("/super-admin/colleges", { params })
      setColleges(res.data.colleges)
    } catch {
      toast.error("Failed to load colleges")
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => { fetchColleges() }, [fetchColleges])

  useEffect(() => {
    api.get("/super-admin/packages").then((r) => setPackages(r.data)).catch(() => {})
    api.get("/domain-programs/").then((r) => setDomains(r.data)).catch(() => {})
    api.get("/super-admin/courses").then((r) => setCourses(r.data)).catch(() => {})
  }, [])

  // ── Create college ──────────────────────────────────────────────────────────

  const selectedPackage = packages.find((p) => String(p.id) === selectedPackageId)
  const showDomainSelectorInCreate = hasDomainControl(selectedPackage?.plan_type ?? null)

  const toggleCreateDomain = (id: string) =>
    setSelectedDomainIds((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id])

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data: Record<string, unknown> = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (selectedPackageId) data.package_id = Number(selectedPackageId)
    if (showDomainSelectorInCreate) data.allowed_domain_ids = selectedDomainIds
    setIsSubmitting(true)
    try {
      const res = await api.post("/super-admin/colleges", data)
      if (res.data.email_warning) {
        toast.warning("College created", { description: res.data.email_warning })
      } else {
        toast.success("College created!", { description: "Activation email sent to admin" })
      }
      setIsModalOpen(false)
      setSelectedPackageId("")
      setSelectedDomainIds([])
      form.reset()
      fetchColleges()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create college")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Edit domains ────────────────────────────────────────────────────────────

  const openEditDomains = (college: College) => {
    setEditDomainCollege(college)
    setEditDomainIds(college.allowed_domain_ids ?? [])
    setEditCourseIds(college.allowed_course_ids ?? [])
  }

  const toggleEditDomain = (id: string) =>
    setEditDomainIds((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id])

  const toggleEditCourse = (id: string) =>
    setEditCourseIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])

  const handleSaveDomains = async () => {
    if (!editDomainCollege) return
    setIsSavingDomains(true)
    try {
      await api.patch(`/super-admin/colleges/${editDomainCollege.id}`, {
        allowed_domain_ids: editDomainIds,
        allowed_course_ids: editCourseIds,
      })
      toast.success("Access updated", {
        description: `${editDomainIds.length} domain(s) and ${editCourseIds.length} course(s) unlocked.`,
      })
      setEditDomainCollege(null)
      fetchColleges()
    } catch {
      toast.error("Failed to update access settings")
    } finally {
      setIsSavingDomains(false)
    }
  }

  // ── Resend / Activate / Deactivate / Delete ─────────────────────────────────

  const handleResend = async (college: College) => {
    setActionLoading(college.id)
    try {
      await api.post(`/super-admin/colleges/${college.id}/resend-activation`)
      toast.success(`Activation email resent to ${college.name}`)
    } catch {
      toast.error("Failed to resend activation email")
    } finally {
      setActionLoading(null)
    }
  }

  const handleConfirmedAction = async () => {
    if (!confirm) return
    const { type, college } = confirm
    setConfirm(null)
    setActionLoading(college.id)
    try {
      if (type === "deactivate") {
        await api.patch(`/super-admin/colleges/${college.id}`, { is_active: false })
        toast.success(`${college.name} deactivated`)
        setColleges((prev) => prev.map((c) => c.id === college.id ? { ...c, is_active: false } : c))
      } else if (type === "activate") {
        await api.patch(`/super-admin/colleges/${college.id}`, { is_active: true })
        toast.success(`${college.name} activated`)
        setColleges((prev) => prev.map((c) => c.id === college.id ? { ...c, is_active: true } : c))
      } else if (type === "delete") {
        await api.delete(`/super-admin/colleges/${college.id}`)
        toast.success(`${college.name} deleted`)
        setColleges((prev) => prev.filter((c) => c.id !== college.id))
      }
    } catch {
      toast.error(`Failed to ${type} college`)
    } finally {
      setActionLoading(null)
    }
  }

  const confirmConfig = confirm ? {
    deactivate: {
      title: "Deactivate College?",
      description: `All users in "${confirm.college.name}" will be blocked from logging in until reactivated.`,
      actionLabel: "Deactivate",
      actionClass: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    activate: {
      title: "Activate College?",
      description: `"${confirm.college.name}" and its users will regain access to the platform.`,
      actionLabel: "Activate",
      actionClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    delete: {
      title: "Delete College?",
      description: `This will permanently delete "${confirm.college.name}" and all ${confirm.college.student_count} student(s). This cannot be undone.`,
      actionLabel: "Delete",
      actionClass: "bg-red-600 hover:bg-red-700 text-white",
    },
  }[confirm.type] : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Colleges</h1>
          <p className="text-muted-foreground mt-1">Manage all registered colleges</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:brightness-110 text-primary-foreground self-start"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create College
        </Button>
      </div>

      {/* Filters */}
      <GlassCard className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border text-foreground"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary/50 border-border text-foreground">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </GlassCard>

      {/* Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["College Name", "Location", "Package", "Domains", "Students", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 bg-secondary/50 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : colleges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    No colleges found
                  </td>
                </tr>
              ) : (
                colleges.map((college) => {
                  const status = getStatus(college)
                  const statusStyle = statusConfig[status]
                  const isActioning = actionLoading === college.id
                  const isPending = !college.activated_at
                  const canEditDomains = hasDomainControl(college.plan_type)

                  return (
                    <tr key={college.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-foreground">{college.name}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{college.location || "—"}</td>
                      <td className="py-3 px-4">
                        {college.package ? (
                          <Badge variant="outline" className="text-xs text-primary border-primary/30">
                            {college.package}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {canEditDomains ? (
                          college.allowed_domain_ids && college.allowed_domain_ids.length > 0 ? (
                            <span className="text-xs text-emerald-400">
                              {college.allowed_domain_ids.length} / {domains.length} unlocked
                            </span>
                          ) : (
                            <span className="text-xs text-amber-400">All locked</span>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">All access</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{college.student_count.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={cn("text-xs", statusStyle.className)}>
                          {statusStyle.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {/* Edit domains — only for paid plans */}
                          {canEditDomains && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActioning}
                              className="h-7 px-2 text-muted-foreground hover:text-primary"
                              onClick={() => openEditDomains(college)}
                              title="Edit domain access"
                            >
                              <LayoutGrid className="h-3.5 w-3.5" />
                            </Button>
                          )}

                          {/* Resend activation */}
                          {isPending && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActioning}
                              className="h-7 px-2 text-muted-foreground hover:text-primary"
                              onClick={() => handleResend(college)}
                              title="Resend activation email"
                            >
                              {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                            </Button>
                          )}

                          {/* Activate */}
                          {!college.is_active && !isPending && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActioning}
                              className="h-7 px-2 text-muted-foreground hover:text-emerald-400"
                              onClick={() => setConfirm({ type: "activate", college })}
                              title="Activate college"
                            >
                              {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            </Button>
                          )}

                          {/* Deactivate */}
                          {college.is_active && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActioning}
                              className="h-7 px-2 text-muted-foreground hover:text-amber-400"
                              onClick={() => setConfirm({ type: "deactivate", college })}
                              title="Deactivate college"
                            >
                              {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
                            </Button>
                          )}

                          {/* Delete */}
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isActioning}
                            className="h-7 px-2 text-muted-foreground hover:text-red-400"
                            onClick={() => setConfirm({ type: "delete", college })}
                            title="Delete college"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirm} onOpenChange={(open) => { if (!open) setConfirm(null) }}>
        <AlertDialogContent className="bg-secondary border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">{confirmConfig?.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {confirmConfig?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-border text-foreground hover:bg-secondary/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className={confirmConfig?.actionClass} onClick={handleConfirmedAction}>
              {confirmConfig?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Access Modal */}
      <ModalForm
        title={`Manage Access — ${editDomainCollege?.name}`}
        description="Control which domains and courses students in this college can access."
        isOpen={!!editDomainCollege}
        onClose={() => setEditDomainCollege(null)}
        onSubmit={(e) => { e.preventDefault(); handleSaveDomains() }}
        isLoading={isSavingDomains}
        submitLabel="Save Access Settings"
      >
        <div className="space-y-6">
          <DomainCheckboxList
            domains={domains}
            selected={editDomainIds}
            onToggle={toggleEditDomain}
          />
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <Label className="text-foreground">Available Courses (Learn section)</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Select which courses appear unlocked in the Course Library. Unchecked courses will be locked.
            </p>
            <div className="grid grid-cols-1 gap-2 mt-2 max-h-52 overflow-y-auto pr-1">
              {courses.map((course) => (
                <label
                  key={course.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30 border border-border hover:border-primary/40 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={editCourseIds.includes(course.id)}
                    onCheckedChange={() => toggleEditCourse(course.id)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className={cn("text-sm font-medium", course.icon_color)}>{course.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{course.category}</span>
                </label>
              ))}
            </div>
            {editCourseIds.length > 0
              ? <p className="text-xs text-primary">{editCourseIds.length} of {courses.length} courses selected</p>
              : <p className="text-xs text-amber-400">No courses selected — all courses will be locked.</p>
            }
          </div>
        </div>
      </ModalForm>

      {/* Create College Modal */}
      <ModalForm
        title="Create College"
        description="An activation email will be sent to the admin to set their password."
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedPackageId(""); setSelectedDomainIds([]) }}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
        submitLabel="Create College"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-foreground">Admin Name</Label>
            <Input name="admin_name" placeholder="Dr. Rajesh Kumar" className="bg-secondary/50 border-border text-foreground" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground">Admin Email</Label>
            <Input name="admin_email" type="email" placeholder="admin@college.edu" className="bg-secondary/50 border-border text-foreground" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground">College Name</Label>
            <Input name="college_name" placeholder="Sri Venkateswara Engineering College" className="bg-secondary/50 border-border text-foreground" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground">Location</Label>
            <Input name="location" placeholder="Chennai, Tamil Nadu" className="bg-secondary/50 border-border text-foreground" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground">Package</Label>
            <Select value={selectedPackageId} onValueChange={(val) => { setSelectedPackageId(val); setSelectedDomainIds([]) }}>
              <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name} {p.price > 0 ? `— ₹${p.price.toLocaleString()}` : "— Free"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showDomainSelectorInCreate && domains.length > 0 && (
            <DomainCheckboxList
              domains={domains}
              selected={selectedDomainIds}
              onToggle={toggleCreateDomain}
            />
          )}
        </div>
      </ModalForm>
    </div>
  )
}
