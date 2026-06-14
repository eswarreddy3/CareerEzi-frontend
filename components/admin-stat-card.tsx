"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

// Muted jewel-tone palette — solid accents used by IconTile / panel headers.
export const ADMIN_CARD_COLORS = [
  "#3D55C8", // sapphire
  "#7B45C9", // amethyst
  "#1E9D6B", // emerald
  "#C77E33", // topaz
  "#C0476F", // ruby
  "#1C8B8F", // teal
  "#4F46E5", // indigo
  "#B58A2B", // citrine
]

// Deep duotone gradients for the stat-card surfaces (lighter top → deeper bottom).
const ADMIN_CARD_GRADIENTS = [
  "linear-gradient(140deg, #4A63D6 0%, #2C3CA4 100%)", // sapphire
  "linear-gradient(140deg, #8C57DC 0%, #5C30A6 100%)", // amethyst
  "linear-gradient(140deg, #2BB07A 0%, #137F56 100%)", // emerald
  "linear-gradient(140deg, #DB9145 0%, #A55C20 100%)", // topaz
  "linear-gradient(140deg, #D2587F 0%, #983256 100%)", // ruby
  "linear-gradient(140deg, #27A0A4 0%, #126B70 100%)", // teal
  "linear-gradient(140deg, #6366F1 0%, #3830B4 100%)", // indigo
  "linear-gradient(140deg, #CB9A38 0%, #936D1B 100%)", // citrine
]

function wrap(i: number, len: number) {
  return ((i % len) + len) % len
}
export function adminCardColor(i: number) {
  return ADMIN_CARD_COLORS[wrap(i, ADMIN_CARD_COLORS.length)]
}
export function adminCardGradient(i: number) {
  return ADMIN_CARD_GRADIENTS[wrap(i, ADMIN_CARD_GRADIENTS.length)]
}

// Fine film-grain noise (SVG) — gives surfaces premium texture instead of flat fills.
const NOISE_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

/** Soft top-left sheen + grain overlay for any coloured surface (cards, header). */
export function SurfaceTexture({ sheen = true }: { sheen?: boolean }) {
  return (
    <>
      {sheen && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(120% 90% at 14% 0%, rgba(255,255,255,0.18), rgba(255,255,255,0) 55%)" }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.10] mix-blend-overlay"
        style={{ backgroundImage: `url("${NOISE_URL}")`, backgroundSize: "140px 140px" }}
      />
    </>
  )
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
  /** override the surface (solid colour or gradient) */
  color?: string
  delay?: number
  className?: string
}

/** Premium jewel-tone stat card used across all college-admin pages. */
export function AdminStatCard({
  index, icon: Icon, label, value, sub, trend, badge, bar, href, color, delay = 0, className = "",
}: AdminStatCardProps) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className={`h-full relative overflow-hidden rounded-2xl p-4 text-white ring-1 ring-inset ring-white/10 shadow-lg shadow-black/10 ${href ? "cursor-pointer" : ""} ${className}`}
      style={{ background: color ?? adminCardGradient(index) }}
    >
      <SurfaceTexture />
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 ring-1 ring-inset ring-white/15">
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
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/75 mt-2.5">{label}</p>
        <p className="text-2xl font-bold font-serif leading-none mt-1">{value}</p>
        {sub && <p className="text-[11px] text-white/70 mt-1 truncate">{sub}</p>}
        {bar != null && (
          <div className="mt-2.5 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.max(bar, 0), 100)}%` }}
              transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )

  return href ? <Link href={href} className="block h-full">{card}</Link> : card
}

/** Solid-colour rounded icon tile with a white glyph — ties panels back to the cards. */
export function IconTile({
  icon: Icon, color, size = "md", className = "",
}: {
  icon: LucideIcon
  color: string
  size?: "sm" | "md"
  className?: string
}) {
  const dim = size === "sm" ? "w-8 h-8" : "w-9 h-9"
  const glyph = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]"
  return (
    <div
      className={`${dim} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-inset ring-white/15 ${className}`}
      style={{ background: color }}
    >
      <Icon className={`${glyph} text-white`} />
    </div>
  )
}

/** Section heading: coloured icon tile + title/subtitle + optional right slot. */
export function SectionHeading({
  icon, color, title, subtitle, right,
}: {
  icon: LucideIcon
  color: string
  title: string
  subtitle?: string
  right?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <IconTile icon={icon} color={color} />
        <div>
          <h2 className="text-lg font-bold font-serif text-foreground leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}
