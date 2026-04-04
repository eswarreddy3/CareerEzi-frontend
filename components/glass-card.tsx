import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export function GlassCard({ children, className, hover = false, glow = false, ...props }: GlassCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "bg-card border border-border rounded-xl p-6",
        hover && "card-hover cursor-pointer",
        glow && "ring-1 ring-primary/40",
        className
      )}
    >
      {children}
    </div>
  )
}
