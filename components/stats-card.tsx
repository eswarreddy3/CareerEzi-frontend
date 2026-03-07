import { GlassCard } from "@/components/glass-card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  iconColor?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  suffix?: string
}

export function StatsCard({ title, value, icon: Icon, iconColor = "text-primary", trend, suffix }: StatsCardProps) {
  return (
    <GlassCard hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 font-serif text-foreground">
            {value}
            {suffix && <span className="text-lg text-muted-foreground ml-1">{suffix}</span>}
          </p>
          {trend && (
            <p className={cn(
              "text-xs mt-2 flex items-center gap-1",
              trend.isPositive ? "text-emerald-400" : "text-red-400"
            )}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-lg bg-primary/10", iconColor.replace("text-", "text-"))}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        )}
      </div>
    </GlassCard>
  )
}
