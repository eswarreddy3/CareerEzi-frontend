"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView, useReducedMotion, animate, type Variants } from "framer-motion"
import {
  Github, Linkedin, Code2, Terminal, ExternalLink, Star, Users, FolderGit2,
  Trophy, Target, Award, Flame, GraduationCap, BadgeCheck, MapPin, ShieldCheck,
  Share2, Check, FileText,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { getLevel } from "@/lib/levels"
import { media, type CodingProfile, type PublicCertificate, type PublicProfile } from "@/lib/public-profile"
import { cn } from "@/lib/utils"

// ─── Motion presets ─────────────────────────────────────────────────────────
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}
const reveal = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, margin: "-70px" },
  variants: container,
}

// Count-up number that animates when scrolled into view.
function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduceMotion = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduceMotion) { setN(value); return }
    const controls = animate(0, value, {
      duration: 1.1, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, reduceMotion])
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>
}

// Copy / native-share the profile link.
function ShareButton() {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url }); return } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }
  return (
    <motion.button
      onClick={share}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-sm font-medium text-primary hover:bg-primary/15 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
      {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
      {copied ? "Link copied" : "Share"}
    </motion.button>
  )
}

// ─── Main view ──────────────────────────────────────────────────────────────
export function PublicProfileView({ p }: { p: PublicProfile }) {
  const level = getLevel(p.points)
  const connected = p.coding_profiles.filter((c) => c.stats)
  const certificates = p.certificates ?? []
  const initials = p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

  // Problems solved — CareerEzi practice + LeetCode, shown combined with a per-source breakdown.
  const czSolved = p.problems_solved ?? 0
  const lcSolved = connected.find((c) => c.platform === "leetcode")?.stats?.total_solved ?? 0
  const totalSolved = czSolved + lcSolved

  // Completions that never got a certificate still deserve a mention.
  const uncertified = [
    ...p.completed_domains.filter((d) => !d.certificate_uid).map((d) => ({ ...d, kind: "domain" as const })),
    ...p.completed_courses.filter((c) => !c.certificate_uid).map((c) => ({ ...c, kind: "course" as const })),
  ]
  const hasAchievements = certificates.length > 0 || uncertified.length > 0
  const hasContact = !!(p.linkedin || p.github)

  const stats = [
    { icon: Target, label: "Problems Solved", value: totalSolved },
    { icon: Award, label: "Certificates", value: certificates.length },
    { icon: Trophy, label: "Career Points", value: p.points },
    { icon: Flame, label: "Longest Streak", value: p.longest_streak, suffix: "d" },
  ]
  // Hairline dividers: 2×2 on mobile, 1×4 from sm.
  const statBorders = [
    "",
    "border-l border-border",
    "border-t border-border sm:border-t-0 sm:border-l",
    "border-t border-l border-border sm:border-t-0",
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero — formal blueprint-grid backdrop ── */}
      <div className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 opacity-40 dark:opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage: "radial-gradient(ellipse 85% 75% at 50% 0%, black 25%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 0%, black 25%, transparent 78%)",
          }} />
        <div aria-hidden className="absolute -top-36 left-1/2 -translate-x-1/2 w-[580px] h-[320px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <motion.div
          variants={container} initial="hidden" animate="visible"
          className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* Avatar */}
            <motion.div
              variants={item}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl opacity-50" aria-hidden />
              <div className="relative w-24 h-24 rounded-full bg-primary/10 ring-2 ring-primary/50 ring-offset-4 ring-offset-background flex items-center justify-center overflow-hidden shadow-xl">
                {p.avatar
                  ? <img src={media(p.avatar)} alt={p.name} className="w-full h-full object-cover" />
                  : <span className="text-3xl font-bold font-serif text-primary">{initials}</span>}
              </div>
            </motion.div>

            <motion.div variants={item} className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground">{p.name}</h1>
              <p className="text-sm text-primary/90 font-medium">@{p.username}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
                {p.branch && <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{p.branch}</span>}
                {p.college_name && (
                  <span className="inline-flex items-center gap-1.5">
                    {p.college_logo_url
                      ? <img src={media(p.college_logo_url)} alt="" className="h-4 w-4 rounded-sm object-contain" />
                      : <MapPin className="h-3.5 w-3.5" />}
                    {p.college_name}
                  </span>
                )}
                {p.passout_year && <span>Batch {p.passout_year}</span>}
              </div>
            </motion.div>

            {/* Level + streak chips + share */}
            <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-2 flex-shrink-0">
              <motion.span
                whileHover={{ scale: 1.05 }}
                style={{ boxShadow: level.glow }}
                className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium", level.color)}>
                {level.emoji} {level.name}
              </motion.span>
              {p.streak > 0 && (
                <motion.span whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-streak/10 border border-streak/20 text-sm font-medium text-streak">
                  <Flame className="h-3.5 w-3.5 flame-pulse" /> {p.streak}d
                </motion.span>
              )}
              <ShareButton />
            </motion.div>
          </div>

          {/* Credential stat band */}
          <motion.div variants={item}
            className="grid grid-cols-2 sm:grid-cols-4 mt-8 rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm">
            {stats.map((s, i) => (
              <div key={s.label} className={cn("px-3 py-4 text-center transition-colors hover:bg-primary/5", statBorders[i])}>
                <s.icon className="h-4 w-4 mx-auto text-primary mb-1.5" />
                <p className="text-2xl font-bold font-serif text-foreground leading-none tabular-nums">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 space-y-12">
        {/* ── Verified credentials — the certificate wall ── */}
        {hasAchievements && (
          <Section eyebrow="Verified by Fynity" title="Credentials" subtitle="Every certificate is independently verifiable">
            {certificates.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((c) => <CertificateCard key={c.certificate_uid} c={c} />)}
              </div>
            )}
            {uncertified.length > 0 && (
              <motion.div variants={item} className={cn("space-y-2", certificates.length > 0 && "mt-5")}>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Also completed</p>
                <div className="flex flex-wrap gap-2">
                  {uncertified.map((a) => (
                    <Chip key={`${a.kind}-${a.title}`}
                      className={a.kind === "domain" ? "bg-coding/10 border-coding/20" : "bg-secondary/40 border-border"}>
                      {a.kind === "domain"
                        ? <Trophy className="h-3.5 w-3.5 text-coding" />
                        : <BadgeCheck className="h-3.5 w-3.5 text-success" />}
                      {a.title}
                    </Chip>
                  ))}
                </div>
              </motion.div>
            )}
          </Section>
        )}

        {/* ── Coding — solved summary + synced platform cards ── */}
        {(totalSolved > 0 || connected.length > 0) && (
          <Section eyebrow="Practice record" title="Coding" subtitle="CareerEzi practice and synced external platforms">
            {totalSolved > 0 && (
              <motion.div variants={item}
                className="mb-5 rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-serif text-foreground tabular-nums"><CountUp value={totalSolved} /></span>
                  <span className="text-sm text-muted-foreground">problems solved</span>
                </div>
                <div className="flex flex-wrap gap-2 sm:ml-auto">
                  {czSolved > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                      <Code2 className="h-3 w-3" /> CareerEzi · {czSolved.toLocaleString()}
                    </span>
                  )}
                  {lcSolved > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/15 border border-warning/25 text-xs font-medium text-warning">
                      <Target className="h-3 w-3" /> LeetCode · {lcSolved.toLocaleString()}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
            {connected.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {connected.map((c) => (
                  <motion.div key={c.platform} variants={item}
                    whileHover={{ y: -6, scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="h-full">
                    {c.platform === "github" ? <GithubCard p={c} />
                    : c.platform === "leetcode" ? <LeetcodeCard p={c} />
                    : c.platform === "hackerrank" ? <HackerrankCard p={c} />
                    : null}
                  </motion.div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* ── Contact ── */}
        {hasContact && (
          <Section eyebrow="Get in touch" title="Connect">
            <motion.div variants={item} className="flex flex-wrap gap-3">
              {p.linkedin && <ContactLink href={p.linkedin} icon={Linkedin} iconClass="text-primary" label="LinkedIn" />}
              {p.github && <ContactLink href={p.github} icon={Github} label="GitHub" />}
            </motion.div>
          </Section>
        )}

        {/* Empty state */}
        {connected.length === 0 && !hasAchievements && !hasContact && totalSolved === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Code2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">This portfolio is just getting started.</p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-border text-center">
          <a href="https://www.careerezi.com" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Powered by <span className="font-semibold gradient-text">CareerEzi</span>
          </a>
        </div>
      </div>
    </main>
  )
}

// ─── Presentational helpers ─────────────────────────────────────────────────
function Section({ eyebrow, title, subtitle, children }: {
  eyebrow: string; title: string; subtitle?: string; children: ReactNode
}) {
  return (
    <motion.section {...reveal}>
      <motion.div variants={item} className="mb-5">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
            <h2 className="text-xl font-bold font-serif text-foreground leading-tight mt-0.5">{title}</h2>
          </div>
          <div className="flex-1 h-px bg-border" aria-hidden />
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>}
      </motion.div>
      {children}
    </motion.section>
  )
}

// Certificate card — a formal, verifiable credential. Signature element of the page.
function CertificateCard({ c }: { c: PublicCertificate }) {
  const isDomain = c.kind === "domain"
  const issued = c.issued_at
    ? new Date(c.issued_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null
  return (
    <motion.article
      variants={item}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/40 transition-[box-shadow,border-color] flex flex-col">
      {/* Accent rule — domain certificates carry the purple track colour */}
      <div className={cn("h-1 flex-shrink-0", isDomain
        ? "bg-gradient-to-r from-coding to-primary"
        : "bg-gradient-to-r from-primary to-coding/50")} aria-hidden />
      {/* Sheen sweep on hover */}
      <div aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-foreground/5 to-transparent motion-reduce:hidden" />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {isDomain ? "Domain certificate" : "Course certificate"}
            </p>
            <h3 className="font-serif font-bold text-lg text-foreground mt-1 leading-snug">{c.title}</h3>
          </div>
          {/* Seal */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-card",
            isDomain ? "bg-coding/10 ring-coding/20" : "bg-primary/10 ring-primary/20")}>
            <ShieldCheck className={cn("h-5 w-5", isDomain ? "text-coding" : "text-primary")} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{c.issuer}</span>
          {issued && <span>· Issued {issued}</span>}
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/70 mt-1 truncate">ID {c.certificate_uid}</p>

        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          <a href={`/verify/${c.certificate_uid}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/25 hover:bg-primary/15 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
            <ShieldCheck className="h-3.5 w-3.5" /> Verify
          </a>
          {c.pdf_url && (
            <a href={media(c.pdf_url)} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary/60 text-foreground border border-border hover:border-primary/30 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
              <FileText className="h-3.5 w-3.5" /> View certificate
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

function Chip({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.span
      whileHover={{ scale: 1.06, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium text-foreground cursor-default", className)}>
      {children}
    </motion.span>
  )
}

function ContactLink({ href, icon: Icon, iconClass, label }: {
  href: string; icon: LucideIcon; iconClass?: string; label: string
}) {
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 350, damping: 18 }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors text-sm font-medium text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
      <Icon className={cn("h-4 w-4", iconClass)} /> {label} <ExternalLink className="h-3 w-3 opacity-60" />
    </motion.a>
  )
}

const PLATFORM_THEME: Record<string, { gradient: string; icon: LucideIcon; label: string }> = {
  github:     { gradient: "linear-gradient(135deg, #2b3137 0%, #57606a 100%)", icon: Github,   label: "GitHub" },
  leetcode:   { gradient: "linear-gradient(135deg, #ffa116 0%, #e8870b 100%)", icon: Code2,    label: "LeetCode" },
  hackerrank: { gradient: "linear-gradient(135deg, #00b74a 0%, #00892f 100%)", icon: Terminal, label: "HackerRank" },
}

function CardShell({ platform, title, username, profileUrl, subtitle, avatarUrl, children }: {
  platform: string; title: string; username: string; profileUrl: string
  subtitle?: string | null; avatarUrl?: string | null; children: ReactNode
}) {
  const theme = PLATFORM_THEME[platform]
  const Icon = theme?.icon ?? Code2
  return (
    <div className="h-full rounded-2xl border border-border bg-card overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-shadow">
      <div className="relative px-4 min-h-[88px] flex items-center" style={{ background: theme?.gradient }}>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer"
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors">
          <Icon className="h-6 w-6" />
        </a>
        <div className="flex items-center gap-3 pr-9 w-full">
          {avatarUrl
            ? <img src={avatarUrl} alt="" className="w-11 h-11 rounded-full ring-2 ring-white/40 flex-shrink-0" />
            : <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><Icon className="h-5 w-5 text-white" /></div>}
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75 leading-none mb-0.5">
              {theme?.label ?? platform}
            </p>
            <p className="font-semibold text-white truncate leading-tight">{title}</p>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer"
              className="text-white/85 hover:text-white text-xs inline-flex items-center gap-0.5">
              @{username} <ExternalLink className="h-3 w-3" />
            </a>
            {subtitle && <p className="text-[11px] text-white/70 truncate mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3 flex-1">{children}</div>
    </div>
  )
}

function Tiles({ tiles }: { tiles: { icon: LucideIcon; label: string; value: number | null }[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {tiles.map((m) => (
        <div key={m.label} className="rounded-lg bg-background/50 border border-border/60 px-3 py-2 text-center transition-colors hover:border-primary/30">
          <m.icon className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
          <p className="text-base font-bold font-serif text-foreground leading-none">
            {m.value === null ? "—" : m.value.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{m.label}</p>
        </div>
      ))}
    </div>
  )
}

function GithubCard({ p }: { p: CodingProfile }) {
  const s = p.stats!
  return (
    <CardShell platform="github" title={s.name || p.username} username={p.username}
      profileUrl={p.profile_url || `https://github.com/${p.username}`} subtitle={s.bio} avatarUrl={s.avatar_url}>
      <Tiles tiles={[
        { icon: FolderGit2, label: "Repos", value: s.public_repos ?? 0 },
        { icon: Star, label: "Stars", value: s.total_stars ?? 0 },
        { icon: Users, label: "Followers", value: s.followers ?? 0 },
      ]} />
      {!!s.top_languages?.length && (
        <div className="flex flex-wrap gap-1.5">
          {s.top_languages.map((l) => (
            <span key={l} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{l}</span>
          ))}
        </div>
      )}
    </CardShell>
  )
}

function LeetcodeCard({ p }: { p: CodingProfile }) {
  const s = p.stats!
  const diffs = [
    { label: "Easy", solved: s.easy_solved ?? 0, total: s.easy_total ?? 0, color: "bg-success" },
    { label: "Medium", solved: s.medium_solved ?? 0, total: s.medium_total ?? 0, color: "bg-warning" },
    { label: "Hard", solved: s.hard_solved ?? 0, total: s.hard_total ?? 0, color: "bg-danger" },
  ]
  return (
    <CardShell platform="leetcode" title={s.name || p.username} username={p.username}
      profileUrl={p.profile_url || `https://leetcode.com/${p.username}/`} subtitle={s.country} avatarUrl={s.avatar_url}>
      <Tiles tiles={[
        { icon: Target, label: "Solved", value: s.total_solved ?? 0 },
        { icon: Users, label: "Ranking", value: s.ranking ?? 0 },
        { icon: Trophy, label: "Contest", value: s.contest_rating ?? null },
      ]} />
      <div className="space-y-2">
        {diffs.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-14 flex-shrink-0">{d.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div className={cn("h-full rounded-full", d.color)}
                initial={{ width: 0 }}
                whileInView={{ width: d.total ? `${Math.min(100, (d.solved / d.total) * 100)}%` : "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: "easeOut" }} />
            </div>
            <span className="text-[11px] font-medium text-foreground flex-shrink-0 w-16 text-right tabular-nums">{d.solved} / {d.total}</span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function HackerrankCard({ p }: { p: CodingProfile }) {
  const s = p.stats!
  const badges = s.badges ?? []
  const subtitle = [s.level ? `Lvl ${s.level}` : null, s.country].filter(Boolean).join(" · ")
  return (
    <CardShell platform="hackerrank" title={s.name || p.username} username={p.username}
      profileUrl={p.profile_url || `https://www.hackerrank.com/profile/${p.username}`} subtitle={subtitle} avatarUrl={s.avatar_url}>
      <Tiles tiles={[
        { icon: Star, label: "Total Stars", value: s.total_stars ?? 0 },
        { icon: Award, label: "Badges", value: badges.length },
        { icon: Users, label: "Followers", value: s.followers ?? 0 },
      ]} />
      {!!badges.length && (
        <div className="space-y-1.5">
          {badges.slice(0, 6).map((b) => (
            <div key={b.name} className="flex items-center gap-2 text-xs rounded-lg px-2.5 py-1.5 bg-secondary/30">
              <span className="text-foreground truncate flex-1 min-w-0">{b.name}</span>
              <span className="flex items-center gap-0.5 text-warning flex-shrink-0">
                {Array.from({ length: Math.min(b.stars, 5) }).map((_, i) => <Star key={i} className="h-3 w-3 fill-warning" />)}
                {b.stars > 5 && <span className="text-[10px] ml-0.5">+{b.stars - 5}</span>}
              </span>
              <span className="text-muted-foreground flex-shrink-0 w-16 text-right tabular-nums">{b.solved}/{b.total}</span>
            </div>
          ))}
        </div>
      )}
    </CardShell>
  )
}
