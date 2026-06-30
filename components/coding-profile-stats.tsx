"use client"

import { useEffect, type ReactNode } from "react"
import { SectionHeading, adminCardColor } from "@/components/admin-stat-card"
import {
  Github, Code2, Terminal, ExternalLink, Star, Users, FolderGit2, Trophy, Target, Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCodingProfilesStore, type CodingProfile } from "@/store/codingProfilesStore"
import type { LucideIcon } from "lucide-react"

// Per-platform brand identity — intentionally hardcoded brand colors (like the
// lab's per-language colors), not semantic tokens. Used for the card header band.
const PLATFORM_THEME: Record<string, { gradient: string; icon: LucideIcon; label: string }> = {
  github:     { gradient: "linear-gradient(135deg, #2b3137 0%, #57606a 100%)", icon: Github,   label: "GitHub" },
  leetcode:   { gradient: "linear-gradient(135deg, #ffa116 0%, #e8870b 100%)", icon: Code2,    label: "LeetCode" },
  hackerrank: { gradient: "linear-gradient(135deg, #00b74a 0%, #00892f 100%)", icon: Terminal, label: "HackerRank" },
}

/**
 * Display-only coding-profile stat cards. Renders a card per connected platform.
 * Connect / disconnect lives in <CodingProfilesConnect />. Returns null when
 * nothing is connected, so it's safe to mount unconditionally.
 */
