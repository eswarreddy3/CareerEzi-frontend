// Client-side "Add to Calendar" helpers — no OAuth, no backend.
// Builds Google/Outlook deep links and a downloadable .ics file for any event.

export interface CalendarEvent {
  title: string
  start: string | Date          // ISO string or Date
  end?: string | Date           // optional; defaults to start + durationMins
  durationMins?: number         // default 120
  description?: string
  location?: string
}

function toDate(d: string | Date): Date {
  return d instanceof Date ? d : new Date(d)
}

function endOf(e: CalendarEvent): Date {
  if (e.end) return toDate(e.end)
  const start = toDate(e.start)
  return new Date(start.getTime() + (e.durationMins ?? 120) * 60000)
}

// → 20260620T143000Z  (UTC basic format)
function fmtUTC(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

// Escape per RFC 5545 for .ics text values
function escapeIcs(text: string): string {
  return (text || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
}

export function googleCalendarUrl(e: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${fmtUTC(toDate(e.start))}/${fmtUTC(endOf(e))}`,
    details: e.description || "",
    location: e.location || "",
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function outlookCalendarUrl(e: CalendarEvent): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: e.title,
    startdt: toDate(e.start).toISOString(),
    enddt: endOf(e).toISOString(),
    body: e.description || "",
    location: e.location || "",
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

export function buildIcs(e: CalendarEvent): string {
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@careerezi.com`
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CareerEzi//Placement//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${fmtUTC(new Date())}`,
    `DTSTART:${fmtUTC(toDate(e.start))}`,
    `DTEND:${fmtUTC(endOf(e))}`,
    `SUMMARY:${escapeIcs(e.title)}`,
    `DESCRIPTION:${escapeIcs(e.description || "")}`,
    `LOCATION:${escapeIcs(e.location || "")}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",            // reminder 1 day before
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(e.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}

export function downloadIcs(e: CalendarEvent, filename = "event.ics"): void {
  const blob = new Blob([buildIcs(e)], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
