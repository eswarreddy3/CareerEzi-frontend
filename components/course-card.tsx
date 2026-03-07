"use client"

import { GlassCard } from "@/components/glass-card"
import { ProgressRing } from "@/components/progress-ring"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Star, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface CourseCardProps {
  title: string
  icon: LucideIcon
  iconColor: string
  lessonsCompleted: number
  totalLessons: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  stars: number
  isLocked?: boolean
  prerequisite?: string
  progress?: number
  onContinue?: () => void
}

const difficultyColors = {
  Beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
}

export function CourseCard({
  title,
  icon: Icon,
  iconColor,
  lessonsCompleted,
  totalLessons,
  difficulty,
  stars,
  isLocked = false,
  prerequisite,
  progress = 0,
  onContinue,
}: CourseCardProps) {
  return (
    <GlassCard hover className="relative overflow-hidden group">
      {isLocked && (
        <div className="absolute inset-0 locked-overlay z-10 flex flex-col items-center justify-center gap-3 rounded-xl">
          <Lock className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center px-4">
            Complete <span className="text-primary font-medium">{prerequisite}</span> to unlock
          </p>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", iconColor.replace("text-", "bg-").replace("500", "500/20"))}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-xs border", difficultyColors[difficulty])}>
            {difficulty}
          </Badge>
        </div>
      </div>
      
      <h3 className="font-semibold text-lg mb-2 font-serif text-foreground">{title}</h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        {lessonsCompleted} of {totalLessons} lessons completed
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-medium text-foreground">{stars} stars</span>
        </div>
        
        {progress > 0 ? (
          <ProgressRing progress={progress} size={48} strokeWidth={4} />
        ) : null}
      </div>
      
      <Button
        className={cn(
          "w-full mt-4 transition-all duration-300",
          progress > 0 
            ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
            : "bg-secondary hover:bg-secondary/80 text-foreground"
        )}
        disabled={isLocked}
        onClick={onContinue}
      >
        {progress > 0 ? "Continue" : "Start"}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </GlassCard>
  )
}
