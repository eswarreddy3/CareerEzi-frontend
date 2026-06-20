"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { IconTile, adminCardColor } from "@/components/admin-stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Github, Loader2, RefreshCw, X, ExternalLink, Star, Users, FolderGit2, Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

interface GithubStats {
  name?: string | null
  avatar_url?: string | null
  bio?: string | null
  public_repos?: number
  followers?: number
  following?: number
  total_stars?: number
  top_languages?: string[]
  top_repos?: { name: string; stars: number; language: string | null; url: string }[]
}
interface Profile {
  platform: string
  username: string
  profile_url: string | null
  stats: GithubStats | null
  sync_status: string | null
  sync_error: string | null
  last_synced_at: string | null
}
interface Supported {
  platform: string
  label: string
  official: boolean
  enabled: boolean
}

export function CodingProfilesCard() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [supported, setSupported] = useState<Supported[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    api.get("/student/coding-profiles")
      .then((res) => { setProfiles(res.data.profiles); setSupported(res.data.supported) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const github = profiles.find((p) => p.platform === "github")
  const comingSoon = supported.filter((s) => !s.enabled)

  async function saveGithub() {
    const username = input.trim().replace(/^@/, "")
    if (!username) return
    setSaving(true)
    try {
      const res = await api.put("/student/coding-profiles", { platform: "github", username })
      setProfiles((prev) => {
        const others = prev.filter((p) => p.platform !== "github")
        return [...others, res.data.profile]
      })
      setInput("")
      if (res.data.warning) toast.error(res.data.warning)
      else toast.success("GitHub connected")
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function refresh() {
    setRefreshing(true)
    try {
      const res = await api.post("/student/coding-profiles/refresh")
      setProfiles(res.data.profiles)
      toast.success("Profiles refreshed")
    } catch {
      toast.error("Failed to refresh")
    } finally {
      setRefreshing(false)
    }
  }

  async function remove() {
    try {
      await api.delete("/student/coding-profiles/github")
      setProfiles((prev) => prev.filter((p) => p.platform !== "github"))
      toast.success("GitHub disconnected")
    } catch {
      toast.error("Failed to remove")
    }
  }

  if (loading) {
    return (
      <GlassCard className="flex items-center gap-3 py-5">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading coding profiles…</span>
      </GlassCard>
    )
  }

  const s = github?.stats
  const connected = !!github && github.sync_status === "ok" && !!s

  return (
    <GlassCard className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconTile icon={Github} color={adminCardColor(0)} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold font-serif text-foreground">Coding Profiles</h3>
          <p className="text-xs text-muted-foreground">Connect your accounts — stats stay in sync automatically</p>
        </div>
        {github && (
          <Button size="sm" variant="outline" onClick={refresh} disabled={refreshing}
            className="border-primary/30 text-primary hover:bg-primary/10 gap-1.5">
            {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh
          </Button>
        )}
      </div>

      {/* GitHub */}
      {!github ? (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center rounded-xl border border-border bg-secondary/30 p-3">
          <div className="flex items-center gap-2 flex-1">
            <Github className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="your-github-username"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveGithub()}
              className="bg-background/60 h-9"
            />
          </div>
          <Button size="sm" onClick={saveGithub} disabled={saving} className="bg-primary text-primary-foreground gap-1.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Connect GitHub
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-secondary/20 p-4">
          <div className="flex items-start gap-3">
            {s?.avatar_url
              ? <img src={s.avatar_url} alt="" className="w-12 h-12 rounded-full ring-1 ring-border flex-shrink-0" />
              : <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><Github className="h-5 w-5 text-muted-foreground" /></div>}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground truncate">{s?.name || github.username}</p>
                <a href={github.profile_url || `https://github.com/${github.username}`} target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-0.5 text-xs">
                  @{github.username} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              {s?.bio && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{s.bio}</p>}
            </div>
            <button onClick={remove} className="text-muted-foreground/50 hover:text-danger transition-colors" title="Disconnect">
              <X className="h-4 w-4" />
            </button>
          </div>

          {connected ? (
            <>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { icon: FolderGit2, label: "Repos", value: s?.public_repos ?? 0 },
                  { icon: Star,       label: "Stars", value: s?.total_stars ?? 0 },
                  { icon: Users,      label: "Followers", value: s?.followers ?? 0 },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-background/50 border border-border/60 px-3 py-2 text-center">
                    <m.icon className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
                    <p className="text-base font-bold font-serif text-foreground leading-none">{m.value.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>

              {!!s?.top_languages?.length && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {s.top_languages.map((l) => (
                    <span key={l} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{l}</span>
                  ))}
                </div>
              )}

              {!!s?.top_repos?.length && (
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
            </>
          ) : (
            <p className="text-xs text-warning mt-3">{github.sync_error || "Couldn't load stats — try refresh."}</p>
          )}
        </div>
      )}

      {/* Coming soon */}
      {comingSoon.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-muted-foreground">Coming soon:</span>
          {comingSoon.map((p) => (
            <span key={p.platform} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border">
              {p.label}
            </span>
          ))}
        </div>
      )}
    </GlassCard>
  )
}
