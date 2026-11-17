// Admin-side student actions shared by the college-admin and branch-admin pages:
// "we miss you" reminders and resending login credentials. Backend rules live in
// app/services/student_reminders.py and student_welcome.py.
import api from "@/lib/api"

/** The backend's human message (`message`), falling back to `error`, then `fallback`. */
export function apiMessage(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: { message?: string; error?: string } } })?.response?.data
  return data?.message || data?.error || fallback
}

// ── Reminders (48h cooldown per student) ─────────────────────────────────────

/** `base` is "/admin" for college admins, "/branch-admin" for HODs. */
export async function remindStudent(base: "/admin" | "/branch-admin", id: number): Promise<string> {
  const res = await api.post(`${base}/students/${id}/remind`)
  return res.data.message as string
}

export interface BulkRemindResult {
  matched: number
  queued: number
  skipped_recent: number
}

export async function remindStudents(ids: number[]): Promise<BulkRemindResult> {
  const res = await api.post("/admin/students/remind-bulk", { student_ids: ids })
  return res.data
}

export async function remindAllInactive(): Promise<BulkRemindResult> {
  const res = await api.post("/admin/students/remind-bulk", { filter: { status: "inactive" } })
  return res.data
}

export function bulkRemindSummary(r: BulkRemindResult): string {
  const skipped = r.skipped_recent ? `, ${r.skipped_recent} skipped (reminded in the last 48h)` : ""
  return r.queued
    ? `Sending reminders to ${r.queued} student${r.queued !== 1 ? "s" : ""}${skipped}`
    : `Nobody to remind${skipped}`
}

// ── Login credentials for students who never logged in ───────────────────────

export interface WelcomeStatus {
  onboarded: boolean
  welcome_requested_at: string | null
  welcome_sent_at: string | null
  welcome_error: string | null
}

export interface WelcomeResendResult {
  matched: number
  queued: number
  skipped_onboarded: number
  skipped_recent: number
  message?: string
}

export async function resendLogin(id: number): Promise<string> {
  const res = await api.post(`/admin/students/${id}/resend-welcome`)
  return res.data.message ?? "New login details are on the way"
}

export async function resendLoginBulk(
  target: { student_ids: number[] } | { filter: { branch?: string; failed_only?: boolean } },
): Promise<WelcomeResendResult> {
  const res = await api.post("/admin/students/resend-welcome-bulk", target)
  return res.data
}

export function resendSummary(r: WelcomeResendResult): string {
  const parts = []
  if (r.skipped_onboarded) parts.push(`${r.skipped_onboarded} already logged in`)
  if (r.skipped_recent) parts.push(`${r.skipped_recent} sent in the last hour`)
  const skipped = parts.length ? ` (skipped: ${parts.join(", ")})` : ""
  return r.queued
    ? `Sending new login details to ${r.queued} student${r.queued !== 1 ? "s" : ""}${skipped}`
    : `Nobody to send to${skipped}`
}

function ago(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 60) return mins <= 1 ? "just now" : `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

/**
 * Login-email state of a never-logged-in student, or null once they have logged in.
 * "Sent" means the mail provider accepted it — not that it reached the inbox.
 */
export function welcomeLabel(w: Partial<WelcomeStatus>): { text: string; tone: "danger" | "warning" | "muted" } | null {
  if (w.onboarded !== false) return null
  const requested = w.welcome_requested_at ? new Date(w.welcome_requested_at).getTime() : 0
  const sent = w.welcome_sent_at ? new Date(w.welcome_sent_at).getTime() : 0
  if (requested > sent && !w.welcome_error) return { text: "Login email sending…", tone: "muted" }
  if (w.welcome_error) return { text: "Login email failed", tone: "danger" }
  if (w.welcome_sent_at) return { text: `Login email sent ${ago(w.welcome_sent_at)}`, tone: "warning" }
  return { text: "No login email on record", tone: "muted" }
}

export const WELCOME_TONE_CLASS = { danger: "text-danger", warning: "text-warning", muted: "text-muted-foreground" } as const
