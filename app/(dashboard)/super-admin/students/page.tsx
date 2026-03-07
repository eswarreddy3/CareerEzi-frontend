"use client"

import { useState, useRef, type FormEvent } from "react"
import { Plus, Upload, Eye } from "lucide-react"
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
import { cn } from "@/lib/utils"
import api from "@/lib/api"

interface Student {
  id: string
  name: string
  email: string
  college: string
  branch: string
  rollNo: string
  status: "active" | "inactive"
  lastActive: string
}

const mockStudents: Student[] = [
  { id: "1", name: "Priya Sharma", email: "priya@vit.edu", college: "VIT Vellore", branch: "CSE", rollNo: "21CS001", status: "active", lastActive: "2 hrs ago" },
  { id: "2", name: "Arjun Patel", email: "arjun@srm.edu", college: "SRM Institute", branch: "IT", rollNo: "21IT002", status: "active", lastActive: "1 hr ago" },
  { id: "3", name: "Sneha Reddy", email: "sneha@bits.edu", college: "BITS Pilani", branch: "ECE", rollNo: "21ECE003", status: "active", lastActive: "Today" },
  { id: "4", name: "Vikram Singh", email: "vikram@vit.edu", college: "VIT Vellore", branch: "CSE", rollNo: "21CS004", status: "inactive", lastActive: "6 days ago" },
  { id: "5", name: "Ananya Gupta", email: "ananya@srm.edu", college: "SRM Institute", branch: "MECH", rollNo: "21MECH005", status: "active", lastActive: "3 hrs ago" },
  { id: "6", name: "Karthik Nair", email: "karthik@bits.edu", college: "BITS Pilani", branch: "CSE", rollNo: "21CS006", status: "inactive", lastActive: "4 days ago" },
  { id: "7", name: "Divya Menon", email: "divya@vit.edu", college: "VIT Vellore", branch: "IT", rollNo: "21IT007", status: "active", lastActive: "Yesterday" },
]

const colleges = ["All Colleges", "VIT Vellore", "SRM Institute", "BITS Pilani"]

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
  { key: "college", header: "College" },
  { key: "branch", header: "Branch" },
  { key: "rollNo", header: "Roll No" },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge
        variant="outline"
        className={cn(
          "text-xs",
          row.status === "active"
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            : "bg-red-500/20 text-red-400 border-red-500/30"
        )}
      >
        {row.status === "active" ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  { key: "lastActive", header: "Last Active" },
]

export default function SuperAdminStudentsPage() {
  const [collegeFilter, setCollegeFilter] = useState("All Colleges")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const csvRef = useRef<HTMLInputElement>(null)

  const filtered =
    collegeFilter === "All Colleges"
      ? mockStudents
      : mockStudents.filter((s) => s.college === collegeFilter)

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setIsSubmitting(true)
    try {
      await api.post("/super-admin/students", data)
      toast.success("Student created! Activation email sent.")
      setIsCreateOpen(false)
      form.reset()
    } catch {
      toast.error("Failed to create student")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    try {
      await api.post("/super-admin/students/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("CSV uploaded successfully", { description: "Students are being created" })
    } catch {
      toast.error("Failed to upload CSV")
    }
    if (csvRef.current) csvRef.current.value = ""
  }

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
            accept=".csv"
            className="hidden"
            onChange={handleBulkUpload}
          />
          <Button
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => csvRef.current?.click()}
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

      {/* Filter */}
      <GlassCard className="p-4">
        <Select value={collegeFilter} onValueChange={setCollegeFilter}>
          <SelectTrigger className="w-64 bg-secondary/50 border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colleges.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </GlassCard>

      {/* Table */}
      <GlassCard>
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          searchPlaceholder="Search by name or email..."
          searchKeys={["name", "email", "rollNo"]}
          pageSize={8}
          emptyMessage="No students found"
          actions={(row) => (
            <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground hover:text-foreground">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          )}
        />
      </GlassCard>

      {/* Create Student Modal */}
      <ModalForm
        title="Create Student"
        description="Student will receive an activation email to set their password."
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
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
            <Select name="college_id">
              <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Select college" />
              </SelectTrigger>
              <SelectContent>
                {colleges.slice(1).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
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
              <Input name="roll_number" placeholder="21CS001" className="bg-secondary/50 border-border text-foreground" required />
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
    </div>
  )
}
