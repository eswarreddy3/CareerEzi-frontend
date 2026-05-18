"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import {
  Database, Download, Loader2, CheckCircle2, Table2,
  Users, BookOpen, Code2, Building2, FileText, Briefcase,
  MessageSquare, Trophy, BarChart3, ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

const TABLE_GROUPS = [
  {
    label: "People & Auth",
    color: "text-primary bg-primary/10 border-primary/20",
    icon: Users,
    tables: ["users", "students", "colleges", "packages", "refresh_tokens"],
  },
  {
    label: "Learning",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    icon: BookOpen,
    tables: ["courses", "levels", "lessons", "user_lesson_progress", "user_course_completions", "user_domain_completions"],
  },
  {
    label: "Practice",
    color: "text-coding bg-coding/10 border-coding/20",
    icon: Code2,
    tables: ["mcq_questions", "mcq_attempts", "aptitude_questions", "aptitude_attempts", "assignment_questions", "assignment_attempts", "coding_problems", "coding_submissions"],
  },
  {
    label: "Domain Programs",
    color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    icon: Table2,
    tables: ["domains", "domain_courses"],
  },
  {
    label: "Company Prep",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    icon: Building2,
    tables: ["companies", "company_hiring_rounds", "company_packages", "company_aptitude_questions", "company_coding_questions", "company_tips"],
  },
  {
    label: "Social & Jobs",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    icon: MessageSquare,
    tables: ["posts", "post_likes", "comments", "comment_likes", "job_postings", "feedback"],
  },
  {
    label: "Activity",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    icon: BarChart3,
    tables: ["activity_logs"],
  },
]

const TOTAL_TABLES = TABLE_GROUPS.reduce((s, g) => s + g.tables.length, 0)

export default function BackupPage() {
  const [loading, setLoading] = useState(false)
  const [lastDownloaded, setLastDownloaded] = useState<string | null>(null)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await api.get("/super-admin/backup", { responseType: "blob" })

      const dt = new Date()
      const pad = (n: number) => String(n).padStart(2, "0")
      const filename = `careerezi_backup_${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}_${pad(dt.getHours())}-${pad(dt.getMinutes())}-${pad(dt.getSeconds())}.zip`

      const url = URL.createObjectURL(new Blob([res.data], { type: "application/zip" }))
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setLastDownloaded(dt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }))
      toast.success("Backup downloaded successfully")
    } catch {
      toast.error("Failed to generate backup. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-serif text-foreground">Data Backup</h1>
        <p className="text-muted-foreground mt-1">
          Download a full export of all database tables as CSV files in a ZIP archive.
        </p>
      </motion.div>

      {/* Download card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex-shrink-0">
              <Database className="h-7 w-7 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-foreground">Full Database Export</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {TOTAL_TABLES} tables · CSV format · ZIP archive · timestamped filename
              </p>
              {lastDownloaded && (
                <div className="flex items-center gap-1.5 mt-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                  <span className="text-xs text-success">Last downloaded: {lastDownloaded}</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleDownload}
              disabled={loading}
              className="flex-shrink-0 gap-2"
            >
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                : <><Download className="h-4 w-4" /> Download Backup</>
              }
            </Button>
          </div>

          {/* Info strip */}
          <div className="mt-5 p-3 rounded-xl bg-secondary/50 border border-border/60 flex flex-wrap gap-x-5 gap-y-1.5">
            {[
              { icon: FileText,    text: "One CSV per table" },
              { icon: ShieldCheck, text: "Super admin only" },
              { icon: Trophy,      text: "Includes all historical data" },
              { icon: Briefcase,   text: "Dates exported as ISO 8601" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Table groups */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard>
          <h3 className="text-sm font-semibold text-foreground mb-4">Tables included in the backup</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {TABLE_GROUPS.map((group, i) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.04 }}
                className="p-3 rounded-xl border border-border/60 bg-secondary/30"
              >
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium mb-2.5 ${group.color}`}>
                  <group.icon className="h-3 w-3" />
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.tables.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-secondary/60 border border-border/60 text-xs text-muted-foreground font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
