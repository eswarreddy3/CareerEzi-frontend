"use client"

/**
 * "Teach me this topic" — the cohort-cached guide.
 *
 * Generated ONCE for the whole platform, then read from MySQL. The first
 * student anywhere to open "Time & Work" pays for it; every student after that
 * gets it free. That inverts the usual AI cost curve: this feature gets
 * cheaper per student as you grow, not more expensive.
 */

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, BookOpen, Lightbulb, ListOrdered, Loader2, X } from "lucide-react"

import { SaarthiOrb } from "@/components/saarthi/orb"
import { Button } from "@/components/ui/button"
import { fetchTopicGuide, type TopicGuide } from "@/lib/ai"
import { cn } from "@/lib/utils"

export function TopicGuideSheet({
  topic, kind = "aptitude", open, onClose,
}: {
  topic: string | null
  kind?: string
  open: boolean
  onClose: () => void
}) {
  const [guide, setGuide] = useState<TopicGuide | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !topic) return
    let alive = true
    setLoading(true); setError(null); setGuide(null)
    fetchTopicGuide(topic, kind)
      .then((g) => { if (alive) setGuide(g) })
      .catch((e) => {
        if (alive) setError(e?.response?.data?.message ?? "Couldn't load this guide.")
      })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [open, topic, kind])

  // Escape to close, and lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border",
              "border-border bg-popover shadow-2xl sm:rounded-2xl",
            )}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-border p-4">
              <SaarthiOrb mood={loading ? "thinking" : "idle"} size={42} gaze={false} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Saarthi explains
                </p>
                <h2 className="truncate font-serif text-lg font-bold">{topic}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {loading && (
                <div className="grid place-items-center gap-3 py-12 text-sm text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Putting this together…
                </div>
              )}

              {error && !loading && (
                <div className="grid place-items-center gap-2 py-12 text-center text-sm">
                  <p className="text-muted-foreground">{error}</p>
                </div>
              )}

              {guide && !loading && (
                <div className="space-y-5">
                  <p className="text-sm leading-relaxed">{guide.summary}</p>

                  {guide.why_it_matters && (
                    <div className="rounded-xl border border-primary/25 bg-primary/5 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-primary">
                        Why it matters
                      </p>
                      <p className="mt-1 text-sm">{guide.why_it_matters}</p>
                    </div>
                  )}

                  <Section icon={ListOrdered} title="How to get good at this" tone="text-primary">
                    <ol className="space-y-2">
                      {guide.approach.map((step, i) => (
                        <li key={i} className="flex gap-2.5 text-sm">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 font-mono text-[11px] text-primary">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </Section>

                  <Section icon={AlertTriangle} title="Common mistakes" tone="text-warning">
                    <ul className="space-y-1.5">
                      {guide.common_mistakes.map((m, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section icon={Lightbulb} title="Quick tips" tone="text-success">
                    <ul className="space-y-1.5">
                      {guide.quick_tips.map((t, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Section({
  icon: Icon, title, tone, children,
}: { icon: typeof BookOpen; title: string; tone: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className={cn("mb-2 flex items-center gap-1.5 text-sm font-semibold", tone)}>
        <Icon className="h-4 w-4" />{title}
      </h3>
      {children}
    </div>
  )
}
