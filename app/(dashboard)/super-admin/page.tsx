"use client"

import { useState, useEffect, useCallback } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  Users,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

interface Stats {
  total_colleges: number
  total_students: number
  total_packages: number
  pending_verifications: number
}

interface PendingCollege {
  id: number
  name: string
  location: string
  created_at: string
}

export default function SuperAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [pending, setPending] = useState<PendingCollege[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get("/super-admin/overview"),
        api.get("/super-admin/colleges", { params: { status: "inactive", per_page: 10 } }),
      ])
      setStats(statsRes.data)
      setPending(pendingRes.data.colleges)
    } catch {
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleApprove = async (college: PendingCollege) => {
    setActionLoading(college.id)
    try {
      await api.post(`/super-admin/colleges/${college.id}/resend-activation`)
      toast.success(`Activation email sent to ${college.name}`)
      setPending((prev) => prev.filter((c) => c.id !== college.id))
      setStats((s) => s ? { ...s, pending_verifications: s.pending_verifications - 1 } : s)
    } catch {
      toast.error("Failed to send activation email")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (college: PendingCollege) => {
    setActionLoading(college.id)
    try {
      await api.patch(`/super-admin/colleges/${college.id}`, { is_active: false })
      toast.success(`${college.name} rejected`)
      setPending((prev) => prev.filter((c) => c.id !== college.id))
      setStats((s) => s ? { ...s, pending_verifications: s.pending_verifications - 1 } : s)
    } catch {
      toast.error("Failed to reject college")
    } finally {
      setActionLoading(null)
    }
  }

  const statCards = [
    { label: "Total Colleges", value: stats?.total_colleges ?? "—", icon: Building2, color: "text-blue-400", bg: "bg-blue-500/20" },
    { label: "Total Students", value: stats?.total_students?.toLocaleString() ?? "—", icon: Users, color: "text-primary", bg: "bg-primary/20" },
    { label: "Active Packages", value: stats?.total_packages ?? "—", icon: Package, color: "text-purple-400", bg: "bg-purple-500/20" },
    { label: "Pending Verifications", value: stats?.pending_verifications ?? "—", icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/20" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Super Admin Overview</h1>
        <p className="text-muted-foreground mt-1">Platform-wide management and monitoring</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <GlassCard key={label}>
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", bg)}>
                <Icon className={cn("h-6 w-6", color)} />
              </div>
              <div>
                {loading ? (
                  <div className="h-7 w-16 bg-secondary/50 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-2xl font-bold font-serif text-foreground">{value}</p>
                )}
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Pending verifications */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-400" />
          <h3 className="font-semibold font-serif text-foreground">Pending Verifications</h3>
          <Badge variant="outline" className="text-amber-400 border-amber-400/30 ml-auto">
            {pending.length} pending
          </Badge>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-secondary/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : pending.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CheckCircle className="h-10 w-10 text-emerald-400 mb-2" />
            <p className="text-sm text-muted-foreground">All caught up! No pending verifications.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["College Name", "Location", "Registered", "Actions"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((college) => {
                  const isActioning = actionLoading === college.id
                  return (
                    <tr key={college.id} className="border-b border-border/50 hover:bg-secondary/20">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {college.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                            {college.name}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-muted-foreground">{college.location || "—"}</td>
                      <td className="py-3 px-3 text-sm text-muted-foreground">
                        {new Date(college.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            disabled={isActioning}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 h-7 px-2"
                            onClick={() => handleApprove(college)}
                          >
                            {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5 mr-1" />}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            disabled={isActioning}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 h-7 px-2"
                            onClick={() => handleReject(college)}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
