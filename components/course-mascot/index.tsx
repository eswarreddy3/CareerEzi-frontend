"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PythonMascot } from "./python"
import { SqlMascot }    from "./sql"
import { DsaMascot }    from "./dsa"
import { ExcelMascot }  from "./excel"
import { ChevronRight, Info } from "lucide-react"

type Stage = 0 | 1 | 2 | 3 | 4

const STAGE_LABELS: Record<Stage, string> = {
  0: "TRAPPED",
  1: "AWAKENING",
  2: "FREE",
  3: "EMPOWERED",
  4: "LEGENDARY",
}

const STAGE_ROMAN: Record<Stage, string> = {
  0: "I", 1: "II", 2: "III", 3: "IV", 4: "V",
}

const STAGE_COLORS: Record<Stage, string> = {
  0: "#6b7280",
  1: "#f97316",
  2: "#22c55e",
  3: "#60a5fa",
  4: "#fbbf24",
}

const STAGE_THRESHOLDS = [0, 25, 50, 75, 100] as const

const COURSE_EMOJI: Record<string, string> = {
  python:       "🐍",
  sql:          "🗄️",
  "sql-for-all": "🗄️",
  dsa:          "🤖",
  excel:        "📊",
}

function getStage(progress: number): Stage {
  if (progress >= 100) return 4
  if (progress >= 75)  return 3
  if (progress >= 50)  return 2
  if (progress >= 25)  return 1
  return 0
}

const MASCOTS: Record<string, React.ComponentType<{ stage: Stage }>> = {
  python:        PythonMascot,
  sql:           SqlMascot,
  "sql-for-all": SqlMascot,
  dsa:           DsaMascot,
  excel:         ExcelMascot,
}

const COURSE_NAMES: Record<string, string> = {
  python:        "PYTHON SNAKE",
  sql:           "SQL GOLEM",
  "sql-for-all": "SQL GOLEM",
  dsa:           "DSA ROBOT",
  excel:         "EXCEL WIZARD",
}

