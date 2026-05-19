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

export function DiceRoller({ courseId, currentIndex, userPoints, onRoll }: DiceRollerProps) {
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
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Theme preview popup on hover */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mb-1 rounded-2xl border shadow-2xl overflow-hidden min-w-[180px]"
            style={{
              background: currentVariant?.cssVars['--card'] ?? '#161616',
              borderColor: currentVariant?.cssVars['--border'] ?? 'rgba(255,255,255,0.1)',
            }}
          >
            {/* Unlocked themes */}
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

            {/* XP hint for next locked theme */}
            {nextLocked && (
              <div className="px-3 py-2 border-t" style={{ borderColor: currentVariant?.cssVars['--border'] ?? 'rgba(255,255,255,0.08)' }}>
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

      {/* Dice button */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p
            className="text-[11px] font-semibold"
            style={{ color: currentVariant?.primary ?? '#888' }}
          >
            {currentVariant?.name ?? 'Default'}
          </p>
          <p className="text-[9px]" style={{ color: '#666' }}>
            {unlockedCount}/{totalCount} unlocked
          </p>
        </div>

        <motion.button
          onClick={roll}
          onMouseEnter={() => !isRolling && setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
          animate={isRolling ? {
            rotateX: [0, -40, 80, -50, 20, 0],
            rotateY: [0, 120, 240, 360, 480, 540],
            scale:   [1,  1.25, 0.85, 1.15, 0.95, 1],
          } : { rotateX: 0, rotateY: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={!isRolling ? { scale: 1.1 } : {}}
          whileTap={!isRolling ? { scale: 0.88 } : {}}
          disabled={isRolling}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl select-none border transition-all duration-300"
          style={{
            background: currentVariant?.cssVars['--card'] ?? '#161616',
            borderColor: currentVariant?.cssVars['--border'] ?? 'rgba(255,255,255,0.12)',
            boxShadow: `0 4px 24px ${currentVariant?.glow ?? 'rgba(0,0,0,0.3)'}, 0 0 0 1px rgba(255,255,255,0.04)`,
            color: currentVariant?.primary ?? '#ffffff',
          }}
          title={`Roll for a new theme (${unlockedCount}/${totalCount} unlocked)`}
        >
          {isRolling ? '🎲' : DICE_FACES[currentIndex % DICE_FACES.length]}
        </motion.button>
      </div>
    </div>
  )
}
