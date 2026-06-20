"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { IconTile } from "@/components/admin-stat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  RadioTower, RefreshCw, Loader2, CheckCircle2, XCircle,
  KeyRound, ChevronDown, ChevronUp, Save, Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

interface FetchConfig {
  enabled: boolean
  frequency_hours: number
  ttl_days: number
  providers: Record<string, boolean>
  queries: string[]
  locations: string[]
  last_run_at: string | null
  last_run_status: string | null
  last_run_stats: {
    fetched?: number; new?: number; updated?: number; expired?: number
    per_source?: Record<string, number>; errors?: Record<string, string>
  } | null
}

const PROVIDER_META: Record<string, { label: string; hint: string }> = {
  adzuna:    { label: "Adzuna",            hint: "India job boards · free" },
  jsearch:   { label: "JSearch (Google)", hint: "LinkedIn, Indeed, Naukri · RapidAPI" },
  jooble:    { label: "Jooble",           hint: "India aggregator · free" },
  remotive:  { label: "Remotive",         hint: "Remote tech · free" },
  arbeitnow: { label: "Arbeitnow",        hint: "Remote · free" },
  remoteok:  { label: "RemoteOK",         hint: "Remote tech · free" },
}

export function JobAggregatorPanel() {
  const [config, setConfig] = useState<FetchConfig | null>(null)
  const [providerKeys, setProviderKeys] = useState<Record<string, { has_keys: boolean }>>({})
  const [activeCount, setActiveCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [open, setOpen] = useState(false)

  // Local editable copies of the list fields (comma-separated text)
  const [queriesText, setQueriesText] = useState("")
  const [locationsText, setLocationsText] = useState("")

  function hydrate(cfg: FetchConfig) {
    setConfig(cfg)
    setQueriesText(cfg.queries.join(", "))
    setLocationsText(cfg.locations.join(", "))
  }

  useEffect(() => {
    api.get("/super-admin/jobs/config")
      .then((res) => {
        hydrate(res.data.config)
        setProviderKeys(res.data.providers || {})
        setActiveCount(res.data.active_external_jobs || 0)
      })
      .catch(() => toast.error("Failed to load aggregator config"))
      .finally(() => setLoading(false))
  }, [])

  function patch(part: Partial<FetchConfig>) {
    setConfig((c) => (c ? { ...c, ...part } : c))
  }

  async function handleSave() {
    if (!config) return
    setSaving(true)
    try {
      const body = {
        enabled: config.enabled,
        frequency_hours: config.frequency_hours,
        ttl_days: config.ttl_days,
        providers: config.providers,
        queries: queriesText.split(",").map((s) => s.trim()).filter(Boolean),
        locations: locationsText.split(",").map((s) => s.trim()).filter(Boolean),
      }
      const res = await api.put("/super-admin/jobs/config", body)
      hydrate(res.data.config)
      toast.success("Aggregator settings saved")
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  async function handleRefresh() {
    setRefreshing(true)
    try {
      await api.post("/super-admin/jobs/refresh")
      toast.success("Refresh queued — jobs will update shortly")
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Could not queue refresh (worker offline?)")
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <GlassCard className="flex items-center gap-3 py-5">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading job aggregator…</span>
      </GlassCard>
    )
  }
  if (!config) return null

  const stats = config.last_run_stats
  const lastRun = config.last_run_at ? new Date(config.last_run_at) : null

  return (
    <GlassCard className="overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <IconTile icon={RadioTower} color="#3D55C8" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold font-serif text-foreground">Auto Job Aggregator</h3>
            <span className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full",
              config.enabled ? "bg-success/15 text-success" : "bg-muted-foreground/15 text-muted-foreground",
            )}>
              {config.enabled ? "ON" : "OFF"}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {activeCount} live external jobs
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daily multi-source fetch (Adzuna, LinkedIn/Indeed via Google, Jooble, remote feeds)
          </p>
        </div>
        <Button
          size="sm" variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10 gap-1.5"
          onClick={handleRefresh} disabled={refreshing}
        >
          {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Refresh now
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen((v) => !v)} className="gap-1 text-muted-foreground">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {open ? "Hide" : "Settings"}
        </Button>
      </div>

      {/* Last run summary */}
      {(lastRun || stats) && (
        <div className="flex items-center gap-3 mt-3 flex-wrap text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            {config.last_run_status === "ok"
              ? <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              : config.last_run_status === "error"
              ? <XCircle className="h-3.5 w-3.5 text-danger" />
              : <Clock className="h-3.5 w-3.5" />}
            Last run: {lastRun ? lastRun.toLocaleString("en-IN") : "never"}
          </span>
          {stats && (
            <span>
              +{stats.new ?? 0} new · {stats.updated ?? 0} updated · {stats.expired ?? 0} expired · {stats.fetched ?? 0} fetched
            </span>
          )}
        </div>
      )}

      {/* Expandable settings */}
      {open && (
        <div className="mt-5 space-y-5 border-t border-border pt-5">
          {/* Master switches */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => patch({ enabled: !config.enabled })}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all",
                config.enabled ? "bg-success/15 border-success/40 text-success" : "border-border text-muted-foreground hover:bg-secondary/60",
              )}
            >
              <span>Auto-fetch {config.enabled ? "enabled" : "disabled"}</span>
              <span className={cn("w-9 h-5 rounded-full border-2 flex items-center px-0.5 transition-colors",
                config.enabled ? "bg-success border-success" : "border-border")}>
                <span className={cn("w-3.5 h-3.5 rounded-full bg-white transition-transform",
                  config.enabled ? "translate-x-4" : "translate-x-0")} />
              </span>
            </button>
            <div className="space-y-1.5">
              <Label className="text-xs">Frequency (hours)</Label>
              <Input type="number" min={1} max={168} value={config.frequency_hours}
                onChange={(e) => patch({ frequency_hours: Number(e.target.value) })}
                className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Job lifetime (days)</Label>
              <Input type="number" min={1} max={60} value={config.ttl_days}
                onChange={(e) => patch({ ttl_days: Number(e.target.value) })}
                className="bg-secondary/50" />
            </div>
          </div>

          {/* Providers */}
          <div>
            <Label className="text-xs">Sources</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {Object.keys(PROVIDER_META).map((name) => {
                const meta = PROVIDER_META[name]
                const on = !!config.providers[name]
                const hasKey = providerKeys[name]?.has_keys
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => patch({ providers: { ...config.providers, [name]: !on } })}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all",
                      on ? "bg-primary/10 border-primary/40" : "border-border hover:bg-secondary/60",
                    )}
                  >
                    <span className={cn("w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                      on ? "bg-primary border-primary" : "border-muted-foreground/40")}>
                      {on && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">{meta.label}</span>
                      <span className="block text-[11px] text-muted-foreground truncate">{meta.hint}</span>
                    </span>
                    <span className={cn(
                      "flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0",
                      hasKey ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
                    )}>
                      <KeyRound className="h-2.5 w-2.5" />
                      {hasKey ? "key ✓" : "no key"}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              A source runs only when it&apos;s checked here <em>and</em> its API key is set in the server <code>.env</code>.
            </p>
          </div>

          {/* Queries + locations */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Search queries (comma-separated)</Label>
              <Input value={queriesText} onChange={(e) => setQueriesText(e.target.value)}
                placeholder="software engineer, data analyst, intern…" className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Locations (comma-separated)</Label>
              <Input value={locationsText} onChange={(e) => setLocationsText(e.target.value)}
                placeholder="India, Bangalore, Hyderabad, Remote…" className="bg-secondary/50" />
            </div>
          </div>

          {/* Per-source last run */}
          {stats?.per_source && Object.keys(stats.per_source).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.per_source).map(([src, n]) => (
                <span key={src} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground">
                  {src}: {n}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save settings
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
