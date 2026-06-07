"use client"

import { useRef, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import {
  Upload, Download, AlertCircle, XCircle, Loader2, GraduationCap,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

const CSV_SAMPLE = `roll_number,tenth_percent,twelfth_percent,cgpa,active_backlogs,backlog_history,gap_years,emergency_contact,category,skills
21CS001,85.5,78.2,8.5,0,0,0,9876543210,General,"Java, SQL, React"
21CS002,72.0,68.5,7.2,1,2,0,9876501234,OBC,"Python, Data Analysis"`

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

export default function AcademicRecordsPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Academic Records</h1>
        <p className="text-muted-foreground text-sm">
          Upload student academic data (CGPA, backlogs, percentages) used for drive eligibility
        </p>
      </div>

      <GlassCard className="p-6 max-w-2xl space-y-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Bulk upload by roll number</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Matches each row to a student by roll number and updates their academic profile.
              Students can request corrections, which you review under Correction Requests.
            </p>
          </div>
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
      </GlassCard>
    </div>
  )
}
