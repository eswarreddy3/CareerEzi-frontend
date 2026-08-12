/**
 * Saarthi's reactive layer — costs nothing, ever.
 *
 * This is what makes her feel like a tutor sitting beside you rather than a
 * card on a page, and not one token is spent doing it. Any component can tell
 * Saarthi something happened; she reacts with a mood and a line drawn from a
 * hand-written bank.
 *
 *     import { saarthi } from "@/lib/saarthi-events"
 *     saarthi.emit("lesson_complete", { title: lesson.title })
 *
 * Deliberately NOT an LLM call. A student finishing a lesson wants an instant
 * reaction, not a 3-second wait and a fraction of a paisa. Generated text is
 * for the plan; these are reflexes.
 */

import type { SaarthiMood } from "@/components/saarthi/orb"

export type SaarthiEventName =
  | "greet"
  | "lesson_complete"
  | "course_complete"
  | "mcq_correct"
  | "mcq_streak"
  | "mcq_wrong"
  | "coding_accepted"
  | "coding_failed"
  | "plan_item_done"
  | "plan_complete"
  | "idle"
  | "return"

export interface SaarthiEvent {
  name: SaarthiEventName
  /** Interpolated into a line via {token} */
  data?: Record<string, string | number>
  /** Overrides the line bank when the caller has something more specific */
  say?: string
}

type Listener = (e: SaarthiEvent) => void

const listeners = new Set<Listener>()

export const saarthi = {
  emit(name: SaarthiEventName, data?: Record<string, string | number>, say?: string) {
    const event: SaarthiEvent = { name, data, say }
    listeners.forEach((l) => {
      try { l(event) } catch { /* a broken listener must never break the app */ }
    })
  },
  on(listener: Listener) {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
}

// ─── Mood per event ──────────────────────────────────────────────────────────
export const EVENT_MOOD: Record<SaarthiEventName, SaarthiMood> = {
  greet: "idle",
  lesson_complete: "celebrating",
  course_complete: "celebrating",
  mcq_correct: "celebrating",
  mcq_streak: "celebrating",
  mcq_wrong: "concerned",
  coding_accepted: "celebrating",
  coding_failed: "concerned",
  plan_item_done: "celebrating",
  plan_complete: "celebrating",
  idle: "asleep",
  return: "idle",
}

/** How long the bubble stays up, ms. Celebrations are brief; guidance lingers. */
export const EVENT_DURATION: Partial<Record<SaarthiEventName, number>> = {
  mcq_correct: 2200,
  mcq_streak: 3200,
  lesson_complete: 4000,
  course_complete: 6000,
  plan_complete: 6000,
  coding_failed: 5000,
  mcq_wrong: 3500,
}
export const DEFAULT_DURATION = 4200

// ─── Line bank ───────────────────────────────────────────────────────────────
// Written to sound like a final-year senior, not a mascot. Specific over
// enthusiastic — "that's 3 in a row" beats "great job!!".
const LINES: Record<SaarthiEventName, string[]> = {
  greet: [
    "Back again. Let's make it count.",
    "Right — where were we?",
    "Good to see you. Pick one thing and start.",
  ],
  lesson_complete: [
    "That's one done. {title} off the list.",
    "Lesson down. The next one's shorter than you think.",
    "Nice — that's real progress, not just time spent.",
  ],
  course_complete: [
    "Course finished. That's a certificate you can actually show someone.",
    "You closed out a whole course. Genuinely well done.",
  ],
  mcq_correct: [
    "Correct.",
    "That's right.",
    "Got it.",
    "Yes — that one trips people up.",
  ],
  mcq_streak: [
    "{count} in a row. You've clearly got this topic.",
    "{count} straight. Push a bit harder — try the tougher set.",
  ],
  mcq_wrong: [
    "Not quite. Read the explanation before moving on — that's where the marks are.",
    "Missed it. Worth slowing down on this one.",
    "Wrong, but useful. This is exactly the kind you'll see in a real round.",
  ],
  coding_accepted: [
    "Accepted. That's one more you can talk about in an interview.",
    "Passed. Try the next difficulty up.",
  ],
  coding_failed: [
    "Not passing yet. Trace it with the failing input — usually it's an edge case.",
    "Close. Check the boundaries before you rewrite anything.",
  ],
  plan_item_done: [
    "Ticked off. {left} left in your plan.",
    "One down. Keep going while you've got momentum.",
  ],
  plan_complete: [
    "That's your whole plan done. Genuinely — take the win.",
    "Plan complete. You did everything you set out to.",
  ],
  idle: ["", ""],
  return: [
    "Welcome back, {name}.",
    "There you are. Let's pick up where you stopped.",
  ],
}

/**
 * Pick a line, varying by day rather than at random.
 *
 * Fully random reads as erratic — Saarthi saying three different things about
 * the same event in one sitting feels like a slot machine. Rotating by day
 * keeps her consistent within a session but not stale across weeks.
 */
export function lineFor(event: SaarthiEvent): string {
  if (event.say) return interpolate(event.say, event.data)
  const bank = LINES[event.name] ?? []
  if (!bank.length) return ""
  const daySeed = Math.floor(Date.now() / 86_400_000)
  const nonce = Number(event.data?.nonce ?? 0)
  return interpolate(bank[(daySeed + nonce) % bank.length], event.data)
}

function interpolate(tpl: string, data?: Record<string, string | number>) {
  if (!data) return tpl
  return tpl.replace(/\{(\w+)\}/g, (m, k) => (k in data ? String(data[k]) : m))
}