export function CourseMascot({
  courseId,
  progress,
  onCollapsedChange,
  themeColor,
}: {
  courseId: string
  progress: number
  onCollapsedChange?: (collapsed: boolean) => void
  themeColor?: string
}) {
  const Mascot = MASCOTS[courseId]
  if (!Mascot) return null

  const stage     = getStage(progress)
  const prevStage = useRef<Stage>(stage)

  const [evolved,   setEvolved]   = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [showHelp,  setShowHelp]  = useState(false)

  // themeColor follows the dice roller; fall back to stage color when no theme active
  const color   = themeColor ?? STAGE_COLORS[stage]
  const nextPct = STAGE_THRESHOLDS[stage + 1] ?? null
  const toNext  = nextPct !== null ? nextPct - progress : null

  // Evolution effect
  useEffect(() => {
    if (stage > prevStage.current) {
      setEvolved(true)
      setTimeout(() => setEvolved(false), 3000)
    }
    prevStage.current = stage
  }, [stage])

  // First-visit intro tooltip
  useEffect(() => {
    const key = `careerezi-mascot-seen-${courseId}`
    if (!localStorage.getItem(key)) {
      const t = setTimeout(() => setShowIntro(true), 900)
      return () => clearTimeout(t)
    }
  }, [courseId])

  function dismissIntro() {
    localStorage.setItem(`careerezi-mascot-seen-${courseId}`, "1")
    setShowIntro(false)
  }

  // Panel width used for popover positioning
  const panelW = collapsed ? 28 : 132

  return (
    <>
      {/* ── Evolution flash overlay ── */}
      <AnimatePresence>
        {evolved && (
          <motion.div
            key="evo-flash"
            className="fixed inset-0 pointer-events-none z-[70] flex items-center justify-end pr-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="rounded-3xl px-8 py-5 text-center"
              style={{
                background: `${color}22`,
                border: `2px solid ${color}88`,
                boxShadow: `0 0 60px ${color}66`,
              }}
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <p className="text-2xl font-black tracking-widest" style={{ color }}>✦ EVOLVED ✦</p>
              <p className="text-sm font-bold mt-1" style={{ color }}>{COURSE_NAMES[courseId]}</p>
              <p className="text-xs mt-0.5" style={{ color: `${color}bb` }}>{STAGE_LABELS[stage]}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── First-visit intro tooltip ── */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed z-50 w-60"
            style={{ right: panelW + 16, top: "28%" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ border: `2px solid ${color}`, borderRadius: 16 }}
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />

            <div
              className="relative rounded-2xl p-4"
              style={{
                background: "var(--card)",
                border: `1px solid ${color}55`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 0 24px ${color}22`,
              }}
            >
              {/* Arrow pointing right toward panel */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  right: -8, width: 0, height: 0,
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderLeft: `8px solid ${color}55`,
                }}
              />

              <div className="flex gap-3 items-start mb-3">
                <span className="text-2xl leading-none mt-0.5">
                  {COURSE_EMOJI[courseId] ?? "✨"}
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">Meet your companion!</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Complete lessons to evolve your{" "}
                    <span className="font-semibold" style={{ color }}>
                      {COURSE_NAMES[courseId].toLowerCase()}
                    </span>{" "}
                    through 5 stages — from trapped to legendary!
                  </p>
                </div>
              </div>

              <button
                onClick={dismissIntro}
                className="w-full py-1.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
                style={{
                  background: `${color}20`,
                  border: `1px solid ${color}44`,
                  color,
                }}
              >
                Got it! ✓
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Help popover (stage breakdown) ── */}
      <AnimatePresence>
        {showHelp && (
          <>
            <div className="fixed inset-0 z-[38]" onClick={() => setShowHelp(false)} />
            <motion.div
              key="help"
              className="fixed z-[39] w-52 rounded-2xl p-4"
              style={{
                right: panelW + 12,
                top: "30%",
                background: "var(--card)",
                border: `1px solid ${color}33`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${color}22`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Arrow pointing right */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  right: -7, width: 0, height: 0,
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  borderLeft: `7px solid ${color}33`,
                }}
              />

              <p className="text-[11px] font-bold text-foreground mb-3">Companion Stages</p>

              {([0, 1, 2, 3, 4] as Stage[]).map(s => (
                <div key={s} className="flex items-center gap-2 mb-2 last:mb-0">
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: STAGE_COLORS[s] }}
                    animate={s === stage ? { scale: [0.8, 1.2, 0.8] } : {}}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                  <div className="min-w-0 flex items-baseline gap-1">
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: s <= stage ? STAGE_COLORS[s] : undefined }}
                    >
                      {STAGE_LABELS[s]}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {STAGE_THRESHOLDS[s]}%{s < 4 ? `–${STAGE_THRESHOLDS[s + 1]}%` : "+"}
                    </span>
                    {s === stage && (
                      <span className="text-[8px] font-bold ml-0.5" style={{ color }}>← you</span>
                    )}
                  </div>
                </div>
              ))}

              <p className="text-[9px] text-muted-foreground/70 mt-3 leading-relaxed border-t border-border/50 pt-2">
                Complete lessons to level up and unlock new forms!
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Right side panel ── */}
      <motion.div
        className="fixed right-0 top-0 h-screen z-40 flex flex-col"
        animate={{ width: collapsed ? 28 : 132 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ overflow: "hidden" }}
      >
        {/* Panel background — solid card color, no bleed-through */}
        <div
          className="absolute inset-0 bg-card"
          style={{
            backgroundImage: `linear-gradient(180deg,
              ${color}22 0%,
              transparent 20%,
              transparent 80%,
              ${color}22 100%)`,
            borderLeft: `1.5px solid ${color}44`,
          }}
        />

        {/* Animated left-edge glow line */}
        <motion.div
          className="absolute left-0 top-0 w-[1.5px] h-full"
          style={{ background: `linear-gradient(180deg, transparent, ${color}, transparent)` }}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />

        {/* C: Collapsed-state progress fill — covers full strip when panel is narrow */}
        <AnimatePresence>
          {collapsed && (
            <motion.div
              key="collapsed-fill"
              className="absolute bottom-0 left-0 w-full pointer-events-none"
              style={{ background: `linear-gradient(to top, ${color}55, ${color}18)` }}
              initial={{ height: 0 }}
              animate={{ height: `${progress}%` }}
              exit={{ height: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* C: Progress % text in collapsed strip */}
        <AnimatePresence>
          {collapsed && (
            <motion.div
              key="collapsed-pct"
              className="absolute left-0 w-full flex justify-center z-10 pointer-events-none"
              style={{ bottom: `calc(${progress}% + 10px)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="text-[7px] font-black"
                style={{ color, writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {progress}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vertical progress fill bar — sits right after the 20px collapse button strip */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: 22, width: 6 }}
        >
          {/* track */}
          <div className="absolute inset-0 rounded-full bg-border/30" />
          {/* fill */}
          <motion.div
            className="absolute bottom-0 left-0 w-full rounded-full"
            style={{
              background: `linear-gradient(to top, ${color}, ${color}88)`,
              boxShadow: `0 0 10px ${color}aa`,
            }}
            initial={{ height: "0%" }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>

        {/* B: Stage threshold markers — horizontal ticks crossing the bar at 25/50/75/100% */}
        {([25, 50, 75, 100] as const).map((pct, idx) => (
          <div
            key={pct}
            className="absolute z-10 rounded-sm"
            style={{
              bottom: `${pct}%`,
              left: 18,
              width: 14,
              height: 2,
              background: progress >= pct
                ? STAGE_COLORS[(idx + 1) as Stage]
                : "rgba(128,128,128,0.25)",
              boxShadow: progress >= pct ? `0 0 6px ${STAGE_COLORS[(idx + 1) as Stage]}` : "none",
            }}
          />
        ))}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => { const next = !v; onCollapsedChange?.(next); return next })}
          className="absolute top-1/2 -translate-y-1/2 left-0 z-10 flex items-center justify-center"
          style={{
            width: 20, height: 40,
            background: `${color}22`,
            border: `1px solid ${color}44`,
            borderRight: "none",
            borderRadius: "6px 0 0 6px",
            cursor: "pointer",
          }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronRight className="w-3 h-3" style={{ color }} />
          </motion.div>
        </button>

        {/* Content — hidden when collapsed */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="panel-content"
              className="relative flex flex-col h-full pt-4 pb-3 px-2 items-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── TOP INFO BLOCK: always visible, never pushed out ── */}
              <div className="w-full flex-shrink-0 px-1 space-y-1.5 mb-3">

                {/* Stage badge + ? */}
                <div className="flex items-center justify-between">
                  <motion.div
                    className="flex items-center gap-1 rounded-full px-2 py-0.5"
                    style={{ background: `${color}20`, border: `1px solid ${color}55`, boxShadow: `0 0 8px ${color}33` }}
                    animate={evolved ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.span
                      className="text-[7px] font-black tracking-widest"
                      style={{ color }}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    >
                      STAGE {STAGE_ROMAN[stage]}
                    </motion.span>
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: color }}
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  </motion.div>
                  <button
                    onClick={() => setShowHelp(v => !v)}
                    className="relative w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80"
                    style={{ background: `${color}20`, border: `1px solid ${color}44` }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{ border: `1px solid ${color}` }}
                      animate={{ opacity: [0, 0.7, 0], scale: [0.9, 1.6, 1.6] }}
                      transition={{ repeat: Infinity, duration: 2, repeatDelay: 0.8 }}
                    />
                    <Info className="w-2.5 h-2.5 relative z-10" style={{ color: `${color}cc` }} />
                  </button>
                </div>

                {/* EXP row */}
                <div className="flex items-center gap-1">
                  <span className="text-[7px] font-bold text-muted-foreground">EXP</span>
                  <motion.span
                    className="text-[10px] font-black ml-auto"
                    style={{ color }}
                    animate={evolved ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {progress}%
                  </motion.span>
                  <span className="text-[6px] text-muted-foreground/60">
                    {toNext !== null ? `· ${toNext}% left` : "· MAX"}
                  </span>
                </div>

                {/* EXP fill bar */}
                <div className="w-full rounded-full overflow-hidden bg-border/40" style={{ height: 4 }}>
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ background: `linear-gradient(90deg, ${color}66, ${color})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 2 }}
                    />
                  </motion.div>
                </div>

                {/* Stage dots */}
                <div className="flex gap-0.5">
                  {([0, 1, 2, 3, 4] as Stage[]).map(s => (
                    <motion.div
                      key={s}
                      className={`flex-1 rounded-full ${s > stage ? "bg-border/40" : ""}`}
                      style={{
                        height: 3,
                        background: s <= stage ? STAGE_COLORS[s] : undefined,
                        boxShadow: s === stage ? `0 0 5px ${color}` : "none",
                      }}
                      animate={s === stage ? { opacity: [0.6, 1, 0.6] } : {}}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    />
                  ))}
                </div>

                {/* Stage roman labels */}
                <div className="flex justify-between">
                  {([0, 1, 2, 3, 4] as Stage[]).map(s => (
                    <span
                      key={s}
                      className={`text-[6px] font-bold text-center flex-1 ${s > stage ? "text-muted-foreground/40" : ""}`}
                      style={{ color: s <= stage ? STAGE_COLORS[s] : undefined }}
                    >
                      {STAGE_ROMAN[s]}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="w-full h-px" style={{ background: `${color}22` }} />
              </div>

              {/* ── CHARACTER: flex-1 fills all remaining space ── */}
              <div className="relative flex-1 min-h-0 flex items-center justify-center w-full">
                {/* glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse 80% 70% at 50% 50%, ${color}12 0%, transparent 70%)` }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />

                {/* particles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: i % 2 === 0 ? 3 : 2,
                      height: i % 2 === 0 ? 3 : 2,
                      background: color,
                      left: `${15 + i * 14}%`,
                      top: `${20 + (i * 15) % 55}%`,
                    }}
                    animate={{ y: [0, -7, 0, 7, 0], opacity: [0.2, 0.7, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.3, ease: "easeInOut" }}
                  />
                ))}

                {/* mascot SVG */}
                <motion.div
                  className="relative z-10"
                  style={{ width: 96, height: 96 }}
                  animate={{
                    y: [0, -5, 0],
                    filter: [`drop-shadow(0 0 3px ${color}28)`, `drop-shadow(0 0 7px ${color}44)`, `drop-shadow(0 0 3px ${color}28)`],
                  }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                >
                  <Mascot stage={stage} />
                </motion.div>

                {/* name + stage overlaid at bottom of character zone */}
                <div className="absolute bottom-2 left-0 right-0 text-center z-20">
                  <p className="text-[8px] font-black tracking-widest leading-tight" style={{ color }}>
                    {COURSE_NAMES[courseId]}
                  </p>
                  <motion.p
                    className="text-[7px] tracking-widest mt-0.5"
                    style={{ color: `${color}88` }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {STAGE_LABELS[stage]}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
