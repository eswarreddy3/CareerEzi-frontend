"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Star, ArrowRight, Code, Database, Globe, Terminal, Braces, Server, Loader2, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { AdminHero } from "@/components/admin-stat-card"
import type { LucideIcon } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  category: "programming" | "aptitude" | "domain"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: string
  icon_color: string
  total_lessons: number
  lessons_completed: number
  assessments_total: number
  assessments_done: number
  points_per_lesson: number
  prerequisite_id: string | null
  is_locked: boolean
  lock_reason: "plan" | "prerequisite" | null
}

const iconMap: Record<string, LucideIcon> = {
  Code,
  Database,
  Globe,
  Terminal,
  Braces,
  Server,
}

// Per-course cover themes — rich but desaturated gradients confined to the
// card's cover band; the body stays neutral so the grid reads professional.
const cardPalette = [
  { cover: "from-indigo-600 to-indigo-900",  fill: "bg-indigo-600",  btn: "bg-indigo-600 hover:bg-indigo-700" },
  { cover: "from-teal-600 to-cyan-900",      fill: "bg-teal-600",    btn: "bg-teal-600 hover:bg-teal-700" },
  { cover: "from-sky-700 to-slate-900",      fill: "bg-sky-700",     btn: "bg-sky-700 hover:bg-sky-800" },
  { cover: "from-violet-600 to-indigo-900",  fill: "bg-violet-600",  btn: "bg-violet-600 hover:bg-violet-700" },
  { cover: "from-emerald-600 to-teal-900",   fill: "bg-emerald-600", btn: "bg-emerald-600 hover:bg-emerald-700" },
  { cover: "from-amber-600 to-orange-800",   fill: "bg-amber-600",   btn: "bg-amber-600 hover:bg-amber-700" },
  { cover: "from-rose-600 to-rose-900",      fill: "bg-rose-600",    btn: "bg-rose-600 hover:bg-rose-700" },
]

// Subtle dot texture laid over each cover gradient
const coverPattern = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
}

const difficultyLabel: Record<string, string> = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
}

export default function LearnPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    api.get("/learn/courses")
      .then((res) => setCourses(res.data))
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = (activeTab === "all" ? courses : courses.filter(c => c.category === activeTab))
    .sort((a, b) => Number(a.is_locked) - Number(b.is_locked))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AdminHero icon={BookOpen} title="Course Library" subtitle="Master programming, and domain skills" />

      {/* <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 p-1">
          {["all", "programming", "aptitude"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((course, idx) => {
          const Icon = iconMap[course.icon] ?? Code
          // True completion = all lessons + all assignment levels attempted
          // (same rule the certificate uses), so 100% is never shown while an
          // assessment is still pending.
          const totalUnits = course.total_lessons + (course.assessments_total ?? 0)
          const doneUnits = course.lessons_completed + (course.assessments_done ?? 0)
          const progress = totalUnits > 0 ? Math.round((doneUnits / totalUnits) * 100) : 0
          const assessmentPending =
            course.lessons_completed === course.total_lessons &&
            course.total_lessons > 0 &&
            (course.assessments_done ?? 0) < (course.assessments_total ?? 0)
          const palette = cardPalette[idx % cardPalette.length]

          const status = assessmentPending
            ? { label: "Assessment pending", cls: "chip chip-warning" }
            : progress >= 100
              ? { label: "Completed", cls: "chip chip-success" }
              : progress > 0
                ? { label: "In progress", cls: "chip chip-primary" }
                : null

          return (
            <div
              key={course.id}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-foreground/15",
                course.is_locked && "opacity-80"
              )}
            >
              {/* Lock overlay */}
              {course.is_locked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/70 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {course.lock_reason === "plan" ? (
                    <p className="text-xs text-muted-foreground text-center px-5 font-medium">
                      Not available in your college plan
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center px-5 font-medium">
                      Complete{" "}
                      <span className="font-semibold text-foreground underline">
                        {courses.find(c => c.id === course.prerequisite_id)?.title ?? course.prerequisite_id}
                      </span>{" "}
                      first
                    </p>
                  )}
                </div>
              )}

              {/* Cover band */}
              <div className={cn("relative h-28 shrink-0 overflow-hidden bg-gradient-to-br", palette.cover)}>
                <div className="absolute inset-0" style={coverPattern} />
                <Icon
                  className="absolute -right-4 -bottom-6 h-28 w-28 text-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                  strokeWidth={1.5}
                />
                <div className="relative flex h-full items-start justify-between p-4">
                  <div className="w-11 h-11 rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-black/20 text-white ring-1 ring-white/20 backdrop-blur-sm">
                    {difficultyLabel[course.difficulty]}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="relative flex flex-1 flex-col p-5">
                {/* Title & description — heights reserved for 2 lines each so every
                    card's stats/progress/CTA block starts at the same offset */}
                <h3 className="font-semibold text-lg font-serif text-foreground mb-1 leading-tight line-clamp-2 min-h-[2.4em] break-words">
                  {course.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed min-h-[2.6em]">
                  {course.description}
                </p>

                {/* Stats row — mt-auto pins everything below to the card bottom */}
                <div className="mt-auto flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {course.lessons_completed}/{course.total_lessons} lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5">
                    <Star className="h-3 w-3 text-warning fill-warning" />
                    <span className="text-[11px] font-semibold text-warning">
                      {course.points_per_lesson * course.total_lessons} pts
                    </span>
                  </div>
                </div>

                {/* Progress bar — always visible */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5 min-h-[20px]">
                    {status ? (
                      <span className={cn(status.cls, "text-[10px] py-0")}>{status.label}</span>
                    ) : (
                      <span className="text-[11px] font-medium text-muted-foreground">Not started</span>
                    )}
                    <span className="text-[11px] font-semibold text-foreground tabular-nums">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", palette.fill)}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  disabled={course.is_locked}
                  onClick={() => {
                    if (course.is_locked) {
                      if (course.lock_reason === "plan") {
                        toast.error("Course Locked", { description: "This course is not available in your college plan." })
                      } else {
                        toast.error("Course Locked", {
                          description: `Complete ${courses.find(c => c.id === course.prerequisite_id)?.title ?? course.prerequisite_id} first.`,
                        })
                      }
                      return
                    }
                    router.push(`/learn/${course.id}`)
                  }}
                  className={cn(
                    "w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl",
                    "font-semibold text-xs text-white transition-colors duration-200 shadow-sm",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    palette.btn
                  )}
                >
                  {assessmentPending ? "Take Assessment" : progress > 0 ? "Continue Learning" : "Start Course"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Code className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
          <p className="text-sm text-muted-foreground">Try selecting a different category</p>
        </div>
      )}
    </div>
  )
}
