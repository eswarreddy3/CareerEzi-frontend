"use client"

import { useState, type FormEvent } from "react"
import { Plus, Search, RefreshCw, Ban, Eye, X } from "lucide-react"
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
  id: string
  name: string
  location: string
  package: string
  students: number
  status: "active" | "pending" | "inactive"
  adminEmail: string
}

const mockColleges: College[] = [
  { id: "1", name: "VIT Vellore", location: "Tamil Nadu", package: "Pro", students: 3200, status: "active", adminEmail: "admin@vit.edu" },
  { id: "2", name: "SRM Institute", location: "Tamil Nadu", package: "Enterprise", students: 4500, status: "active", adminEmail: "admin@srmist.edu" },
  { id: "3", name: "BITS Pilani", location: "Rajasthan", package: "Pro", students: 2800, status: "active", adminEmail: "admin@bits.edu" },
  { id: "4", name: "Amrita College", location: "Tamil Nadu", package: "Basic", students: 1200, status: "pending", adminEmail: "admin@amrita.edu" },
  { id: "5", name: "SVCE Chennai", location: "Tamil Nadu", package: "Free", students: 0, status: "pending", adminEmail: "admin@svce.edu" },
  { id: "6", name: "Manipal Institute", location: "Karnataka", package: "Pro", students: 2100, status: "inactive", adminEmail: "admin@manipal.edu" },
]

const statusConfig = {
  active: { label: "Active", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  pending: { label: "Pending", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  inactive: { label: "Inactive", className: "bg-red-500/20 text-red-400 border-red-500/30" },
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState(mockColleges)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = colleges.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.adminEmail.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setIsSubmitting(true)
    try {
      await api.post("/super-admin/colleges", data)
      toast.success("College created!", { description: "72-hour activation email sent" })
      setIsModalOpen(false)
      form.reset()
    } catch {
      toast.error("Failed to create college")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendActivation = (college: College) => {
    toast.success(`Activation email resent to ${college.adminEmail}`)
  }

  const handleDeactivate = (college: College) => {
    setColleges((prev) =>
      prev.map((c) =>
        c.id === college.id ? { ...c, status: "inactive" as const } : c
      )
    )
    toast.success(`${college.name} deactivated`)
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
            placeholder="Search colleges or admin email..."
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
            <SelectItem value="pending">Pending</SelectItem>
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
                {["College Name", "Location", "Package", "Students", "Status", "Admin Email", "Actions"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((college) => {
                const status = statusConfig[college.status]
                return (
                  <tr key={college.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-foreground">{college.name}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{college.location}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs text-primary border-primary/30">
                        {college.package}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">{college.students.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={cn("text-xs", status.className)}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{college.adminEmail}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-foreground">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-muted-foreground hover:text-primary"
                          onClick={() => handleResendActivation(college)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                        {college.status === "active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-muted-foreground hover:text-red-400"
                            onClick={() => handleDeactivate(college)}
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    No colleges found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Create College Modal */}
      <ModalForm
        title="Create College"
        description="A 72-hour activation email will be sent to the admin."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
            <Input name="location" placeholder="Chennai, Tamil Nadu" className="bg-secondary/50 border-border text-foreground" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground">Package</Label>
            <Select name="package">
              <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                {["Free", "Basic", "Pro", "Enterprise"].map((p) => (
                  <SelectItem key={p} value={p.toLowerCase()}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModalForm>
    </div>
  )
}
