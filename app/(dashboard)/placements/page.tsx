"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Building2, Calendar, MapPin, Users, Clock,
  CheckCircle, XCircle, ChevronRight, GraduationCap,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { motion } from "framer-motion"

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
  is_eligible: boolean
  registration_status: string | null
  registered_count: number
}

const industryChip: Record<string, string> = {
  IT: "chip chip-primary",
  Core: "chip chip-warning",
  Services: "chip chip-success",
  Consulting: "chip chip-coding",
  Manufacturing: "chip chip-streak",
  Other: "chip",
}

function Countdown({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) return
    const t = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  if (remaining <= 0) return <span className="text-danger text-xs font-medium">Registration Closed</span>

  const d = Math.floor(remaining / 86400)
  const h = Math.floor((remaining % 86400) / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60

  if (d > 1) return <span className="text-success text-xs font-medium">{d}d {h}h left to register</span>
  if (d === 1 || h > 0) return <span className="text-warning text-xs font-medium">{d > 0 ? `${d}d ` : ""}{h}h {m}m left</span>
  return (
    <span className="text-danger text-xs font-medium animate-pulse">
      {m}m {String(s).padStart(2, "0")}s left!
    </span>
  )
}

export default function PlacementsPage() {
  const router = useRouter()
  const [drives, setDrives] = useState<Drive[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      api.get("/student/drives"),
      api.get("/student/profile/academic"),
    ]).then(([drivesRes, profileRes]) => {
      setDrives(drivesRes.data.drives)
      setProfile(profileRes.data)
    }).catch(() => {
      toast.error("Failed to load placements")
    }).finally(() => setLoading(false))
  }, [])

  const eligible = drives.filter(d => d.is_eligible)
  const registered = drives.filter(d => d.registration_status)
  const open = drives.filter(d => d.seconds_to_deadline > 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Placement Drives</h1>
        <p className="text-muted-foreground text-sm mt-1">Recruitment drives announced for your college</p>
      </div>

      {/* Academic profile summary */}
      {!loading && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Your Academic Profile</p>
                {profile?.academic ? (
                  <div className="flex gap-4 text-xs text-muted-foreground mt-0.5">
                    <span>CGPA: <strong className="text-foreground">{profile.academic.cgpa ?? "—"}</strong></span>
                    <span>Backlogs: <strong className="text-foreground">{profile.academic.active_backlogs ?? 0}</strong></span>
                    <span>Status: <strong className="text-foreground capitalize">{profile.academic.placement_status?.replace("_", " ")}</strong></span>
                  </div>
                ) : (
                  <p className="text-xs text-warning mt-0.5">Academic data not uploaded yet — contact your admin</p>
                )}
              </div>
            </div>
            {profile?.has_pending_request && (
              <span className="chip chip-warning text-xs">Correction request pending</span>
            )}
          </div>
        </GlassCard>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Drives", value: drives.length },
            { label: "Eligible", value: eligible.length },
            { label: "Registered", value: registered.length },
          ].map(s => (
            <GlassCard key={s.label} className="p-4 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Drives */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      ) : drives.length === 0 ? (
        <GlassCard className="p-12 text-center text-muted-foreground">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No placement drives announced yet.</p>
          <p className="text-xs mt-1">Check back later or contact your placement officer.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {drives.map((drive, i) => (
            <motion.div
              key={drive.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard
                className="p-5 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/placements/${drive.id}`)}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-lg">{drive.company_name}</h2>
                      <span className={industryChip[drive.industry_type] ?? "chip"}>{drive.industry_type}</span>
                      {drive.is_eligible
                        ? <span className="chip chip-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Eligible</span>
                        : <span className="chip chip-danger flex items-center gap-1"><XCircle className="w-3 h-3" /> Not Eligible</span>
                      }
                      {drive.registration_status && (
                        <span className={
                          drive.registration_status === "selected" ? "chip chip-success" :
                          drive.registration_status === "shortlisted" ? "chip chip-warning" :
                          drive.registration_status === "rejected" ? "chip chip-danger" : "chip chip-primary"
                        }>
                          {drive.registration_status}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mt-0.5">{drive.job_role}</p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      {drive.ctc && <span className="text-warning font-medium">₹{drive.ctc} LPA</span>}
                      {drive.job_location && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />{drive.job_location}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />Drive: {new Date(drive.drive_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3 h-3" />{drive.registered_count} registered
                      </span>
                    </div>

                    {drive.rounds?.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {drive.rounds.map((r, ri) => (
                          <span key={r} className="text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">
                            {ri + 1}. {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Countdown seconds={drive.seconds_to_deadline} />
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
