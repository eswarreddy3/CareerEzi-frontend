"use client"

import { useState, useRef, useEffect, type MouseEvent } from "react"
import { CalendarPlus, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type CalendarEvent, googleCalendarUrl, outlookCalendarUrl, downloadIcs,
} from "@/lib/calendar"

export function AddToCalendar({
  event, label = "Add to Calendar", className, compact = false,
}: {
  event: CalendarEvent
  label?: string
  className?: string
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: globalThis.MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  const icsName = `${event.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`

  function pick(action: () => void, e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    action()
    setOpen(false)
  }

  const items = [
    { label: "Google Calendar", run: () => window.open(googleCalendarUrl(event), "_blank", "noopener,noreferrer") },
    { label: "Outlook", run: () => window.open(outlookCalendarUrl(event), "_blank", "noopener,noreferrer") },
    { label: "Apple / .ics file", run: () => downloadIcs(event, icsName) },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((v) => !v) }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary font-medium transition-colors hover:bg-primary/20",
          compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
          className,
        )}
      >
        <CalendarPlus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {label}
        <ChevronDown className={cn("transition-transform", compact ? "h-3 w-3" : "h-3.5 w-3.5", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-48 rounded-xl border border-border bg-popover p-1 shadow-xl">
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              onClick={(e) => pick(it.run, e)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary/60 transition-colors"
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Build a CalendarEvent from a placement-drive object. */
export function placementDriveEvent(drive: {
  company_name: string
  job_role?: string | null
  drive_date: string
  registration_deadline?: string | null
  venue_or_link?: string | null
  job_location?: string | null
  ctc?: number | null
  required_skills?: string | null
  description?: string | null
}): CalendarEvent {
  const description = [
    `Placement drive: ${drive.company_name}${drive.job_role ? ` — ${drive.job_role}` : ""}`,
    drive.ctc ? `CTC: ${drive.ctc} LPA` : "",
    drive.registration_deadline ? `Register by: ${new Date(drive.registration_deadline).toLocaleString("en-IN")}` : "",
    drive.required_skills ? `Skills: ${drive.required_skills}` : "",
    drive.description || "",
    "",
    "Via CareerEzi",
  ].filter(Boolean).join("\n")

  return {
    title: `${drive.company_name}${drive.job_role ? ` — ${drive.job_role}` : ""} Drive`,
    start: drive.drive_date,
    durationMins: 120,
    location: drive.venue_or_link || drive.job_location || "",
    description,
  }
}
