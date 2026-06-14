"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { AdminStatCard, AdminHero } from "@/components/admin-stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Building2, Calendar, Users, ClipboardCheck,
  ChevronRight, MapPin, GraduationCap,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

interface Drive {
  id: number
  company_name: string
  job_role: string
  industry_type: string
  ctc: number | null
  job_location: string | null
  drive_date: string
  seconds_to_deadline: number
  is_active: boolean
  registered_count: number
}

interface Correction {
  id: number
  student_name: string | null
  roll_number: string | null
  branch: string | null
  requested_at: string | null
}

const industryChip: Record<string, string> = {
  IT: "chip chip-primary",
  Core: "chip chip-warning",
  Services: "chip chip-success",
  Consulting: "chip chip-coding",
  Manufacturing: "chip chip-streak",
  Other: "chip",
}

export default function PlacementOverviewPage() {
  const router = useRouter()
  const [drives, setDrives] = useState<Drive[]>([])
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [offCampusPending, setOffCampusPending] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get("/admin/drives"),
      api.get("/admin/profile-corrections?status=pending"),
      api.get("/admin/off-campus?status=pending"),
    ]).then(([drivesRes, corrRes, ocRes]) => {
      setDrives(drivesRes.data.drives || [])
      setCorrections(corrRes.data.requests || [])
      setPendingCount(corrRes.data.pending_count || 0)
      setOffCampusPending(ocRes.data.pending_count || 0)
    }).catch(() => {
      toast.error("Failed to load placement overview")
    }).finally(() => setLoading(false))
  }, [])

  const upcoming = drives
    .filter(d => d.seconds_to_deadline > 0 && d.is_active)
    .sort((a, b) => a.seconds_to_deadline - b.seconds_to_deadline)
  const totalRegistered = drives.reduce((s, d) => s + (d.registered_count || 0), 0)

  const stats = [
    { label: "Total Drives",     value: drives.length,     icon: Building2,      href: "/admin/placements/drives" },
    { label: "Upcoming",         value: upcoming.length,   icon: Calendar,       href: "/admin/placements/drives" },
    { label: "Total Registered", value: totalRegistered,   icon: Users,          href: "/admin/placements/drives" },
    { label: "Pending Requests", value: pendingCount,      icon: ClipboardCheck, href: "/admin/placements/corrections" },
    { label: "Off-Campus Pending", value: offCampusPending, icon: GraduationCap, href: "/admin/placements/off-campus" },
  ]

  return (
    <div className="space-y-6">
      <AdminHero
        icon={GraduationCap}
        title="Placement Cell"
        subtitle="Drives, academic records, corrections and job postings in one place"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <AdminStatCard
            key={s.label}
            index={i}
            icon={s.icon}
            label={s.label}
            value={loading ? "—" : s.value}
            href={s.href}
            delay={i * 0.06}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming drives */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upcoming Drives</h2>
            <Link href="/admin/placements/drives" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>
          ) : upcoming.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No upcoming drives. <Link href="/admin/placements/drives" className="text-primary hover:underline">Create one</Link>.
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.slice(0, 5).map(d => (
                <button
                  key={d.id}
                  onClick={() => router.push(`/admin/placements/${d.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{d.company_name}</span>
                      <span className={industryChip[d.industry_type] ?? "chip"}>{d.industry_type}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                      <span>{d.job_role}</span>
                      {d.ctc && <span className="text-warning font-medium">₹{d.ctc} LPA</span>}
                      {d.job_location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{d.job_location}</span>}
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{d.registered_count}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Pending corrections */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Pending Correction Requests</h2>
            <Link href="/admin/placements/corrections" className="text-xs text-primary hover:underline flex items-center gap-1">
              Review <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>
          ) : corrections.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No pending requests.
            </div>
          ) : (
            <div className="space-y-2">
              {corrections.slice(0, 5).map(c => (
                <Link
                  key={c.id}
                  href="/admin/placements/corrections"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{c.student_name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.roll_number || "—"}{c.branch ? ` · ${c.branch}` : ""}
                    </p>
                  </div>
                  <span className="chip chip-warning text-xs">Pending</span>
                </Link>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
