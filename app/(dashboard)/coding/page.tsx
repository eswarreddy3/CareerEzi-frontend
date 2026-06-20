"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Code2, ChevronRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { AdminHero, adminCardGradient, SurfaceTexture } from "@/components/admin-stat-card"
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
    <div className="space-y-6">

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
                className="relative overflow-hidden text-left rounded-2xl p-5 text-white ring-1 ring-inset ring-white/10 shadow-lg shadow-black/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] hover:shadow-xl group"
                style={{ background: adminCardGradient(idx) }}
              >
                <SurfaceTexture />
                <div className="relative">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 shrink-0 bg-white/20 ring-1 ring-inset ring-white/15">
                    {mod.icon || "💻"}
                  </div>

                  {/* Name + description */}
                  <h3 className="font-bold text-white text-base leading-snug mb-1">
                    {mod.name}
                  </h3>
                  {mod.description && (
                    <p className="text-xs text-white/70 leading-relaxed mb-4 line-clamp-2">
                      {mod.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">
                        {mod.solved_count} / {mod.total_problems} solved
                      </span>
                      <span className="font-semibold text-white">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <ChevronRight className="absolute top-5 right-5 h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}
