"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
  Star,
  Timer,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

interface ApiAssignment {
  id: number
  level_id: number
  title: string
  course: string
  course_id: string
  icon: string
  duration_mins: number
  total_questions: number
  status: "pending" | "completed"
  max_score: number
  score: number
  is_locked?: boolean
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-secondary/80 text-muted-foreground border-white/10",
    icon: Clock,
    dot: "bg-muted-foreground",
  },
  completed: {
    label: "Completed",
    color: "chip chip-success",
    icon: CheckCircle,
    dot: "bg-success",
  },
}

function CourseSection({
  courseId,
  courseTitle,
  assignments,
  loading,
  onStart,
}: {
  courseId: string
  courseTitle: string
  assignments: ApiAssignment[]
  loading: boolean
  onStart: (id: number, status: string) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="space-y-3">
      <button className="flex items-center gap-2 w-full text-left" onClick={() => setExpanded((p) => !p)}>
        <h2 className="text-lg font-bold font-serif text-foreground">{courseTitle}</h2>
        <span className="text-xs text-muted-foreground ml-1">level assessments</span>
        <div className="ml-auto text-muted-foreground">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <GlassCard key={i} className="flex flex-col gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </GlassCard>
              ))
            : assignments.map((a) => {
                const config = statusConfig[a.status]
                const StatusIcon = config.icon
                return (
                  <GlassCard
                    key={a.id}
                    className={cn(
                      "relative overflow-hidden flex flex-col gap-3",
                      !a.is_locked && "group hover:border-white/20",
                      a.is_locked && "opacity-60"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">📋</span>
                      {a.is_locked ? (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border bg-secondary/80 text-muted-foreground border-white/10">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      ) : (
                        <span className={cn("flex items-center gap-1 text-xs px-2 py-1 rounded-full border", config.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{a.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Timer className="h-3 w-3" /> {a.duration_mins} min &nbsp;·&nbsp;
                        <FileText className="h-3 w-3" /> {a.total_questions} questions
                      </p>
                    </div>
                    {a.status === "completed" && !a.is_locked && (
                      <div className="text-xs text-success font-medium">
                        Score: {a.score} / {a.max_score} pts
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-warning fill-warning" />
                        <span className="text-sm font-semibold text-foreground">{a.max_score} pts</span>
                      </div>
                      {a.is_locked ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="h-3.5 w-3.5" />
                          Not in your plan
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                          onClick={() => onStart(a.id, a.status)}
                        >
                          {a.status === "completed" ? "Review" : "Start"} <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </GlassCard>
                )
              })}
        </div>
      )}
    </div>
  )
}

export default function AssignmentsPage() {
  const router = useRouter()
  const [allAssignments, setAllAssignments] = useState<ApiAssignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/assignments/list")
      .then((res) => setAllAssignments(res.data))
      .catch(() => toast.error("Failed to load assignments"))
      .finally(() => setLoading(false))
  }, [])

  // Group by course_id, preserving order
  const courseMap = new Map<string, { title: string; assignments: ApiAssignment[] }>()
  for (const a of allAssignments) {
    if (!courseMap.has(a.course_id)) {
      courseMap.set(a.course_id, { title: a.course, assignments: [] })
    }
    courseMap.get(a.course_id)!.assignments.push(a)
  }
  const courseSections = Array.from(courseMap.entries())

  const unlockedAssignments = allAssignments.filter((a) => !a.is_locked)
  const pendingCount = unlockedAssignments.filter((a) => a.status === "pending").length
  const completedCount = unlockedAssignments.filter((a) => a.status === "completed").length
  const totalPoints = unlockedAssignments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.score, 0)

  const handleStart = (id: number, status: string) => {
    router.push(status === "completed" ? `/assignments/${id}/results` : `/assignments/${id}`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-foreground">Assignments</h1>
        <p className="text-muted-foreground mt-2">
          Complete timed level assessments to earn points and prove your skills
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <GlassCard className="flex items-center gap-3 p-4">
          <div className="p-2 rounded-lg icon-box-warning">
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-foreground">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3 p-4">
          <div className="p-2 rounded-lg icon-box-success">
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-foreground">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3 p-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold font-serif text-foreground">{totalPoints}</p>
            <p className="text-xs text-muted-foreground">Points Earned</p>
          </div>
        </GlassCard>
      </div>

      {/* Course sections */}
      {loading ? (
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <GlassCard key={j} className="flex flex-col gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : courseSections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No assignments yet</h3>
          <p className="text-sm text-muted-foreground">Assignments will appear here once your admin uploads them</p>
        </div>
      ) : (
        <div className="space-y-10">
          {courseSections.map(([courseId, { title, assignments }]) => (
            <CourseSection
              key={courseId}
              courseId={courseId}
              courseTitle={title}
              assignments={assignments}
              loading={false}
              onStart={handleStart}
            />
          ))}
        </div>
      )}
    </div>
  )
}
