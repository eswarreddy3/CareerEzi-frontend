import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import type { HTMLAttributes, ReactNode } from "react"

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = false, glow = false, ...props }, ref) => (
    <div
      ref={ref}
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
)

GlassCard.displayName = "GlassCard"
