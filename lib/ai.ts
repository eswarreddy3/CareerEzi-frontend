import api from "@/lib/api"

// ─── Types ───────────────────────────────────────────────────────────────────
export type PackKey = "ai_coach" | "mock_interview"

export interface PackCapability {
  enabled: boolean
  label: string
  reason?: "disabled" | "unconfigured" | "not_licensed" | "paused"
  quota?: { used: number; limit: number; remaining: number | null; resets_at: string }
}

export interface Capabilities {
  enabled: boolean
  assistant: { name: string }
  features: Record<PackKey, PackCapability>
}

export type ItemKind = "lesson" | "practice" | "aptitude" | "coding" | "drive" | "profile"

export interface PlanItem {
  kind: ItemKind
  label: string
  detail: string
  target_id: string | null
  target_count: number
  deep_link: string
  reason: string
  points: number
  progress: number
  done: boolean
}

export interface ReadinessComponent {
  key: "academic" | "skills" | "practice" | "profile"
  label: string
  max: number
  earned: number
  detail: string
}

export interface ReadinessGap {
  label: string
  action: string
  worth: number
  why: string
  component: string
  target_id?: string
}

export interface StudyPlan {
  period: "daily" | "weekly"
  plan_mode: "daily" | "weekly"
  period_start: string
  period_end: string
  readiness: {
    score: number
    band: string
    components: ReadinessComponent[]
    gaps: ReadinessGap[]
  }
  items: PlanItem[]
  narration: {
    greeting?: string
    focus?: string
    nudge?: string
    weakness_note?: string
    next_best?: string | null
    generated_by?: string
  }
  progress: { done: number; total: number; percentage: number }
  generated_at: string
  source: string
  quota?: { used: number; limit: number; remaining: number | null; resets_at: string }
}

// ─── Calls ───────────────────────────────────────────────────────────────────
export async function fetchCapabilities(): Promise<Capabilities> {
  const { data } = await api.get("/ai/capabilities")
  return data
}

export async function fetchPlan(): Promise<StudyPlan> {
  const { data } = await api.get("/ai/coach/plan")
  return data
}

export async function refreshPlan(): Promise<StudyPlan> {
  const { data } = await api.post("/ai/coach/refresh")
  return data
}

export async function setPlanMode(mode: "daily" | "weekly"): Promise<StudyPlan> {
  const { data } = await api.patch("/ai/coach/mode", { mode })
  return data
}
