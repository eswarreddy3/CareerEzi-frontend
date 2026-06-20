"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Code2, ChevronRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { AdminHero } from "@/components/admin-stat-card"
import { motion } from "framer-motion"

interface CodingModule {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  order: number
  total_problems: number
  solved_count: number
}

const MODULE_COLORS = [
  "from-violet-500/20 to-violet-600/10 border-violet-500/20 hover:border-violet-500/40",
  "from-blue-500/20 to-blue-600/10 border-blue-500/20 hover:border-blue-500/40",
  "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 hover:border-emerald-500/40",
  "from-amber-500/20 to-amber-600/10 border-amber-500/20 hover:border-amber-500/40",
  "from-rose-500/20 to-rose-600/10 border-rose-500/20 hover:border-rose-500/40",
  "from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 hover:border-cyan-500/40",
  "from-orange-500/20 to-orange-600/10 border-orange-500/20 hover:border-orange-500/40",
  "from-pink-500/20 to-pink-600/10 border-pink-500/20 hover:border-pink-500/40",
]

const MODULE_ICON_BG = [
  "bg-violet-500/15 text-violet-400",
  "bg-blue-500/15 text-blue-400",
  "bg-emerald-500/15 text-emerald-400",
  "bg-amber-500/15 text-amber-400",
  "bg-rose-500/15 text-rose-400",
  "bg-cyan-500/15 text-cyan-400",
  "bg-orange-500/15 text-orange-400",
  "bg-pink-500/15 text-pink-400",
]

const MODULE_BAR = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-pink-500",
]

export default function CodingPage() {
  const router = useRouter()
  const [modules, setModules] = useState<CodingModule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/coding/modules")
      .then(res => setModules(res.data))
      .catch(() => toast.error("Failed to load coding modules"))
      .finally(() => setLoading(false))
  }, [])

  const totalSolved = modules.reduce((s, m) => s + m.solved_count, 0)
  const totalProblems = modules.reduce((s, m) => s + m.total_problems, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <AdminHero
        icon={Code2}
        title="Coding Practice"
        subtitle="Choose a topic to start practising"
        right={!loading && totalProblems > 0 ? (
          <span className="flex items-center gap-2 text-sm font-semibold text-white bg-white/15 border border-white/25 px-3 py-1.5 rounded-xl">
            <Code2 className="h-4 w-4" />
            {totalSolved} / {totalProblems} Solved
          </span>
        ) : undefined}
      />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      ) : modules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <BookOpen className="h-12 w-12 text-muted-foreground/25" />
          <p className="text-sm text-muted-foreground">No coding modules available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod, idx) => {
            const colorIdx = idx % MODULE_COLORS.length
            const pct = mod.total_problems > 0
              ? Math.round((mod.solved_count / mod.total_problems) * 100)
              : 0

            return (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
                onClick={() => router.push(`/coding/${mod.slug}`)}
                className={cn(
                  "relative text-left rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.99] hover:shadow-lg group",
                  MODULE_COLORS[colorIdx]
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 shrink-0",
                  MODULE_ICON_BG[colorIdx]
                )}>
                  {mod.icon || "💻"}
                </div>

                {/* Name + description */}
                <h3 className="font-bold text-foreground text-base leading-snug mb-1">
                  {mod.name}
                </h3>
                {mod.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {mod.description}
                  </p>
                )}

                {/* Progress */}
                <div className="mt-auto space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {mod.solved_count} / {mod.total_problems} solved
                    </span>
                    <span className="font-semibold text-foreground">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", MODULE_BAR[colorIdx])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <ChevronRight className="absolute top-5 right-5 h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}