export function CodingProfileStats({ withHeading = false, singleRow = false }: {
  withHeading?: boolean
  /** Lay all connected cards out in one auto-sized row (dashboard). Default: 2-up grid. */
  singleRow?: boolean
}) {
  const { profiles, fetch } = useCodingProfilesStore()
  useEffect(() => { fetch() }, [fetch])

  const connected = profiles.filter((p) => p.sync_status === "ok" && p.stats)
  if (connected.length === 0) return null

  return (
    <div className="space-y-3">
      {withHeading && (
        <SectionHeading icon={Code2} color={adminCardColor(3)}
          title="Coding Profiles" subtitle="Your external coding stats, synced automatically" />
      )}
      <div className={cn(singleRow ? "flex flex-col lg:flex-row gap-4" : "grid grid-cols-1 lg:grid-cols-2 gap-4")}>
        {connected.map((p) => (
          <div key={p.platform} className={cn(singleRow && "flex-1 min-w-0")}>
            {p.platform === "github" ? <GithubStatsCard profile={p} />
            : p.platform === "leetcode" ? <LeetcodeStatsCard profile={p} />
            : p.platform === "hackerrank" ? <HackerrankStatsCard profile={p} />
            : null}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Shared shell: colored brand header band + neutral body ────────────────── */
function StatCardShell({ platform, title, username, profileUrl, subtitle, avatarUrl, children }: {
  platform: string
  title: string
  username: string
  profileUrl: string
  subtitle?: string | null
  avatarUrl?: string | null
  children: ReactNode
}) {
  const theme = PLATFORM_THEME[platform]
  const Icon = theme?.icon ?? Code2
  return (
    <div className="h-full rounded-2xl border border-border bg-card overflow-hidden flex flex-col shadow-sm">
      {/* Brand-colored header — fixed height so all cards align */}
      <div className="relative px-4 min-h-[88px] flex items-center" style={{ background: theme?.gradient }}>
        {/* Corner logo doubles as a redirect link to the profile */}
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" title={`Open ${platform} profile`}
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
      {/* Neutral body */}
      <div className="p-4 space-y-3 flex-1">{children}</div>
    </div>
  )
}

/* Shared 3-tile stat row */
function StatTiles({ tiles }: { tiles: { icon: LucideIcon; label: string; value: number | null }[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {tiles.map((m) => (
        <div key={m.label} className="rounded-lg bg-background/50 border border-border/60 px-3 py-2 text-center">
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

/* ── GitHub ───────────────────────────────────────────────────────────────── */
function GithubStatsCard({ profile }: { profile: CodingProfile }) {
  const s = profile.stats!
  return (
    <StatCardShell platform="github" title={s.name || profile.username} username={profile.username}
      profileUrl={profile.profile_url || `https://github.com/${profile.username}`}
      subtitle={s.bio} avatarUrl={s.avatar_url}>
      <StatTiles tiles={[
        { icon: FolderGit2, label: "Repos", value: s.public_repos ?? 0 },
        { icon: Star,       label: "Stars", value: s.total_stars ?? 0 },
        { icon: Users,      label: "Followers", value: s.followers ?? 0 },
      ]} />

      {!!s.top_languages?.length && (
        <div className="flex flex-wrap gap-1.5">
          {s.top_languages.map((l) => (
            <span key={l} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{l}</span>
          ))}
        </div>
      )}

      {!!s.top_repos?.length && (
        <div className="space-y-1.5">
          {s.top_repos.slice(0, 3).map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 text-xs rounded-lg px-2.5 py-1.5 hover:bg-secondary/50 transition-colors group">
              <span className="flex items-center gap-1.5 min-w-0">
                <FolderGit2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground truncate group-hover:text-primary">{r.name}</span>
                {r.language && <span className="text-muted-foreground flex-shrink-0">· {r.language}</span>}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                <Star className="h-3 w-3" /> {r.stars}
              </span>
            </a>
          ))}
        </div>
      )}
    </StatCardShell>
  )
}

/* ── LeetCode ─────────────────────────────────────────────────────────────── */
function LeetcodeStatsCard({ profile }: { profile: CodingProfile }) {
  const s = profile.stats!
  const diffs = [
    { label: "Easy",   solved: s.easy_solved ?? 0,   total: s.easy_total ?? 0,   color: "bg-success" },
    { label: "Medium", solved: s.medium_solved ?? 0, total: s.medium_total ?? 0, color: "bg-warning" },
    { label: "Hard",   solved: s.hard_solved ?? 0,   total: s.hard_total ?? 0,   color: "bg-danger" },
  ]
  return (
    <StatCardShell platform="leetcode" title={s.name || profile.username} username={profile.username}
      profileUrl={profile.profile_url || `https://leetcode.com/${profile.username}/`}
      subtitle={s.country} avatarUrl={s.avatar_url}>
      <StatTiles tiles={[
        { icon: Target, label: "Solved", value: s.total_solved ?? 0 },
        { icon: Users,  label: "Ranking", value: s.ranking ?? 0 },
        { icon: Trophy, label: "Contest", value: s.contest_rating ?? null },
      ]} />

      <div className="space-y-2">
        {diffs.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-14 flex-shrink-0">{d.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className={cn("h-full rounded-full", d.color)}
                style={{ width: d.total ? `${Math.min(100, (d.solved / d.total) * 100)}%` : "0%" }} />
            </div>
            <span className="text-[11px] font-medium text-foreground flex-shrink-0 w-16 text-right tabular-nums">
              {d.solved} / {d.total}
            </span>
          </div>
        ))}
      </div>
    </StatCardShell>
  )
}

/* ── HackerRank ───────────────────────────────────────────────────────────── */
function HackerrankStatsCard({ profile }: { profile: CodingProfile }) {
  const s = profile.stats!
  const badges = s.badges ?? []
  const subtitle = [s.level ? `Lvl ${s.level}` : null, s.country].filter(Boolean).join(" · ")
  return (
    <StatCardShell platform="hackerrank" title={s.name || profile.username} username={profile.username}
      profileUrl={profile.profile_url || `https://www.hackerrank.com/profile/${profile.username}`}
      subtitle={subtitle} avatarUrl={s.avatar_url}>
      <StatTiles tiles={[
        { icon: Star,  label: "Total Stars", value: s.total_stars ?? 0 },
        { icon: Award, label: "Badges", value: badges.length },
        { icon: Users, label: "Followers", value: s.followers ?? 0 },
      ]} />

      {!!badges.length && (
        <div className="space-y-1.5">
          {badges.slice(0, 6).map((b) => (
            <div key={b.name} className="flex items-center gap-2 text-xs rounded-lg px-2.5 py-1.5 bg-secondary/30">
              <span className="text-foreground truncate flex-1 min-w-0">{b.name}</span>
              <span className="flex items-center gap-0.5 text-warning flex-shrink-0">
                {Array.from({ length: Math.min(b.stars, 5) }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-warning" />
                ))}
                {b.stars > 5 && <span className="text-[10px] ml-0.5">+{b.stars - 5}</span>}
              </span>
              <span className="text-muted-foreground flex-shrink-0 w-16 text-right tabular-nums">{b.solved}/{b.total}</span>
            </div>
          ))}
        </div>
      )}
    </StatCardShell>
  )
}
