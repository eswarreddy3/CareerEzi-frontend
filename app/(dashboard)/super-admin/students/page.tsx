"use client"

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react"
import { Plus, Upload, UserCheck, UserX, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { GlassCard } from "@/components/glass-card"
import { ModalForm } from "@/components/modal-form"
import { DataTable, type Column } from "@/components/data-table"
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

interface Student {
  id: number
  name: string
  email: string
  college_name: string | null
  branch: string | null
  roll_number: string | null
  is_active: boolean
  streak: number
  points: number
}

interface College {
  id: number
  name: string
}

type StudentAction = { type: "activate" | "deactivate" | "delete"; student: Student }

export default function SuperAdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [collegeFilter, setCollegeFilter] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCollegeId, setSelectedCollegeId] = useState("")
  const [bulkCollegeId, setBulkCollegeId] = useState("")
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [isBulkUploading, setIsBulkUploading] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [confirm, setConfirm] = useState<StudentAction | null>(null)
  const csvRef = useRef<HTMLInputElement>(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { per_page: "100" }
      if (collegeFilter !== "all") params.college_id = collegeFilter
      const res = await api.get("/super-admin/students", { params })
      setStudents(res.data.students)
    } catch {
      toast.error("Failed to load students")
    } finally {
      setLoading(false)
    }
  }, [collegeFilter])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  useEffect(() => {
    api.get("/super-admin/colleges", { params: { per_page: 100 } })
      .then((r) => setColleges(r.data.colleges))
      .catch(() => {})
  }, [])

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data: Record<string, string | number> = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (selectedCollegeId) data.college_id = Number(selectedCollegeId)
    setIsSubmitting(true)
    try {
      await api.post("/super-admin/students", data)
      toast.success("Student created! Welcome email sent.")
      setIsCreateOpen(false)
      setSelectedCollegeId("")
      form.reset()
      fetchStudents()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create student")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!bulkCollegeId) {
      toast.error("Please select a college first")
      if (csvRef.current) csvRef.current.value = ""
      return
    }
    const formData = new FormData()
    formData.append("file", file)
    formData.append("college_id", bulkCollegeId)
    setIsBulkUploading(true)
    try {
      const res = await api.post("/super-admin/students/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success(`${res.data.created} students created`, {
        description: res.data.skipped?.length ? `${res.data.skipped.length} skipped (already exist)` : undefined,
      })
      setIsBulkModalOpen(false)
      setBulkCollegeId("")
      fetchStudents()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to upload CSV")
    } finally {
      setIsBulkUploading(false)
      if (csvRef.current) csvRef.current.value = ""
    }
  }

  const handleConfirmedAction = async () => {
    if (!confirm) return
    const { type, student } = confirm
    setConfirm(null)
    setActionLoading(student.id)
    try {
      if (type === "activate") {
        await api.patch(`/super-admin/students/${student.id}`, { is_active: true })
        toast.success(`${student.name} activated`)
        setStudents((prev) => prev.map((s) => s.id === student.id ? { ...s, is_active: true } : s))
      } else if (type === "deactivate") {
        await api.patch(`/super-admin/students/${student.id}`, { is_active: false })
        toast.success(`${student.name} deactivated`)
        setStudents((prev) => prev.map((s) => s.id === student.id ? { ...s, is_active: false } : s))
      } else if (type === "delete") {
        await api.delete(`/super-admin/students/${student.id}`)
        toast.success(`${student.name} deleted`)
        setStudents((prev) => prev.filter((s) => s.id !== student.id))
      }
    } catch {
      toast.error(`Failed to ${type} student`)
    } finally {
      setActionLoading(null)
    }
  }

  const confirmConfig = confirm ? {
    activate: {
      title: "Activate Student?",
      description: `"${confirm.student.name}" will regain access to the platform.`,
      actionLabel: "Activate",
      actionClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    deactivate: {
      title: "Deactivate Student?",
      description: `"${confirm.student.name}" will be blocked from logging in until reactivated.`,
      actionLabel: "Deactivate",
      actionClass: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    delete: {
      title: "Delete Student?",
      description: `This will permanently delete "${confirm.student.name}" (${confirm.student.email}) and all their data. This cannot be undone.`,
      actionLabel: "Delete",
      actionClass: "bg-red-600 hover:bg-red-700 text-white",
    },
  }[confirm.type] : null

  const columns: Column<Student>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "college_name",
      header: "College",
      render: (row) => <span className="text-sm text-muted-foreground">{row.college_name || "—"}</span>,
    },
    {
      key: "branch",
      header: "Branch",
      render: (row) => <span className="text-sm text-muted-foreground">{row.branch || "—"}</span>,
    },
    {
      key: "roll_number",
      header: "Roll No",
      render: (row) => <span className="text-sm text-muted-foreground">{row.roll_number || "—"}</span>,
    },
    {
      key: "points",
      header: "Points",
      render: (row) => <span className="text-sm text-foreground">{row.points.toLocaleString()}</span>,
    },
    {
      key: "is_active",
      header: "Status",
      render: (row) => (
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            row.is_active
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : "bg-red-500/20 text-red-400 border-red-500/30"
          )}
        >
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">Manage students across all colleges</p>
        </div>
        <div className="flex gap-2">
          <input
            ref={csvRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={handleBulkUpload}
          />
          <Button
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => setIsBulkModalOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload CSV
          </Button>
          <Button
            className="bg-primary hover:brightness-110 text-primary-foreground"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Student
          </Button>
        </div>
      </div>

      {/* College filter */}
      <GlassCard className="p-4">
        <Select value={collegeFilter} onValueChange={setCollegeFilter}>
          <SelectTrigger className="w-64 bg-secondary/50 border-border text-foreground">
            <SelectValue placeholder="All Colleges" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colleges</SelectItem>
            {colleges.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </GlassCard>

      {/* Table */}
      <GlassCard>
        <DataTable
          columns={columns}
          data={students}
          keyField="id"
          searchPlaceholder="Search by name or email..."
          searchKeys={["name", "email", "roll_number"]}
          pageSize={10}
          isLoading={loading}
          emptyMessage="No students found"
          actions={(row) => (
            <div className="flex items-center gap-1">
              {row.is_active ? (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={actionLoading === row.id}
                  className="h-7 px-2 text-muted-foreground hover:text-amber-400"
                  onClick={() => setConfirm({ type: "deactivate", student: row })}
                  title="Deactivate student"
                >
                  <UserX className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={actionLoading === row.id}
                  className="h-7 px-2 text-muted-foreground hover:text-emerald-400"
                  onClick={() => setConfirm({ type: "activate", student: row })}
                  title="Activate student"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                disabled={actionLoading === row.id}
                className="h-7 px-2 text-muted-foreground hover:text-red-400"
                onClick={() => setConfirm({ type: "delete", student: row })}
                title="Delete student"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        />
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
            <AlertDialogAction
              className={confirmConfig?.actionClass}
              onClick={handleConfirmedAction}
            >
              {confirmConfig?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Student Modal */}
      <ModalForm
        title="Create Student"
        description="Student will receive a welcome email with temporary credentials."
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); setSelectedCollegeId("") }}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
        submitLabel="Create Student"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Full Name</Label>
              <Input name="name" placeholder="Rahul Kumar" className="bg-secondary/50 border-border text-foreground" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Email</Label>
              <Input name="email" type="email" placeholder="student@college.edu" className="bg-secondary/50 border-border text-foreground" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground">College</Label>
            <Select value={selectedCollegeId} onValueChange={setSelectedCollegeId}>
              <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Select college" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Branch</Label>
              <Select name="branch">
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  {["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"].map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Section</Label>
              <Select name="section">
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((s) => (
                    <SelectItem key={s} value={s}>Section {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Roll Number</Label>
              <Input name="roll_number" placeholder="21CS001" className="bg-secondary/50 border-border text-foreground" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Pass-out Year</Label>
              <Select name="passout_year">
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {["2025", "2026", "2027", "2028"].map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </ModalForm>

      {/* Bulk Upload Modal */}
      <ModalForm
        title="Bulk Upload Students"
        description="Upload a CSV or XLSX file. Required columns: name, email, branch, section, roll_number, passout_year."
        isOpen={isBulkModalOpen}
        onClose={() => { setIsBulkModalOpen(false); setBulkCollegeId("") }}
        onSubmit={(e) => { e.preventDefault(); csvRef.current?.click() }}
        isLoading={isBulkUploading}
        submitLabel="Choose File & Upload"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-foreground">College</Label>
            <Select value={bulkCollegeId} onValueChange={setBulkCollegeId}>
              <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Select college for import" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>CSV / XLSX file will be selected after clicking "Choose File & Upload"</p>
          </div>
        </div>
      </ModalForm>
    </div>
  )
}
