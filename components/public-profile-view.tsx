"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView, animate, type Variants } from "framer-motion"
import {
  Github, Linkedin, Code2, Terminal, ExternalLink, Star, Users, FolderGit2,
  Trophy, Target, Award, Flame, GraduationCap, BadgeCheck, MapPin, ShieldCheck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { getLevel } from "@/lib/levels"
import { media, type CodingProfile, type PublicProfile } from "@/lib/public-profile"
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
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.1, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value])
  return <span ref={ref}>{n.toLocaleString()}</span>
}

// ─── Main view ──────────────────────────────────────────────────────────────
export function PublicProfileView({ p }: { p: PublicProfile }) {
  const level = getLevel(p.points)
  const connected = p.coding_profiles.filter((c) => c.stats)
  const hasAchievements = p.completed_domains.length > 0 || p.completed_courses.length > 0
  const hasContact = !!(p.linkedin || p.github)
  const initials = p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero with animated ambient blobs ── */}
      <div className="relative overflow-hidden border-b border-border">
        <motion.div aria-hidden
          className="absolute -top-28 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, 24, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div aria-hidden
          className="absolute -top-16 right-0 w-80 h-80 rounded-full bg-coding/15 blur-3xl pointer-events-none"
          animate={{ x: [0, -36, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div aria-hidden
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-streak/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 24, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />

        <motion.div
          variants={container} initial="hidden" animate="visible"
          className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* Avatar */}
            <motion.div
              variants={item}
              whileHover={{ scale: 1.06, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl opacity-60" aria-hidden />
              <div className="relative w-24 h-24 rounded-full bg-primary/15 border-2 border-primary/50 flex items-center justify-center overflow-hidden shadow-xl">
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
                {p.college_name && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.college_name}</span>}
                {p.passout_year && <span>Batch {p.passout_year}</span>}
              </div>
            </motion.div>

            {/* Level + streak chips */}
            <motion.div variants={item} className="flex items-center gap-2 flex-shrink-0">
              <motion.span
                whileHover={{ scale: 1.05 }}
                style={{ boxShadow: level.glow }}
                className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium", level.color)}>
                {level.emoji} {level.name}
              </motion.span>
              {p.longest_streak > 0 && (
                <motion.span whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-streak/10 border border-streak/20 text-sm font-medium text-streak">
                  <Flame className="h-3.5 w-3.5 flame-pulse" /> {p.longest_streak}d
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Quick stats with count-up */}
          <motion.div variants={container} className="grid grid-cols-3 gap-3 mt-8 max-w-md mx-auto sm:mx-0">
            <Stat label="Points" value={p.points} />
            <Stat label="Verified Tracks" value={p.completed_domains.length + p.completed_courses.length} />
            <Stat label="Day Streak" value={p.streak} />
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 space-y-10">
        {/* CareerEzi achievements */}
        {hasAchievements && (
          <Section icon={BadgeCheck} title="CareerEzi Achievements" subtitle="Verified learning milestones">
            {p.completed_domains.length > 0 && (
              <motion.div variants={item} className="space-y-2 mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Domains Completed</p>
                <div className="flex flex-wrap gap-2">
                  {p.completed_domains.map((d) => (
                    <AchievementChip key={d.title} uid={d.certificate_uid} className="bg-coding/10 border-coding/20">
                      <Trophy className="h-3.5 w-3.5 text-coding" /> {d.title}
                    </AchievementChip>
                  ))}
                </div>
              </motion.div>
            )}
            {p.completed_courses.length > 0 && (
              <motion.div variants={item} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Courses Completed</p>
                <div className="flex flex-wrap gap-2">
                  {p.completed_courses.map((c) => (
                    <AchievementChip key={c.title} uid={c.certificate_uid} className="bg-secondary/40 border-border">
                      <BadgeCheck className="h-3.5 w-3.5 text-success" /> {c.title}
                    </AchievementChip>
                  ))}
                </div>
              </motion.div>
            )}
          </Section>
        )}

        {/* Contact */}
        {hasContact && (
          <Section icon={Users} title="Connect" subtitle="Reach out">
            <motion.div variants={item} className="flex flex-wrap gap-3">
              {p.linkedin && <ContactLink href={p.linkedin} icon={Linkedin} iconClass="text-primary" label="LinkedIn" />}
              {p.github && <ContactLink href={p.github} icon={Github} label="GitHub" />}
            </motion.div>
          </Section>
        )}

        {/* Coding profiles — bottom */}
        {connected.length > 0 && (
          <Section icon={Code2} title="Coding Profiles" subtitle="Synced from external platforms">
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
          </Section>
        )}

        {/* Empty state */}
        {connected.length === 0 && !hasAchievements && !hasContact && (
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
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <motion.div variants={item} whileHover={{ y: -4 }}
      className="rounded-xl bg-card border border-border px-3 py-3 text-center transition-shadow hover:shadow-lg hover:border-primary/30">
      <p className="text-xl font-bold font-serif text-foreground leading-none"><CountUp value={value} /></p>
      <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
    </motion.div>
  )
}

function Section({ icon: Icon, title, subtitle, children }: {
  icon: LucideIcon; title: string; subtitle?: string; children: ReactNode
}) {
  return (
    <motion.section {...reveal}>
      <motion.div variants={item} className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold font-serif text-foreground leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </motion.div>
      {children}
    </motion.section>
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

// Achievement chip — links to the public certificate verification page when a
// Fynity certificate has been issued for the completion.
function AchievementChip({ uid, className, children }: {
  uid?: string | null; className?: string; children: ReactNode
}) {
  if (!uid) return <Chip className={className}>{children}</Chip>
  return (
    <motion.a
      href={`/verify/${uid}`}
      target="_blank"
      rel="noopener noreferrer"
      title="View verified Fynity certificate"
      whileHover={{ scale: 1.06, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium text-foreground", className)}>
      {children}
      <ShieldCheck className="h-3.5 w-3.5 text-success/80" />
    </motion.a>
  )
}

function ContactLink({ href, icon: Icon, iconClass, label }: {
  href: string; icon: LucideIcon; iconClass?: string; label: string
}) {
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 350, damping: 18 }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors text-sm font-medium text-foreground">
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
