"use client"

import { use, useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search, CheckCircle2, Star, Code2, ChevronRight,
  Loader2, ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { motion } from "framer-motion"

interface ModuleInfo {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  total_problems: number
  solved_count: number
}

interface ProblemListItem {
  id: number
  title: string
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  points: number
  is_solved?: boolean
}

const diffConfig = {
  Easy:   { chip: "chip chip-success", text: "text-success", bar: "bg-success", active: "bg-success/10 border-success/25" },
  Medium: { chip: "chip chip-warning", text: "text-warning", bar: "bg-warning", active: "bg-warning/10 border-warning/25" },
  Hard:   { chip: "chip chip-danger",  text: "text-danger",  bar: "bg-danger",  active: "bg-danger/10 border-danger/25"  },
}

type DiffFilter   = "All" | "Easy" | "Medium" | "Hard"
type StatusFilter = "All" | "Solved" | "Unsolved"

export default function ModuleProblemListPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleSlug } = use(params)
  const router = useRouter()

  const [moduleInfo, setModuleInfo] = useState<ModuleInfo | null>(null)
  const [problems, setProblems]     = useState<ProblemListItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("All")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")

  useEffect(() => {
    api.get(`/coding/modules/${moduleSlug}/problems`)
      .then(res => {
        setModuleInfo(res.data.module)
        setProblems(res.data.problems)
      })
      .catch(() => {
        toast.error("Module not found")
        router.push("/coding")
      })
      .finally(() => setLoading(false))
  }, [moduleSlug])

  const filtered = useMemo(() => problems.filter(p => {
    if (diffFilter !== "All" && p.difficulty !== diffFilter) return false
    if (statusFilter === "Solved"   && !p.is_solved)  return false
    if (statusFilter === "Unsolved" && p.is_solved)   return false
    if (search) {
      const q = search.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q))) return false
    }
    return true
  }), [problems, diffFilter, statusFilter, search])

  const stats = useMemo(() => {
    const byDiff = (d: string) => problems.filter(p => p.difficulty === d)
    const s = (arr: ProblemListItem[]) => ({ total: arr.length, solved: arr.filter(p => p.is_solved).length })
    return {
      total: problems.length,
      solved: problems.filter(p => p.is_solved).length,
      easy: s(byDiff("Easy")),
      medium: s(byDiff("Medium")),
      hard: s(byDiff("Hard")),
    }
  }, [problems])

  const hasSolvedData = problems.length > 0 && problems[0]?.is_solved !== undefined

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/coding")}
          className="h-8 px-2 text-muted-foreground hover:text-foreground gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Modules
        </Button>
        <div className="w-px h-4 bg-border" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {moduleInfo?.icon && (
              <span className="text-xl">{moduleInfo.icon}</span>
            )}
            <h1 className="text-xl font-bold text-foreground">
              {loading ? "Loading…" : moduleInfo?.name}
            </h1>
            {hasSolvedData && stats.solved > 0 && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-xl">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {stats.solved} / {stats.total} Solved
              </span>
            )}
          </div>
          {moduleInfo?.description && (
            <p className="text-sm text-muted-foreground mt-0.5">{moduleInfo.description}</p>
          )}
        </div>
      </div>

      {/* Difficulty stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {(["Easy", "Medium", "Hard"] as const).map(d => {
          const s = stats[d.toLowerCase() as "easy" | "medium" | "hard"]
          const cfg = diffConfig[d]
          const active = diffFilter === d
          return (
            <button
              key={d}
              onClick={() => setDiffFilter(active ? "All" : d)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]",
                active ? cfg.active : "bg-card/60 border-border hover:bg-secondary/30"
              )}
            >
              <p className={cn("text-xs font-medium mb-1.5", active ? cfg.text : "text-muted-foreground")}>{d}</p>
              <p className={cn("text-xl font-bold tabular-nums", active ? cfg.text : "text-foreground")}>
                {hasSolvedData ? `${s.solved}/${s.total}` : s.total}
              </p>
              {hasSolvedData && s.total > 0 && (
                <div className="mt-2.5 h-1 rounded-full bg-border overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-500", cfg.bar)}
                    style={{ width: `${(s.solved / s.total) * 100}%` }} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or tag…"
            className="pl-9 h-9 text-sm bg-secondary/40 border-border"
          />
        </div>
        <div className="flex items-center gap-0.5 bg-secondary/30 border border-border rounded-lg p-1">
          {(["All", "Easy", "Medium", "Hard"] as DiffFilter[]).map(d => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                diffFilter === d
                  ? d === "All" ? "bg-primary/15 text-primary"
                  : d === "Easy" ? "bg-success/15 text-success"
                  : d === "Medium" ? "bg-warning/15 text-warning"
                  : "bg-danger/15 text-danger"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5 bg-secondary/30 border border-border rounded-lg p-1">
          {(["All", "Solved", "Unsolved"] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                statusFilter === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {!loading && (
        <p className="text-xs text-muted-foreground -mt-2">
          {filtered.length === problems.length
            ? `${problems.length} problems`
            : `${filtered.length} of ${problems.length} problems`}
        </p>
      )}

      {/* Problem list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Code2 className="h-10 w-10 text-muted-foreground/25" />
          <p className="text-sm text-muted-foreground">No problems match your filters</p>
          <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setDiffFilter("All"); setStatusFilter("All") }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="hidden sm:grid grid-cols-[3rem_1fr_9rem_5.5rem_6rem] px-4 py-2.5 bg-secondary/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="text-center">#</span>
            <span>Title</span>
            <span className="text-center">Difficulty</span>
            <span className="text-right">Points</span>
            <span />
          </div>

          <div className="divide-y divide-border">
            {filtered.map((problem, idx) => {
              const num = problems.findIndex(p => p.id === problem.id) + 1
              return (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.012, 0.25), duration: 0.18 }}
                  className="flex sm:grid sm:grid-cols-[3rem_1fr_9rem_5.5rem_6rem] items-center gap-3 px-4 py-3.5 hover:bg-secondary/25 transition-colors"
                >
                  <div className="hidden sm:flex items-center justify-center w-8">
                    {problem.is_solved
                      ? <CheckCircle2 className="h-4 w-4 text-success" />
                      : <span className="text-xs text-muted-foreground/50 tabular-nums">{num}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="sm:hidden shrink-0">
                        {problem.is_solved
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          : <span className="text-xs text-muted-foreground/50">{num}.</span>
                        }
                      </div>
                      <button
                        onClick={() => router.push(`/coding/${moduleSlug}/${problem.slug}`)}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left truncate"
                      >
                        {problem.title}
                      </button>
                    </div>
                    {problem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {problem.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-xs text-muted-foreground bg-secondary/70 px-1.5 py-0.5 rounded-md">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center justify-center">
                    <span className={cn("chip text-xs", diffConfig[problem.difficulty].chip)}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center justify-end">
                    <span className="flex items-center gap-1 text-xs text-warning font-semibold">
                      <Star className="h-3 w-3 fill-warning" />
                      {problem.points}
                    </span>
                  </div>
                  <div className="flex items-center justify-end sm:justify-center ml-auto sm:ml-0">
                    <Button
                      size="sm"
                      variant={problem.is_solved ? "outline" : "default"}
                      onClick={() => router.push(`/coding/${moduleSlug}/${problem.slug}`)}
                      className={cn(
                        "h-7 px-3 text-xs gap-0.5",
                        problem.is_solved
                          ? "border-success/30 text-success hover:bg-success/10"
                          : "gradient-bg text-white hover:opacity-90 border-0"
                      )}
                    >
                      {problem.is_solved ? "Review" : "Solve"}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
