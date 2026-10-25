"use client"

// Small form primitives shared by every Career Profile form.

import { useState, type ReactNode, type SelectHTMLAttributes, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export const inputClass = "bg-secondary/50 border-border text-foreground"

/** Labelled form row. By default the whole row is a <label>, so the text names the
 *  control inside it. Pass labelFor={false} for composite controls (date pair, tag
 *  input) — they label their own parts, and a wrapping label would forward clicks
 *  to the first button inside them. */
export function Field({ label, hint, error, required, children, className, labelFor = true }: {
  label: string; hint?: string; error?: string; required?: boolean; children: ReactNode
  className?: string; labelFor?: boolean
}) {
  const Wrapper = labelFor ? "label" : "div"
  const text = (
    <span className="block text-sm font-medium leading-none text-foreground">
      {label}{required && <span className="text-danger ml-0.5" aria-hidden>*</span>}
    </span>
  )
  return (
    <div className={cn("space-y-1.5", className)}>
      <Wrapper className="block space-y-1.5">
        {text}
        {children}
      </Wrapper>
      {error ? <p className="text-xs text-danger" role="alert">{error}</p>
        : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function NativeSelect({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
        className,
      )}>
      {children}
    </select>
  )
}

export function ToggleRow({ label, hint, checked, onChange }: {
  label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
      <span>
        <span className="text-sm text-foreground">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"]

/** Year + optional month → 'YYYY' | 'YYYY-MM' | ''. Students often know only the year. */
export function YMInput({ value, onChange, disabled, label }: {
  value: string; onChange: (v: string) => void; disabled?: boolean; label: string
}) {
  const [year, month] = (value || "").split("-")
  const thisYear = new Date().getFullYear()
  const years = Array.from({ length: thisYear + 6 - 1980 + 1 }, (_, i) => thisYear + 6 - i)
  return (
    <div className="grid grid-cols-2 gap-2">
      <NativeSelect aria-label={`${label} month`} value={month || ""} disabled={disabled || !year}
        onChange={(e) => onChange(e.target.value ? `${year}-${e.target.value}` : year)}>
        <option value="">Month</option>
        {MONTHS.map((m, i) => <option key={m} value={String(i + 1).padStart(2, "0")}>{m}</option>)}
      </NativeSelect>
      <NativeSelect aria-label={`${label} year`} value={year || ""} disabled={disabled}
        onChange={(e) => onChange(e.target.value ? (month ? `${e.target.value}-${month}` : e.target.value) : "")}>
        <option value="">Year</option>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </NativeSelect>
    </div>
  )
}

/** Free-text tags (project skills). Enter or comma adds; Backspace on empty removes the last. */
export function TagInput({ value, onChange, max = 15, placeholder, label }: {
  value: string[]; onChange: (v: string[]) => void; max?: number; placeholder?: string; label: string
}) {
  const [draft, setDraft] = useState("")
  const add = (raw: string) => {
    const parts = raw.split(",").map((t) => t.trim().replace(/\s+/g, " ")).filter(Boolean)
    const next = [...value]
    for (const t of parts) {
      if (next.length >= max) break
      if (t.length <= 40 && !next.some((x) => x.toLowerCase() === t.toLowerCase())) next.push(t)
    }
    onChange(next)
    setDraft("")
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && draft.trim()) { e.preventDefault(); add(draft) }
    else if (e.key === "Enter") e.preventDefault()
    else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1))
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5 min-h-9 rounded-md border border-border bg-secondary/50 px-2 py-1.5
      focus-within:ring-2 focus-within:ring-ring">
      {value.map((t) => (
        <span key={t} className="chip chip-primary inline-flex items-center gap-1">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))}
            className="hover:text-danger"><X className="h-3 w-3" /></button>
        </span>
      ))}
      {value.length < max && (
        <input aria-label={label} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={value.length ? "" : placeholder}
          className="flex-1 min-w-[8rem] bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
      )}
    </div>
  )
}
