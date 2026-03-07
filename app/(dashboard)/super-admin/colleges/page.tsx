"use client"

import { useState, useEffect, useCallback, type FormEvent } from "react"
import { Plus, Search, RefreshCw, Ban, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { GlassCard } from "@/components/glass-card"
import { ModalForm } from "@/components/modal-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

interface College {
  id: number
  name: string
  location: string
  package: string | null
  package_id: number | null
  student_count: number
  is_active: boolean
  activated_at: string | null
  created_at: string
}

interface Package {
  id: number
  name: string
  price: number
}

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

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [selectedPackageId, setSelectedPackageId] = useState("")

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

  useEffect(() => {
    fetchColleges()
  }, [fetchColleges])

  useEffect(() => {
    api.get("/super-admin/packages").then((r) => setPackages(r.data)).catch(() => {})
  }, [])

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data: Record<string, string | number> = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (selectedPackageId) data.package_id = Number(selectedPackageId)
    setIsSubmitting(true)
    try {
      await api.post("/super-admin/colleges", data)
      toast.success("College created!", { description: "Activation email sent to admin" })
      setIsModalOpen(false)
      setSelectedPackageId("")
      form.reset()
      fetchColleges()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create college")
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const handleDeactivate = async (college: College) => {
    setActionLoading(college.id)
    try {
      await api.patch(`/super-admin/colleges/${college.id}`, { is_active: false })
      toast.success(`${college.name} deactivated`)
      setColleges((prev) => prev.map((c) => c.id === college.id ? { ...c, is_active: false } : c))
    } catch {
      toast.error("Failed to deactivate college")
    } finally {
      setActionLoading(null)
    }
  }

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
                {["College Name", "Location", "Package", "Students", "Status", "Actions"].map((h) => (
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
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 bg-secondary/50 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : colleges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No colleges found
                  </td>
                </tr>
              ) : (
                colleges.map((college) => {
                  const status = getStatus(college)
                  const statusStyle = statusConfig[status]
                  const isActioning = actionLoading === college.id
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
                      <td className="py-3 px-4 text-sm text-foreground">{college.student_count.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={cn("text-xs", statusStyle.className)}>
                          {statusStyle.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
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
                          {college.is_active && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActioning}
                              className="h-7 px-2 text-muted-foreground hover:text-red-400"
                              onClick={() => handleDeactivate(college)}
                              title="Deactivate college"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          )}
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

      {/* Create College Modal */}
      <ModalForm
        title="Create College"
        description="An activation email will be sent to the admin to set their password."
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedPackageId("") }}
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
            <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
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
        </div>
      </ModalForm>
    </div>
  )
}
