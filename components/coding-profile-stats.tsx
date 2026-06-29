"use client"

import { useEffect } from "react"
import { GlassCard } from "@/components/glass-card"
import { SectionHeading, adminCardColor } from "@/components/admin-stat-card"
import {
  Github, Code2, Terminal, ExternalLink, Star, Users, FolderGit2, Trophy, Target, Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCodingProfilesStore, type CodingProfile } from "@/store/codingProfilesStore"

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

/* ── GitHub ───────────────────────────────────────────────────────────────── */
function GithubStatsCard({ profile }: { profile: CodingProfile }) {
  const s = profile.stats!
  return (
    <GlassCard className="space-y-0 h-full">
      <div className="flex items-start gap-3">
        {s.avatar_url
          ? <img src={s.avatar_url} alt="" className="w-12 h-12 rounded-full ring-1 ring-border flex-shrink-0" />
          : <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><Github className="h-5 w-5 text-muted-foreground" /></div>}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{s.name || profile.username}</p>
          <a href={profile.profile_url || `https://github.com/${profile.username}`} target="_blank" rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-0.5 text-xs">
            @{profile.username} <ExternalLink className="h-3 w-3" />
          </a>
          {s.bio && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{s.bio}</p>}
        </div>
        <Github className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { icon: FolderGit2, label: "Repos", value: s.public_repos ?? 0 },
          { icon: Star,       label: "Stars", value: s.total_stars ?? 0 },
          { icon: Users,      label: "Followers", value: s.followers ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg bg-background/50 border border-border/60 px-3 py-2 text-center">
            <m.icon className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
            <p className="text-base font-bold font-serif text-foreground leading-none">{m.value.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {!!s.top_languages?.length && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {s.top_languages.map((l) => (
            <span key={l} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{l}</span>
          ))}
        </div>
      )}

      {!!s.top_repos?.length && (
        <div className="mt-3 space-y-1.5">
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
    </GlassCard>
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
    <GlassCard className="space-y-0 h-full">
      <div className="flex items-start gap-3">
        {s.avatar_url
          ? <img src={s.avatar_url} alt="" className="w-12 h-12 rounded-full ring-1 ring-border flex-shrink-0" />
          : <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><Code2 className="h-5 w-5 text-muted-foreground" /></div>}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{s.name || profile.username}</p>
          <a href={profile.profile_url || `https://leetcode.com/${profile.username}/`} target="_blank" rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-0.5 text-xs">
            @{profile.username} <ExternalLink className="h-3 w-3" />
          </a>
          {s.country && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{s.country}</p>}
        </div>
        <Code2 className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { icon: Target, label: "Solved", value: s.total_solved ?? 0 },
          { icon: Users,  label: "Ranking", value: s.ranking ?? 0 },
          { icon: Trophy, label: "Contest", value: s.contest_rating ?? null },
        ].map((m) => (
          <div key={m.label} className="rounded-lg bg-background/50 border border-border/60 px-3 py-2 text-center">
            <m.icon className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
            <p className="text-base font-bold font-serif text-foreground leading-none">
              {m.value === null ? "—" : m.value.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-2">
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
    </GlassCard>
  )
}

/* ── HackerRank ───────────────────────────────────────────────────────────── */
function HackerrankStatsCard({ profile }: { profile: CodingProfile }) {
  const s = profile.stats!
  const badges = s.badges ?? []
  const subtitle = [s.level ? `Lvl ${s.level}` : null, s.country].filter(Boolean).join(" · ")
  return (
    <GlassCard className="space-y-0 h-full">
      <div className="flex items-start gap-3">
        {s.avatar_url
          ? <img src={s.avatar_url} alt="" className="w-12 h-12 rounded-full ring-1 ring-border flex-shrink-0" />
          : <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><Terminal className="h-5 w-5 text-muted-foreground" /></div>}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{s.name || profile.username}</p>
          <a href={profile.profile_url || `https://www.hackerrank.com/profile/${profile.username}`} target="_blank" rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-0.5 text-xs">
            @{profile.username} <ExternalLink className="h-3 w-3" />
          </a>
          {subtitle && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{subtitle}</p>}
        </div>
        <Terminal className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { icon: Star,   label: "Total Stars", value: s.total_stars ?? 0 },
          { icon: Award,  label: "Badges", value: badges.length },
          { icon: Users,  label: "Followers", value: s.followers ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg bg-background/50 border border-border/60 px-3 py-2 text-center">
            <m.icon className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
            <p className="text-base font-bold font-serif text-foreground leading-none">{m.value.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {!!badges.length && (
        <div className="mt-3 space-y-1.5">
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
    </GlassCard>
  )
}
