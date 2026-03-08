"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  Clock,
  ArrowRight,
  Loader2,
  BookOpen,
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { getLessonContent } from "@/content"

interface Lesson {
  id: number
  title: string
  duration_mins: number
  order: number
  points: number
  is_completed: boolean
}

interface Course {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon_color: string
  total_lessons: number
  lessons_completed: number
  lessons: Lesson[]
}

const difficultyColors = {
  Beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
}

// ─── Inline renderer: bold + inline-code ─────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return (
        <code key={i} className="bg-secondary/80 px-1.5 py-0.5 rounded text-[11px] font-mono text-primary border border-white/10">
          {part.slice(1, -1)}
        </code>
      )
    return <span key={i}>{part}</span>
  })
}

// ─── Custom block config ──────────────────────────────────────────────────────
const BLOCK_CFG = {
  scenario: {
    bg: 'bg-[rgba(0,212,200,0.05)]',
    border: 'border-l-[3px] border-[#00D4C8]',
    icon: '📍',
    label: 'Real Scenario',
    labelClass: 'text-[#00D4C8]',
  },
  insight: {
    bg: 'bg-[rgba(245,158,11,0.05)]',
    border: 'border-l-[3px] border-amber-500',
    icon: '💡',
    label: 'Real World Insight',
    labelClass: 'text-amber-400',
  },
  challenge: {
    bg: 'bg-[rgba(139,92,246,0.05)]',
    border: 'border-l-[3px] border-violet-500',
    icon: '🚀',
    label: 'Challenge',
    labelClass: 'text-violet-400',
  },
  mistake: {
    bg: 'bg-[rgba(239,68,68,0.05)]',
    border: 'border-l-[3px] border-red-500',
    icon: '⚠️',
    label: 'Common Mistake',
    labelClass: 'text-red-400',
  },
  tip: {
    bg: 'bg-[rgba(16,185,129,0.05)]',
    border: 'border-l-[3px] border-emerald-500',
    icon: '✨',
    label: 'Pro Tip',
    labelClass: 'text-emerald-400',
  },
} as const

const LANG_LABEL: Record<string, string> = {
  python: 'Python', bash: 'Terminal', shell: 'Terminal',
  javascript: 'JavaScript', js: 'JavaScript', ts: 'TypeScript',
  typescript: 'TypeScript', sql: 'SQL', json: 'JSON',
  html: 'HTML', css: 'CSS', output: 'Output',
}

// ─── Block content renderer (supports code fences + inline formatting) ────────
function renderBlockLines(lines: string[], baseKey: number): React.ReactNode[] {
  const result: React.ReactNode[] = []
  let k = baseKey * 10000
  let j = 0
  while (j < lines.length) {
    const line = lines[j]
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim().toLowerCase()
      const codeLines: string[] = []
      j++
      while (j < lines.length && !lines[j].startsWith('```')) { codeLines.push(lines[j]); j++ }
      const isOutput = lang === 'output'
      result.push(
        <pre key={k++} className={cn(
          'rounded-lg p-3 overflow-x-auto text-xs font-mono mt-2 leading-relaxed',
          isOutput
            ? 'bg-[#050A10] text-emerald-400 border border-emerald-900/40'
            : 'bg-[#0D1224] text-foreground border border-white/5'
        )}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
    } else if (line.trim() === '') {
      result.push(<div key={k++} className="h-1" />)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      result.push(
        <div key={k++} className="flex items-start gap-2 text-sm my-0.5">
          <span className="text-primary mt-1.5 text-[8px]">▸</span>
          <span className="text-foreground/90 leading-relaxed">{renderInline(line.slice(2))}</span>
        </div>
      )
    } else if (/^\d+\.\s/.test(line)) {
      const m = line.match(/^(\d+)\.\s(.+)/)
      if (m) result.push(
        <div key={k++} className="flex items-start gap-2 text-sm my-0.5">
          <span className="text-primary font-mono font-bold text-xs mt-0.5 min-w-[14px]">{m[1]}.</span>
          <span className="text-foreground/90 leading-relaxed">{renderInline(m[2])}</span>
        </div>
      )
    } else {
      result.push(
        <p key={k++} className="text-sm text-foreground/90 leading-relaxed">{renderInline(line)}</p>
      )
    }
    j++
  }
  return result
}

