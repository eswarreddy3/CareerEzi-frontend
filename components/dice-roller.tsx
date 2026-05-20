"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { COURSE_THEMES, getUnlockedIndices, type ThemeVariant } from "@/lib/course-themes"

interface DiceRollerProps {
  courseId: string
  currentIndex: number
  userPoints: number
  onRoll: (newIndex: number, variant: ThemeVariant) => void
  rightOffset?: number
}

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

function getSeenThemes(courseId: string): Set<string> {
  try {
    const raw = localStorage.getItem(`careerezi-seen-themes-${courseId}`)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}

function markThemeSeen(courseId: string, themeId: string) {
  try {
    const seen = getSeenThemes(courseId)
    seen.add(themeId)
    localStorage.setItem(`careerezi-seen-themes-${courseId}`, JSON.stringify([...seen]))
  } catch {}
}

export function DiceRoller({ courseId, currentIndex, userPoints, onRoll, rightOffset = 24 }: DiceRollerProps) {
  const [isRolling, setIsRolling] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const config = COURSE_THEMES[courseId]
  if (!config) return null

  const variants = config.variants
  const unlockedIndices = getUnlockedIndices(courseId, userPoints)
  const currentVariant = variants[currentIndex]
  const unlockedCount = unlockedIndices.length
  const totalCount = variants.length
  const nextLocked = variants.find(v => userPoints < v.requiredPoints)
  const primary = currentVariant?.primary ?? '#888'

  function roll() {
    if (isRolling) return
    setIsRolling(true)
    setShowPreview(false)

    setTimeout(() => {
      const others = unlockedIndices.filter(i => i !== currentIndex)
      const pool = others.length > 0 ? others : unlockedIndices
      const newIndex = pool[Math.floor(Math.random() * pool.length)]
      const newVariant = variants[newIndex]

      const isFirstTime = !getSeenThemes(courseId).has(newVariant.id)
      markThemeSeen(courseId, newVariant.id)

      onRoll(newIndex, newVariant)
      setIsRolling(false)

      if (isFirstTime) {
        toast.success(`✨ New theme discovered: ${newVariant.name}!`, {
          description: newVariant.tagline,
          duration: 3000,
        })
      } else {
        toast(`${newVariant.emoji} ${newVariant.name}`, {
          description: newVariant.tagline,
          duration: 2000,
        })
      }
    }, 700)
  }

  return (
    <div
      className="fixed top-4 z-40 flex items-center gap-2"
      style={{
        right: rightOffset,
        transition: 'right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {/* Button + popup wrapper */}
      <div
        className="relative"
        onMouseEnter={() => !isRolling && setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        {/* Pulsing glow ring — draws attention */}
        <motion.div
          className="absolute pointer-events-none rounded-xl"
          style={{
            inset: -4,
            boxShadow: `0 0 0 2px ${primary}88, 0 0 20px ${primary}66`,
          }}
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />

        {/* Dice button */}
        <motion.button
          onClick={roll}
          animate={isRolling ? {
            rotateX: [0, -40, 80, -50, 20, 0],
            rotateY: [0, 120, 240, 360, 480, 540],
            scale:   [1, 1.25, 0.85, 1.15, 0.95, 1],
          } : { rotateX: 0, rotateY: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={!isRolling ? { scale: 1.1 } : {}}
          whileTap={!isRolling ? { scale: 0.88 } : {}}
          disabled={isRolling}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-xl select-none border-0 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${primary}dd, ${primary}99)`,
            boxShadow: `0 0 16px ${primary}66, 0 2px 8px rgba(0,0,0,0.3)`,
            color: '#fff',
          }}
          title={`Roll for a new world (${unlockedCount}/${totalCount} unlocked)`}
        >
          {isRolling ? '🎲' : DICE_FACES[currentIndex % DICE_FACES.length]}
        </motion.button>

        {/* Theme preview popup — drops down from button */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 z-[60] rounded-2xl border shadow-2xl overflow-hidden min-w-[180px]"
              style={{
                background: currentVariant?.cssVars['--card'] ?? 'var(--card)',
                borderColor: currentVariant?.cssVars['--border'] ?? 'rgba(255,255,255,0.1)',
              }}
            >
              {variants.map((v, i) => {
                const isUnlocked = unlockedIndices.includes(i)
                const isCurrent = i === currentIndex
                return (
                  <button
                    key={v.id}
                    disabled={!isUnlocked || isCurrent}
                    onClick={() => {
                      if (!isUnlocked || isCurrent) return
                      setShowPreview(false)
                      const isFirstTime = !getSeenThemes(courseId).has(v.id)
                      markThemeSeen(courseId, v.id)
                      onRoll(i, v)
                      if (isFirstTime) {
                        toast.success(`✨ New theme: ${v.name}!`, { description: v.tagline })
                      } else {
                        toast(`${v.emoji} ${v.name}`, { description: v.tagline })
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                      isUnlocked && !isCurrent && "hover:bg-white/5 cursor-pointer",
                      isCurrent && "cursor-default",
                      !isUnlocked && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <span className="text-base">{isUnlocked ? v.emoji : '🔒'}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: isUnlocked ? v.primary : '#666' }}
                      >
                        {v.name}
                      </p>
                      {!isUnlocked && (
                        <p className="text-[10px] text-[#666]">{v.requiredPoints} pts to unlock</p>
                      )}
                    </div>
                    {isCurrent && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: `${v.primary}22`, color: v.primary }}
                      >
                        ON
                      </span>
                    )}
                  </button>
                )
              })}

              {nextLocked && (
                <div
                  className="px-3 py-2 border-t"
                  style={{ borderColor: currentVariant?.cssVars['--border'] ?? 'rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-2.5 w-2.5" style={{ color: '#666' }} />
                    <p className="text-[9px]" style={{ color: '#666' }}>
                      {nextLocked.requiredPoints - userPoints} pts to unlock {nextLocked.name}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
