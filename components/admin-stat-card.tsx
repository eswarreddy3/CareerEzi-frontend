"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

// Shared solid colour palette for every college-admin stat card.
// Each card in a row should pass its index so the row cycles through colours.
export const ADMIN_CARD_COLORS = [
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#10B981", // emerald
  "#F97316", // orange
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#6366F1", // indigo
  "#F59E0B", // amber
]

export function adminCardColor(i: number) {
  return ADMIN_CARD_COLORS[((i % ADMIN_CARD_COLORS.length) + ADMIN_CARD_COLORS.length) % ADMIN_CARD_COLORS.length]
}

interface AdminStatCardProps {
  index: number
  icon: LucideIcon
  label: string
  value: ReactNode
  sub?: string
  /** signed % shown as a pill (ignored when `badge` is set) */
  trend?: number | null
  /** small text pill in the top-right corner */
  badge?: string
  /** 0–100 — renders a progress bar */
  bar?: number
  href?: string
  /** override the palette colour */
  color?: string
  delay?: number
  className?: string
}

/** Compact, solid-colour stat card used across all college-admin pages. */
export function AdminStatCard({
  index, icon: Icon, label, value, sub, trend, badge, bar, href, color, delay = 0, className = "",
}: AdminStatCardProps) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className={`h-full relative overflow-hidden rounded-xl p-3.5 text-white ${href ? "cursor-pointer" : ""} ${className}`}
      style={{ background: color ?? adminCardColor(index) }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-white" />
        </div>
        {badge != null ? (
          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-white/20 text-white">{badge}</span>
        ) : trend != null ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : trend < 0 ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        ) : null}
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80 mt-2.5">{label}</p>
      <p className="text-2xl font-bold font-serif leading-none mt-1">{value}</p>
      {sub && <p className="text-[11px] text-white/75 mt-1 truncate">{sub}</p>}
      {bar != null && (
        <div className="mt-2.5 h-1.5 rounded-full bg-white/25 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.max(bar, 0), 100)}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  )

  return href ? <Link href={href} className="block h-full">{card}</Link> : card
}