// ─── Main content renderer ────────────────────────────────────────────────────
function renderContent(content: string): React.ReactNode[] {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Custom blocks: :::type … :::
    const blockMatch = line.match(/^:::(\w+)$/)
    if (blockMatch) {
      const type = blockMatch[1] as keyof typeof BLOCK_CFG
      const blockLines: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== ':::') { blockLines.push(lines[i]); i++ }
      const cfg = BLOCK_CFG[type]
      if (cfg) {
        elements.push(
          <div key={key++} className={cn('rounded-xl p-4 my-4', cfg.bg, cfg.border)}>
            <div className={cn('flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3', cfg.labelClass)}>
              <span>{cfg.icon}</span><span>{cfg.label}</span>
            </div>
            <div className="space-y-1.5">{renderBlockLines(blockLines, key)}</div>
          </div>
        )
      }
      i++; continue
    }

    // Fenced code blocks
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim().toLowerCase()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      const label = LANG_LABEL[lang] ?? (lang || null)
      const isOutput = lang === 'output'
      elements.push(
        <div key={key++} className="relative my-4 group">
          {label && (
            <div className={cn(
              'absolute top-0 right-0 px-2.5 py-1 text-[10px] font-mono font-semibold rounded-bl-lg rounded-tr-xl border-b border-l z-10 uppercase tracking-wider',
              isOutput
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50'
                : 'bg-secondary/80 text-muted-foreground border-white/5'
            )}>{label}</div>
          )}
          <pre className={cn(
            'rounded-xl p-4 pt-7 overflow-x-auto text-sm font-mono leading-relaxed',
            isOutput
              ? 'bg-[#040810] text-emerald-400 border border-emerald-900/40'
              : 'bg-[#0D1224] text-foreground border border-white/5'
          )}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      )
      i++; continue
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-sm font-bold text-foreground mt-5 mb-1.5">{renderInline(line.slice(4))}</h3>)
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-base font-bold text-foreground mt-7 mb-2 font-serif pb-1.5 border-b border-white/5">
          {renderInline(line.slice(3))}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-xl font-bold mt-4 mb-3 font-serif gradient-text">{line.slice(2)}</h1>
      )
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={key++} className="border-l-2 border-primary/40 pl-3 text-sm text-muted-foreground italic my-2">
          {renderInline(line.slice(2))}
        </blockquote>
      )
    }
    // Unordered list
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 text-sm my-0.5 ml-1">
          <span className="text-primary mt-1.5 text-[8px] flex-shrink-0">▸</span>
          <span className="text-foreground/90 leading-relaxed">{renderInline(line.slice(2))}</span>
        </div>
      )
    }
    // Ordered list
    else if (/^\d+\.\s/.test(line)) {
      const m = line.match(/^(\d+)\.\s(.+)/)
      if (m) elements.push(
        <div key={key++} className="flex items-start gap-2 text-sm my-0.5 ml-1">
          <span className="text-primary font-mono font-bold text-xs mt-0.5 min-w-[16px]">{m[1]}.</span>
          <span className="text-foreground/90 leading-relaxed">{renderInline(m[2])}</span>
        </div>
      )
    }
    // Table
    else if (line.startsWith('| ')) {
      const tableLines: string[] = [line]
      i++
      while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++ }
      const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim())
      const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()))
      elements.push(
        <div key={key++} className="overflow-x-auto my-5 rounded-xl border border-white/5">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-secondary/60">
                {headers.map((h, j) => (
                  <th key={j} className="text-left py-2.5 px-4 text-muted-foreground font-semibold text-xs uppercase tracking-wide border-b border-white/5">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j} className="border-b border-white/5 hover:bg-secondary/20 transition-colors last:border-0">
                  {row.map((cell, k) => (
                    <td key={k} className="py-2.5 px-4 text-foreground/90 text-sm">{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }
    // Empty line
    else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />)
    }
    // Paragraph
    else {
      elements.push(
        <p key={key++} className="text-sm text-foreground/85 leading-7">
          {renderInline(line)}
        </p>
      )
    }

    i++
  }
  return elements
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const router = useRouter()
  const { updateUser } = useAuthStore()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    api.get(`/learn/courses/${courseId}`)
      .then((res) => {
        const data: Course = res.data
        setCourse(data)
        // Auto-select first incomplete lesson, or first lesson
        const first = data.lessons.find(l => !l.is_completed) ?? data.lessons[0]
        setActiveLesson(first ?? null)
      })
      .catch(() => {
        toast.error("Failed to load course")
        router.push("/learn")
      })
      .finally(() => setLoading(false))
  }, [courseId])

  async function markComplete() {
    if (!activeLesson || activeLesson.is_completed) return
    setCompleting(true)
    try {
      const res = await api.post(`/learn/lessons/${activeLesson.id}/complete`)
      const { points_earned, total_points } = res.data

      // Update local state
      setCourse(prev => {
        if (!prev) return prev
        const updated = prev.lessons.map(l =>
          l.id === activeLesson.id ? { ...l, is_completed: true } : l
        )
        return { ...prev, lessons: updated, lessons_completed: prev.lessons_completed + 1 }
      })
      setActiveLesson(prev => prev ? { ...prev, is_completed: true } : prev)

      updateUser({ points: total_points })

      if (points_earned > 0) {
        toast.success(`Lesson complete! +${points_earned} pts`)
      } else {
        toast.success("Lesson marked complete")
      }

      // Auto-advance to next lesson
      const currentIdx = course!.lessons.findIndex(l => l.id === activeLesson.id)
      const next = course!.lessons[currentIdx + 1]
      if (next) {
        setTimeout(() => setActiveLesson(next), 800)
      }
    } catch {
      toast.error("Failed to mark lesson complete")
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!course) return null

  const progress = course.total_lessons > 0
    ? Math.round((course.lessons_completed / course.total_lessons) * 100)
    : 0

  const activeIdx = course.lessons.findIndex(l => l.id === activeLesson?.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/learn")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-serif text-foreground">{course.title}</h1>
          <p className="text-sm text-muted-foreground">{course.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn("text-xs border", difficultyColors[course.difficulty])}>
            {course.difficulty}
          </Badge>
          <ProgressRing progress={progress} size={52} strokeWidth={4} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{course.lessons_completed} of {course.total_lessons} lessons completed</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson list */}
        <div className="lg:col-span-1">
          <GlassCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold font-serif text-foreground">Lessons</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {course.lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 text-left border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/30",
                    activeLesson?.id === lesson.id && "bg-primary/10 border-l-2 border-l-primary"
                  )}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {lesson.is_completed ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <PlayCircle className={cn(
                        "h-5 w-5",
                        activeLesson?.id === lesson.id ? "text-primary" : "text-muted-foreground"
                      )} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      lesson.is_completed ? "text-muted-foreground line-through" : "text-foreground"
                    )}>
                      {idx + 1}. {lesson.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{lesson.duration_mins} min</span>
                      <span className="text-xs text-amber-500">+{lesson.points} pts</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Lesson content */}
        <div className="lg:col-span-2">
          {activeLesson ? (
            <GlassCard>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-serif text-foreground">{activeLesson.title}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activeLesson.duration_mins} min
                    </div>
                    <span className="text-xs text-amber-500 font-medium">+{activeLesson.points} pts</span>
                    {activeLesson.is_completed && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Content — loaded from local content files, not from DB */}
              <div className="prose-sm max-w-none mb-8">
                {(() => {
                  const content = getLessonContent(courseId, activeLesson.order)
                  return content
                    ? renderContent(content)
                    : <p className="text-muted-foreground text-sm italic">Content coming soon for this lesson.</p>
                })()}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeIdx <= 0}
                  onClick={() => setActiveLesson(course.lessons[activeIdx - 1])}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                </Button>

                <div className="flex gap-2">
                  {!activeLesson.is_completed && (
                    <Button
                      onClick={markComplete}
                      disabled={completing}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {completing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  {activeIdx < course.lessons.length - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveLesson(course.lessons[activeIdx + 1])}
                    >
                      Next <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center h-64">
              <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">Select a lesson to start learning</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
