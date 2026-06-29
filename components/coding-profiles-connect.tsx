"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { IconTile, adminCardColor } from "@/components/admin-stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Code2, Loader2, RefreshCw, X, ExternalLink, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCodingProfilesStore } from "@/store/codingProfilesStore"
import type { LucideIcon } from "lucide-react"

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  github: Github,
  leetcode: Code2,
}

export function CodingProfilesConnect() {
  const {
    profiles, supported, loading, loaded, savingPlatform, refreshing,
    fetch, saveProfile, removeProfile, refresh,
  } = useCodingProfilesStore()
  const [inputs, setInputs] = useState<Record<string, string>>({})

  useEffect(() => { fetch() }, [fetch])

  const byPlatform = (p: string) => profiles.find((x) => x.platform === p)
  const enabled = supported.filter((s) => s.enabled)
  const comingSoon = supported.filter((s) => !s.enabled)
  const anyConnected = profiles.length > 0

  async function onConnect(platform: string, label: string) {
    const ok = await saveProfile(platform, label, inputs[platform] || "")
    if (ok) setInputs((p) => ({ ...p, [platform]: "" }))
  }

  if (loading && !loaded) {
    return (
      <GlassCard className="flex items-center gap-3 py-5">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading coding profiles…</span>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconTile icon={Code2} color={adminCardColor(0)} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold font-serif text-foreground">Coding Profiles</h3>
          <p className="text-xs text-muted-foreground">Connect your accounts — stats sync automatically and appear on your dashboard</p>
        </div>
        {anyConnected && (
          <Button size="sm" variant="outline" onClick={refresh} disabled={refreshing}
            className="border-primary/30 text-primary hover:bg-primary/10 gap-1.5">
            {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh
          </Button>
        )}
      </div>

      {/* One compact row per enabled platform */}
      <div className="space-y-2">
        {enabled.map((sp) => {
          const Icon = PLATFORM_ICONS[sp.platform] || Code2
          const profile = byPlatform(sp.platform)

          if (profile) {
            const ok = profile.sync_status === "ok"
            return (
              <div key={sp.platform}
                className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 px-3 py-2.5">
                <Icon className="h-4 w-4 text-foreground flex-shrink-0" />
                <span className="text-sm font-medium text-foreground flex-shrink-0">{sp.label}</span>
                <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", ok ? "bg-success" : "bg-danger")} />
                <a href={profile.profile_url || "#"} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-0.5 truncate">
                  @{profile.username} <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
                <span className="flex-1 min-w-0" />
                {!ok && (
                  <span className="text-[11px] text-warning truncate hidden sm:inline">
                    {profile.sync_error || "Sync failed"}
                  </span>
                )}
                <button onClick={() => removeProfile(sp.platform, sp.label)}
                  className="text-muted-foreground/50 hover:text-danger transition-colors flex-shrink-0" title="Disconnect">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          }

          return (
            <div key={sp.platform}
              className="flex flex-col sm:flex-row gap-2 sm:items-center rounded-xl border border-border bg-secondary/30 p-2.5">
              <div className="flex items-center gap-2 flex-1">
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium text-foreground w-20 flex-shrink-0">{sp.label}</span>
                <Input
                  placeholder={`your-${sp.platform}-username`}
                  value={inputs[sp.platform] || ""}
                  onChange={(e) => setInputs((p) => ({ ...p, [sp.platform]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && onConnect(sp.platform, sp.label)}
                  className="bg-background/60 h-9"
                />
              </div>
              <Button size="sm" onClick={() => onConnect(sp.platform, sp.label)}
                disabled={savingPlatform === sp.platform}
                className="bg-primary text-primary-foreground gap-1.5">
                {savingPlatform === sp.platform ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Connect
              </Button>
            </div>
          )
        })}
      </div>

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
