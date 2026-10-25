// Public portfolio design spec — the ONLY way a student (or, later, the AI
// designer) changes how /u/<username> looks. Pure module: the public page, the
// customise screen and the AI step all share it. The backend
// (career_profile.DESIGN_OPTIONS) validates the same values.

import type { PublicSection } from "@/lib/career-profile"

export type Layout = "classic" | "minimal" | "developer"
export type Accent = "indigo" | "emerald" | "teal" | "sky" | "violet" | "rose" | "amber" | "slate"
export type HeadingFont = "outfit" | "jakarta" | "mono"
export type Mode = "auto" | "light" | "dark"
export type BannerPattern = "grid" | "dots" | "aurora" | "none"
export type Banner = { kind: "pattern"; value: BannerPattern } | { kind: "image"; value: string }

export interface Design {
  layout: Layout
  accent: Accent
  font: HeadingFont
  mode: Mode
  banner: Banner
  section_order: PublicSection[]
}

export const SECTION_ORDER_DEFAULT: PublicSection[] = [
  "about", "projects", "experience", "education", "skills", "achievements", "certifications", "coding", "contact",
]

export const DEFAULT_DESIGN: Design = {
  layout: "classic", accent: "indigo", font: "outfit", mode: "auto",
  banner: { kind: "pattern", value: "grid" }, section_order: SECTION_ORDER_DEFAULT,
}

export const LAYOUTS: { value: Layout; label: string; hint: string }[] = [
  { value: "classic", label: "Classic", hint: "Balanced, with a stats band" },
  { value: "minimal", label: "Minimal", hint: "Centred and quiet — content first" },
  { value: "developer", label: "Developer", hint: "Dark, monospace, code-flavoured" },
]

/** Swatch colours for the picker only; the page uses the tuned .pf-accent-* classes in globals.css. */
export const ACCENTS: { value: Accent; label: string; swatch: string }[] = [
  { value: "indigo", label: "Indigo", swatch: "#4F46E5" },
  { value: "emerald", label: "Emerald", swatch: "#059669" },
  { value: "teal", label: "Teal", swatch: "#0D9488" },
  { value: "sky", label: "Sky", swatch: "#0284C7" },
  { value: "violet", label: "Violet", swatch: "#7C3AED" },
  { value: "rose", label: "Rose", swatch: "#E11D48" },
  { value: "amber", label: "Amber", swatch: "#D97706" },
  { value: "slate", label: "Slate", swatch: "#475569" },
]

export const FONTS: { value: HeadingFont; label: string; sample: string }[] = [
  { value: "outfit", label: "Outfit", sample: "font-serif" },
  { value: "jakarta", label: "Jakarta", sample: "font-sans" },
  { value: "mono", label: "Mono", sample: "font-mono" },
]

export const MODES: { value: Mode; label: string }[] = [
  { value: "auto", label: "Follow visitor" },
  { value: "light", label: "Always light" },
  { value: "dark", label: "Always dark" },
]

export const BANNER_PATTERNS: { value: BannerPattern; label: string }[] = [
  { value: "grid", label: "Grid" }, { value: "dots", label: "Dots" },
  { value: "aurora", label: "Aurora" }, { value: "none", label: "None" },
]

/** What picking a layout also sets — a sensible starting point the student can still change. */
export const LAYOUT_PRESETS: Record<Layout, Partial<Design>> = {
  classic: { font: "outfit", mode: "auto", banner: { kind: "pattern", value: "grid" } },
  minimal: { font: "jakarta", mode: "auto", banner: { kind: "pattern", value: "none" } },
  developer: { font: "mono", mode: "dark", banner: { kind: "pattern", value: "dots" } },
}

const has = <T,>(opts: { value: T }[], v: unknown): v is T => opts.some((o) => o.value === v)

/** Anything (older API, partial draft) → a complete design. */
export function normalizeDesign(raw: Partial<Design> | null | undefined): Design {
  const d = raw ?? {}
  const banner: Banner =
    d.banner?.kind === "image" && typeof d.banner.value === "string" ? d.banner
      : d.banner?.kind === "pattern" && has(BANNER_PATTERNS, d.banner.value) ? d.banner
      : DEFAULT_DESIGN.banner
  const order = (d.section_order ?? []).filter((s, i, a) => SECTION_ORDER_DEFAULT.includes(s) && a.indexOf(s) === i)
  return {
    layout: has(LAYOUTS, d.layout) ? d.layout : DEFAULT_DESIGN.layout,
    accent: has(ACCENTS, d.accent) ? d.accent : DEFAULT_DESIGN.accent,
    font: has(FONTS, d.font) ? d.font : DEFAULT_DESIGN.font,
    mode: has(MODES, d.mode) ? d.mode : DEFAULT_DESIGN.mode,
    banner,
    section_order: [...order, ...SECTION_ORDER_DEFAULT.filter((s) => !order.includes(s))],
  }
}

/** Classes for the page root: accent tokens, heading font, forced light/dark. */
export function designClasses(d: Design): string {
  return [
    `pf-accent-${d.accent}`,
    d.font !== "outfit" && `pf-heading-${d.font}`,
    d.mode === "dark" && "dark",
    d.mode === "light" && "pf-force-light",
  ].filter(Boolean).join(" ")
}
