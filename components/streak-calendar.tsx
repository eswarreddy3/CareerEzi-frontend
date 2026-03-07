"use client"

import { GlassCard } from "@/components/glass-card"
import { cn } from "@/lib/utils"

interface StreakCalendarProps {
  activeDays: number[]
  currentStreak: number
}

export function StreakCalendar({ activeDays, currentStreak }: StreakCalendarProps) {
  const today = new Date()
  const daysInMonth = 30
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const isActive = activeDays.includes(day)
    const isToday = day === today.getDate()
    return { day, isActive, isToday }
  })

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold font-serif text-foreground">Streak Calendar</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Current:</span>
          <span className="text-primary font-bold">{currentStreak} days</span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
            {day}
          </div>
        ))}
        
        {/* Empty cells for offset */}
        {Array.from({ length: 0 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {days.map(({ day, isActive, isToday }) => (
          <div
            key={day}
            className={cn(
              "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200",
              isActive 
                ? "bg-primary/20 text-primary border border-primary/30" 
                : "bg-secondary/50 text-muted-foreground",
              isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
          >
            {isActive && (
              <div className="w-2 h-2 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-secondary/50" />
          <span>Inactive</span>
        </div>
      </div>
    </GlassCard>
  )
}
