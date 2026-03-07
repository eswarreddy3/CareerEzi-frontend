"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { ActivityFeed } from "@/components/activity-feed"
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
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const pendingColleges = [
  {
    id: "1",
    name: "Sri Venkateswara Engineering College",
    admin: "Dr. Rajesh Kumar",
    adminEmail: "rajesh@svec.edu",
    submitted: "2 days ago",
  },
  {
    id: "2",
    name: "KL University",
    admin: "Prof. Anand Sharma",
    adminEmail: "anand@klu.edu",
    submitted: "1 day ago",
  },
  {
    id: "3",
    name: "Amrita College of Engineering",
    admin: "Dr. Priya Nair",
    adminEmail: "priya@amrita.edu",
    submitted: "5 hours ago",
  },
]

const recentActivity = [
  { id: "1", type: "achievement" as const, title: "REC Tiruchirapalli activated", description: "500 students onboarded", timestamp: "1 hour ago" },
  { id: "2", type: "lesson" as const, title: "New package created", description: "Enterprise plan — ₹2L/yr", timestamp: "3 hours ago" },
  { id: "3", type: "mcq" as const, title: "VIT Vellore verified", description: "College admin approved", timestamp: "Yesterday" },
  { id: "4", type: "coding" as const, title: "Bulk student upload", description: "250 students — BITS Pilani", timestamp: "2 days ago" },
]

export default function SuperAdminPage() {
  const [pending, setPending] = useState(pendingColleges)

  const handleApprove = (id: string, name: string) => {
    setPending((prev) => prev.filter((c) => c.id !== id))
    toast.success(`${name} approved`, { description: "Activation email sent to admin" })
  }

  const handleReject = (id: string, name: string) => {
    setPending((prev) => prev.filter((c) => c.id !== id))
    toast.error(`${name} rejected`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Super Admin Overview</h1>
        <p className="text-muted-foreground mt-1">Platform-wide management and monitoring</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Colleges", value: "48", icon: Building2, color: "text-blue-400", bg: "bg-blue-500/20" },
          { label: "Total Students", value: "24,500", icon: Users, color: "text-primary", bg: "bg-primary/20" },
          { label: "Active Packages", value: "4", icon: Package, color: "text-purple-400", bg: "bg-purple-500/20" },
          { label: "Pending Verifications", value: String(pending.length), icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/20" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <GlassCard key={label}>
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", bg)}>
                <Icon className={cn("h-6 w-6", color)} />
              </div>
              <div>
                <p className="text-2xl font-bold font-serif text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending verifications table */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <h3 className="font-semibold font-serif text-foreground">Pending Verifications</h3>
            <Badge variant="outline" className="text-amber-400 border-amber-400/30 ml-auto">
              {pending.length} pending
            </Badge>
          </div>

          {pending.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle className="h-10 w-10 text-emerald-400 mb-2" />
              <p className="text-sm text-muted-foreground">All caught up! No pending verifications.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["College Name", "Admin", "Submitted", "Actions"].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pending.map((college) => (
                    <tr key={college.id} className="border-b border-border/50 hover:bg-secondary/20">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {college.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                              {college.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{college.adminEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-muted-foreground">{college.admin}</td>
                      <td className="py-3 px-3 text-sm text-muted-foreground">{college.submitted}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 h-7 px-2"
                            onClick={() => handleApprove(college.id, college.name)}
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 h-7 px-2"
                            onClick={() => handleReject(college.id, college.name)}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>

        {/* Activity feed */}
        <ActivityFeed activities={recentActivity} />
      </div>
    </div>
  )
}
