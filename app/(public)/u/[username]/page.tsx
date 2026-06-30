import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  Github, Linkedin, Code2, Terminal, ExternalLink, Star, Users, FolderGit2,
  Trophy, Target, Award, Flame, GraduationCap, BadgeCheck, MapPin,
} from "lucide-react"
import { getLevel } from "@/lib/levels"

// Always render fresh so profile edits / synced stats show instantly (no ISR cache).
export const dynamic = "force-dynamic"

// ─── Types (mirror /api/public/profile/<username>) ──────────────────────────
interface CodingStats {
  name?: string | null; avatar_url?: string | null; bio?: string | null
  country?: string | null; school?: string | null; level?: number | null
  public_repos?: number; followers?: number; total_stars?: number
  top_languages?: string[]
  top_repos?: { name: string; stars: number; language: string | null; url: string }[]
  ranking?: number | null; total_solved?: number
  easy_solved?: number; easy_total?: number
  medium_solved?: number; medium_total?: number
  hard_solved?: number; hard_total?: number
  contest_rating?: number | null
  badges?: { name: string; stars: number; solved: number; total: number }[]
}
interface CodingProfile {
  platform: string; username: string; profile_url: string | null; stats: CodingStats | null
}
interface Achievement { title: string; icon_color: string | null; completed_at: string | null }
interface PublicProfile {
  username: string; name: string; avatar: string | null
  branch: string | null; passout_year: number | null
  college_name: string | null; college_logo_url: string | null
  points: number; streak: number; longest_streak: number
  linkedin: string | null; github: string | null
  coding_profiles: CodingProfile[]
  completed_courses: Achievement[]
  completed_domains: Achievement[]
}

// ─── Data fetching ──────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
const ORIGIN = API.replace(/\/api$/, "")

/** Resolve possibly-relative media paths (avatars, logos) against the API origin. */
function media(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (/^https?:\/\//.test(url)) return url
  return `${ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`
}

async function getProfile(username: string): Promise<PublicProfile | null> {
  try {
    const res = await fetch(`${API}/public/profile/${encodeURIComponent(username)}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return (await res.json()) as PublicProfile
  } catch {
    return null
  }
}

// ─── SEO ────────────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  const { username } = await params
  const p = await getProfile(username)
  if (!p) return { title: "Profile not found · CareerEzi" }

  const title = `${p.name} · CareerEzi`
  const bits = [p.branch, p.college_name].filter(Boolean).join(" · ")
  const description = bits
    ? `${p.name} — ${bits}. View coding stats, achievements and contact on CareerEzi.`
    : `${p.name}'s placement portfolio on CareerEzi.`
  const image = media(p.avatar)

  return {
    title,
    description,
    openGraph: {
      title, description, type: "profile",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary", title, description, images: image ? [image] : undefined },
  }
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function PublicProfilePage(
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const p = await getProfile(username)
  if (!p) notFound()

  const level = getLevel(p.points)
  const connected = p.coding_profiles.filter((c) => c.stats)
  const hasAchievements = p.completed_domains.length > 0 || p.completed_courses.length > 0
  const hasContact = !!(p.linkedin || p.github)
  const initials = p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen bg-background">
      {/* Ambient gradient header band */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute -top-16 right-0 w-80 h-80 rounded-full bg-coding/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary/15 border-2 border-primary/40 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
              {p.avatar
                ? <img src={media(p.avatar)} alt={p.name} className="w-full h-full object-cover" />
                : <span className="text-3xl font-bold font-serif text-primary">{initials}</span>}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold font-serif text-foreground">{p.name}</h1>
              <p className="text-sm text-muted-foreground">@{p.username}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
                {p.branch && <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{p.branch}</span>}
                {p.college_name && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.college_name}</span>}
                {p.passout_year && <span>Batch {p.passout_year}</span>}
              </div>
            </div>

            {/* Level + streak chips */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium ${level.color}`}>
                {level.emoji} {level.name}
              </span>
              {p.longest_streak > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-streak/10 border border-streak/20 text-sm font-medium text-streak">
                  <Flame className="h-3.5 w-3.5" /> {p.longest_streak}d
                </span>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-8 max-w-md mx-auto sm:mx-0">
            <Stat label="Points" value={p.points.toLocaleString()} />
            <Stat label="Verified Tracks" value={String(p.completed_domains.length + p.completed_courses.length)} />
            <Stat label="Day Streak" value={String(p.streak)} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 space-y-8">
        {/* Coding profiles */}
        {connected.length > 0 && (
          <Section icon={Code2} title="Coding Profiles" subtitle="Synced from external platforms">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {connected.map((c) => (
                <div key={c.platform}>
                  {c.platform === "github" ? <GithubCard p={c} />
                  : c.platform === "leetcode" ? <LeetcodeCard p={c} />
                  : c.platform === "hackerrank" ? <HackerrankCard p={c} />
                  : null}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* CareerEzi achievements */}
        {hasAchievements && (
          <Section icon={BadgeCheck} title="CareerEzi Achievements" subtitle="Verified learning milestones">
            {p.completed_domains.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Domains Completed</p>
                <div className="flex flex-wrap gap-2">
                  {p.completed_domains.map((d) => (
                    <span key={d.title} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coding/10 border border-coding/20 text-sm font-medium text-foreground">
                      <Trophy className="h-3.5 w-3.5 text-coding" /> {d.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {p.completed_courses.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Courses Completed</p>
                <div className="flex flex-wrap gap-2">
                  {p.completed_courses.map((c) => (
                    <span key={c.title} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/40 border border-border text-sm font-medium text-foreground">
                      <BadgeCheck className="h-3.5 w-3.5 text-success" /> {c.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Contact */}
        {hasContact && (
          <Section icon={Users} title="Connect" subtitle="Reach out">
            <div className="flex flex-wrap gap-3">
              {p.linkedin && (
                <a href={p.linkedin} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors text-sm font-medium text-foreground">
                  <Linkedin className="h-4 w-4 text-primary" /> LinkedIn <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors text-sm font-medium text-foreground">
                  <Github className="h-4 w-4" /> GitHub <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}
            </div>
          </Section>
        )}

        {/* Empty state when nothing public-worthy yet */}
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
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card border border-border px-3 py-3 text-center">
      <p className="text-xl font-bold font-serif text-foreground leading-none">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

function Section({ icon: Icon, title, subtitle, children }: {
  icon: typeof Code2; title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold font-serif text-foreground leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

const PLATFORM_THEME: Record<string, { gradient: string; icon: typeof Code2 }> = {
  github:     { gradient: "linear-gradient(135deg, #2b3137 0%, #57606a 100%)", icon: Github },
  leetcode:   { gradient: "linear-gradient(135deg, #ffa116 0%, #e8870b 100%)", icon: Code2 },
  hackerrank: { gradient: "linear-gradient(135deg, #00b74a 0%, #00892f 100%)", icon: Terminal },
}

function CardShell({ platform, title, username, profileUrl, subtitle, avatarUrl, children }: {
  platform: string; title: string; username: string; profileUrl: string
  subtitle?: string | null; avatarUrl?: string | null; children: React.ReactNode
}) {
  const theme = PLATFORM_THEME[platform]
  const Icon = theme?.icon ?? Code2
  return (
    <div className="h-full rounded-2xl border border-border bg-card overflow-hidden flex flex-col shadow-sm">
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

function Tiles({ tiles }: { tiles: { icon: typeof Code2; label: string; value: number | null }[] }) {
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
              <div className={`h-full rounded-full ${d.color}`}
                style={{ width: d.total ? `${Math.min(100, (d.solved / d.total) * 100)}%` : "0%" }} />
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
