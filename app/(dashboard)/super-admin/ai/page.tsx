"use client"

/**
 * Saarthi Control — the super-admin AI console.
 *
 * Built as a telemetry console rather than a settings form, because the job it
 * does is watching spend and being able to stop it instantly:
 *   - Saarthi's own mood is the status light (calm / concerned / asleep)
 *   - Budget is an arc gauge wrapped around her, not a flat progress bar
 *   - Numbers are mono, aligned, and never lie about precision
 *   - The kill switch is hold-to-fire, so it cannot be hit by accident
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity, AlertTriangle, BadgeIndianRupee, Ban, Bot, CheckCircle2, Coins,
  Database, Gauge, KeyRound, Loader2, MessageSquareText, Power, RefreshCw,
  Save, ShieldAlert, Sparkles, TrendingUp, Users, Zap,
} from "lucide-react"
import { toast } from "sonner"

import { GlassCard } from "@/components/glass-card"
import { SaarthiOrb, healthMood } from "@/components/saarthi/orb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

// ─── Types ───────────────────────────────────────────────────────────────────
interface PackConfig {
  enabled: boolean
  model: string
  report_model?: string
  daily_refresh_quota?: number
  daily_session_quota?: number
  turns?: number
  max_output_tokens?: number
}
interface Pack {
  key: string
  label: string
  config: PackConfig
  colleges_granted: number
  month_spend_usd: number
  month_calls: number
}
interface AIConfig {
  enabled: boolean
  monthly_budget_usd: number
  soft_alert_pct: number
  current_month: string | null
  current_month_spend_usd: number
  spend_pct: number
  budget_remaining_usd: number
  kill_switch_reason: string | null
  last_flush_at: string | null
  history: { month: string; spend_usd: number }[]
}
interface Usage {
  total_calls: number
  total_cost_usd: number
  by_status: Record<string, number>
  daily: { date: string; cost_usd: number; calls: number }[]
  top_users: { user_id: number; name: string; calls: number; cost_usd: number }[]
  cache: {
    response_hits: number
    response_hit_rate: number
    prompt_tokens: number
    prompt_cached_tokens: number
    prompt_cache_rate: number
  }
}

const PACK_ICON: Record<string, typeof Bot> = {
  ai_coach: Sparkles,
  mock_interview: MessageSquareText,
}

const USD_TO_INR = 88 // display only — billing is in USD

const money = (v: number) => `$${(v ?? 0).toFixed(v < 1 ? 4 : 2)}`
const inr = (v: number) => `₹${Math.round((v ?? 0) * USD_TO_INR).toLocaleString("en-IN")}`

// ─── Budget arc ──────────────────────────────────────────────────────────────
/** A 240° arc gauge. Reads as a fuel/burn dial rather than a loading bar. */
function BudgetArc({ pct, tone, children }: { pct: number; tone: string; children: React.ReactNode }) {
  const R = 86
  const SWEEP = 240
  const START = 150
  const clamped = Math.max(0, Math.min(100, pct))
  const circumference = 2 * Math.PI * R
  const arcLen = (SWEEP / 360) * circumference

  return (
    <div className="relative grid place-items-center" style={{ width: 208, height: 208 }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90" width="208" height="208">
        <circle
          cx="100" cy="100" r={R} fill="none" strokeWidth="9" strokeLinecap="round"
          stroke="var(--border)"
          strokeDasharray={`${arcLen} ${circumference}`}
          transform={`rotate(${START} 100 100)`}
        />
        <motion.circle
          cx="100" cy="100" r={R} fill="none" strokeWidth="9" strokeLinecap="round"
          stroke={tone}
          strokeDasharray={`${arcLen} ${circumference}`}
          transform={`rotate(${START} 100 100)`}
          initial={{ strokeDashoffset: arcLen }}
          animate={{ strokeDashoffset: arcLen - (arcLen * clamped) / 100 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${tone})` }}
        />
      </svg>
      {children}
    </div>
  )
}

// ─── Hold-to-fire kill switch ────────────────────────────────────────────────
/** Stopping every student's AI mid-session deserves more than a click. */
function HoldToKill({ onFire, disabled }: { onFire: () => void; disabled?: boolean }) {
  const [progress, setProgress] = useState(0)
  const raf = useRef<number>(0)
  const start = useRef(0)
  const HOLD_MS = 1200

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current)
    raf.current = 0
    setProgress(0)
  }, [])

  const tick = useCallback(() => {
    const elapsed = Date.now() - start.current
    const p = Math.min(100, (elapsed / HOLD_MS) * 100)
    setProgress(p)
    if (p >= 100) {
      stop()
      onFire()
      return
    }
    raf.current = requestAnimationFrame(tick)
  }, [onFire, stop])

  const begin = () => {
    if (disabled) return
    start.current = Date.now()
    raf.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={begin}
      onPointerUp={stop}
      onPointerLeave={stop}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") begin() }}
      onKeyUp={stop}
      className={cn(
        "relative w-full overflow-hidden rounded-xl border px-4 py-3 text-sm font-semibold",
        "select-none transition-colors touch-none",
        disabled
          ? "cursor-not-allowed border-border text-muted-foreground opacity-60"
          : "border-danger/40 text-danger hover:bg-danger/10",
      )}
    >
      <span
        className="absolute inset-y-0 left-0 bg-danger/25 transition-none"
        style={{ width: `${progress}%` }}
        aria-hidden
      />
      <span className="relative flex items-center justify-center gap-2">
        <Ban className="h-4 w-4" />
        {progress > 0 ? "Keep holding to stop all AI…" : "Hold to stop all AI"}
      </span>
    </button>
  )
}

// ─── Telemetry tile ──────────────────────────────────────────────────────────
function Tile({
  icon: Icon, label, value, sub, tone = "text-foreground",
}: { icon: typeof Zap; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className={cn("mt-1.5 font-mono text-lg font-semibold tabular-nums", tone)}>{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  )
}

// ─── Sparkline ───────────────────────────────────────────────────────────────
function Spark({ data }: { data: { date: string; cost_usd: number }[] }) {
  if (!data.length) {
    return (
      <div className="grid h-24 place-items-center text-xs text-muted-foreground">
        No spend recorded yet
      </div>
    )
  }
  const max = Math.max(...data.map((d) => d.cost_usd), 0.0001)
  const pts = data.map((d, i) => {
    const x = data.length === 1 ? 100 : (i / (data.length - 1)) * 100
    return `${x},${40 - (d.cost_usd / max) * 34}`
  })
  return (
    <svg viewBox="0 0 100 42" preserveAspectRatio="none" className="h-24 w-full">
      <defs>
        <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,42 ${pts.join(" ")} 100,42`} fill="url(#sparkfill)" />
      <polyline
        points={pts.join(" ")} fill="none" stroke="var(--primary)"
        strokeWidth="1.4" vectorEffect="non-scaling-stroke"
        strokeLinejoin="round" strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function SaarthiControlPage() {
  const [cfg, setCfg] = useState<AIConfig | null>(null)
  const [packs, setPacks] = useState<Pack[]>([])
  const [usage, setUsage] = useState<Usage | null>(null)
  const [keyConfigured, setKeyConfigured] = useState(false)
  const [dryRun, setDryRun] = useState(false)
  const [killed, setKilled] = useState(false)
  const [totalColleges, setTotalColleges] = useState(0)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [budgetText, setBudgetText] = useState("")
  const [dirty, setDirty] = useState(false)

  const hydrate = useCallback((d: any) => {
    setCfg(d.config)
    setPacks(d.packs ?? [])
    if (typeof d.key_configured === "boolean") setKeyConfigured(d.key_configured)
    if (typeof d.dry_run === "boolean") setDryRun(d.dry_run)
    if (typeof d.killed === "boolean") setKilled(d.killed)
    if (typeof d.total_colleges === "number") setTotalColleges(d.total_colleges)
    setBudgetText(String(d.config?.monthly_budget_usd ?? ""))
    setDirty(false)
  }, [])

  const load = useCallback(async () => {
    try {
      const [c, u] = await Promise.all([
        api.get("/super-admin/ai/config"),
        api.get("/super-admin/ai/usage?days=30"),
      ])
      hydrate(c.data)
      setUsage(u.data)
    } catch {
      toast.error("Could not load Saarthi settings")
    } finally {
      setLoading(false)
    }
  }, [hydrate])

  useEffect(() => { load() }, [load])

  async function save(patch: Record<string, any>) {
    setSaving(true)
    try {
      const { data } = await api.put("/super-admin/ai/config", patch)
      hydrate({ ...data, key_configured: keyConfigured, dry_run: dryRun, total_colleges: totalColleges })
      toast.success("Saved")
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Could not save")
    } finally {
      setSaving(false)
    }
  }

  async function fireKill() {
    try {
      await api.post("/super-admin/ai/kill", { reason: "stopped manually by super admin" })
      toast.success("All AI stopped")
      load()
    } catch { toast.error("Could not stop AI") }
  }

  async function resume() {
    try {
      await api.post("/super-admin/ai/resume")
      toast.success("Saarthi is back online")
      load()
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Could not resume")
    }
  }

  function patchPack(key: string, patch: Partial<PackConfig>) {
    setPacks((prev) => prev.map((p) => (p.key === key ? { ...p, config: { ...p.config, ...patch } } : p)))
    setDirty(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-52 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      </div>
    )
  }

  const pct = cfg?.spend_pct ?? 0
  const live = !!cfg?.enabled && keyConfigured && !killed
  const mood = healthMood({ killed, enabled: cfg?.enabled, configured: keyConfigured, spendPct: pct })
  const tone = pct >= 100 ? "var(--danger)" : pct >= (cfg?.soft_alert_pct ?? 80) ? "var(--warning)" : "var(--primary)"
  const grantedAny = packs.reduce((n, p) => n + p.colleges_granted, 0)
  const promptCacheBroken = (usage?.cache.prompt_tokens ?? 0) > 20000 && (usage?.cache.prompt_cache_rate ?? 0) === 0

  return (
    <div className="space-y-5">
      {/* ── Hero: Saarthi as the status light ─────────────────────────────── */}
      <GlassCard className="overflow-hidden p-0">
        <div className="flex flex-col gap-6 p-5 md:flex-row md:items-center md:p-7">
          <div className="relative mx-auto shrink-0">
            <BudgetArc pct={pct} tone={tone}>
              <SaarthiOrb mood={mood} size={118} />
            </BudgetArc>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl font-bold">Saarthi</h1>
              <span className={cn("chip", live ? "chip-success" : "chip-danger")}>
                {live ? "Online" : killed ? "Stopped" : !keyConfigured ? "No API key" : "Off"}
              </span>
              {dryRun && <span className="chip chip-warning">Dry run — no spend</span>}
            </div>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {!keyConfigured
                ? "No OPENAI_API_KEY is set on the server, so every AI pack reports itself unavailable. The platform runs normally without it."
                : killed
                ? cfg?.kill_switch_reason ?? "AI is stopped."
                : grantedAny === 0
                ? "Running, but no college has been granted a pack yet — so no student can see AI. Grant access from Colleges → Manage Access."
                : `Guiding students at ${grantedAny} college${grantedAny === 1 ? "" : "s"}.`}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Tile icon={Coins} label="Spent" value={money(cfg?.current_month_spend_usd ?? 0)}
                    sub={inr(cfg?.current_month_spend_usd ?? 0)} />
              <Tile icon={Gauge} label="Of budget" value={`${pct.toFixed(1)}%`}
                    sub={`${money(cfg?.budget_remaining_usd ?? 0)} left`}
                    tone={pct >= 80 ? "text-warning" : "text-foreground"} />
              <Tile icon={Activity} label="Calls (30d)" value={(usage?.total_calls ?? 0).toLocaleString()} />
              <Tile icon={Users} label="Licensed" value={`${grantedAny}`}
                    sub={`of ${totalColleges} colleges`} />
            </div>
          </div>
        </div>

        {/* Spend trend, edge to edge */}
        <div className="border-t border-border/60 bg-card/40 px-5 pb-3 pt-4 md:px-7">
          <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
            <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Daily spend · 30 days</span>
            <span className="font-mono">{money(usage?.total_cost_usd ?? 0)} total</span>
          </div>
          <Spark data={usage?.daily ?? []} />
        </div>
      </GlassCard>

      {promptCacheBroken && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="text-sm">
            <p className="font-semibold text-warning">Prompt caching is not working</p>
            <p className="mt-0.5 text-muted-foreground">
              {(usage?.cache.prompt_tokens ?? 0).toLocaleString()} prompt tokens sent and none were cached.
              Stable prefixes must be byte-identical and at least 1,024 tokens. Until this is fixed,
              real spend runs roughly 10× the forecast.
            </p>
          </div>
        </div>
      )}

      {/* ── Packs ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {packs.map((p) => {
          const Icon = PACK_ICON[p.key] ?? Bot
          const quotaField = p.key === "mock_interview" ? "daily_session_quota" : "daily_refresh_quota"
          const quotaLabel = p.key === "mock_interview" ? "Sessions / student / day" : "Refreshes / student / day"
          return (
            <GlassCard key={p.key} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl border",
                    p.config.enabled ? "border-coding/30 bg-coding/10 text-coding"
                                     : "border-border bg-muted text-muted-foreground",
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight">{p.label}</h3>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{p.key}</p>
                  </div>
                </div>
                <Switch
                  checked={p.config.enabled}
                  onCheckedChange={(v) => patchPack(p.key, { enabled: v })}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-border bg-card/60 py-2">
                  <div className="font-mono text-sm font-semibold tabular-nums">{money(p.month_spend_usd)}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">this month</div>
                </div>
                <div className="rounded-lg border border-border bg-card/60 py-2">
                  <div className="font-mono text-sm font-semibold tabular-nums">{p.month_calls.toLocaleString()}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">calls</div>
                </div>
                <div className="rounded-lg border border-border bg-card/60 py-2">
                  <div className="font-mono text-sm font-semibold tabular-nums">{p.colleges_granted}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">colleges</div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Model</Label>
                  <Input
                    value={p.config.model ?? ""} className="mt-1 font-mono text-sm"
                    onChange={(e) => patchPack(p.key, { model: e.target.value })}
                  />
                </div>
                {p.key === "mock_interview" && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Report model (end-of-session only)</Label>
                    <Input
                      value={p.config.report_model ?? ""} className="mt-1 font-mono text-sm"
                      onChange={(e) => patchPack(p.key, { report_model: e.target.value })}
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{quotaLabel}</Label>
                    <Input
                      type="number" min={0} className="mt-1 font-mono text-sm"
                      value={(p.config as any)[quotaField] ?? 0}
                      onChange={(e) => patchPack(p.key, { [quotaField]: Number(e.target.value) } as any)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Max output tokens</Label>
                    <Input
                      type="number" min={1} className="mt-1 font-mono text-sm"
                      value={p.config.max_output_tokens ?? 0}
                      onChange={(e) => patchPack(p.key, { max_output_tokens: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {p.colleges_granted === 0 && (
                <p className="mt-3 rounded-lg border border-border bg-muted/40 p-2 text-[11px] text-muted-foreground">
                  No college holds this pack, so nothing is visible to students.
                </p>
              )}
            </GlassCard>
          )
        })}
      </div>

      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-popover/95 p-3 shadow-2xl backdrop-blur"
          >
            <span className="text-sm text-muted-foreground">Unsaved pack changes</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={load}>Discard</Button>
              <Button
                size="sm" disabled={saving}
                onClick={() => save({
                  features: Object.fromEntries(packs.map((p) => [p.key, p.config])),
                })}
              >
                {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                Save changes
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Budget + efficiency ───────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <BadgeIndianRupee className="h-4 w-4 text-primary" />Monthly budget
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Every AI pack switches off automatically at 100%, and a call is refused if its
            worst case would cross the cap — so spend cannot overshoot.
          </p>
          <div className="mt-4 flex items-end gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Cap (USD)</Label>
              <Input
                type="number" min={0} step="1" className="mt-1 font-mono"
                value={budgetText} onChange={(e) => setBudgetText(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">≈ {inr(Number(budgetText) || 0)} / month</p>
            </div>
            <Button
              disabled={saving || budgetText === String(cfg?.monthly_budget_usd)}
              onClick={() => save({ monthly_budget_usd: Number(budgetText) })}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
            </Button>
          </div>
          <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-xs">
            <Row label="Alert threshold" value={`${cfg?.soft_alert_pct ?? 80}%`} />
            <Row label="Billing month" value={cfg?.current_month ?? "—"} />
            <Row label="Last metering flush"
                 value={cfg?.last_flush_at ? new Date(cfg.last_flush_at).toLocaleTimeString() : "waiting…"} />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <Database className="h-4 w-4 text-coding" />Cost efficiency
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Both caches cut real spend. If either sits at zero, cost is running well above forecast.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Tile icon={Zap} label="Answer cache" value={`${usage?.cache.response_hit_rate ?? 0}%`}
                  sub={`${usage?.cache.response_hits ?? 0} free answers`}
                  tone={(usage?.cache.response_hit_rate ?? 0) > 0 ? "text-success" : "text-muted-foreground"} />
            <Tile icon={KeyRound} label="Prompt cache" value={`${usage?.cache.prompt_cache_rate ?? 0}%`}
                  sub="90% off cached input"
                  tone={(usage?.cache.prompt_cache_rate ?? 0) > 0 ? "text-success" : "text-muted-foreground"} />
          </div>
          <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-xs">
            <Row label="Avg cost / call"
                 value={usage && usage.total_calls
                   ? money(usage.total_cost_usd / usage.total_calls) : "—"} />
            <Row label="Errors (30d)"
                 value={String((usage?.by_status.error ?? 0) + (usage?.by_status.timeout ?? 0))} />
            <Row label="Blocked by quota / budget" value={String(usage?.by_status.blocked ?? 0)} />
          </div>
          <Button
            variant="outline" size="sm" className="mt-4 w-full"
            onClick={async () => {
              const { data } = await api.post("/super-admin/ai/cache/clear")
              toast.success(`Cleared ${data.cleared} cached answers`)
              load()
            }}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />Clear answer cache
          </Button>
        </GlassCard>
      </div>

      {/* ── Top spenders ──────────────────────────────────────────────────── */}
      {!!usage?.top_users.length && (
        <GlassCard className="p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <Activity className="h-4 w-4 text-primary" />Heaviest users · 30 days
          </h3>
          <div className="mt-3 divide-y divide-border/60">
            {usage.top_users.map((u, i) => (
              <div key={u.user_id} className="flex items-center gap-3 py-2 text-sm">
                <span className="w-5 font-mono text-xs text-muted-foreground">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate">{u.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{u.calls} calls</span>
                <span className="w-20 text-right font-mono tabular-nums">{money(u.cost_usd)}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── Danger zone ───────────────────────────────────────────────────── */}
      <GlassCard className="border-danger/25 p-5">
        <h3 className="flex items-center gap-2 font-semibold text-danger">
          <ShieldAlert className="h-4 w-4" />Emergency stop
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Stops every AI pack for every college at once. Takes effect immediately across all
          workers and survives a restart. Students see “AI help is paused”, never an error.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            {killed || !cfg?.enabled ? (
              <Button onClick={resume} className="w-full" variant="outline">
                <Power className="mr-1.5 h-4 w-4" />Bring Saarthi back online
              </Button>
            ) : (
              <HoldToKill onFire={fireKill} />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:w-56">
            {killed || !cfg?.enabled
              ? <><Ban className="h-4 w-4 text-danger" />Currently stopped</>
              : <><CheckCircle2 className="h-4 w-4 text-success" />Running normally</>}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  )
}
