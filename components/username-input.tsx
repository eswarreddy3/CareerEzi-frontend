"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Loader2, X, AtSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { cn } from "@/lib/utils"

export type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid"

interface Props {
  value: string
  onChange: (value: string) => void
  /** Called whenever availability resolves — true means safe to save. */
  onStatusChange?: (status: UsernameStatus) => void
  /** The user's already-saved username; treated as available (it's theirs). */
  current?: string | null
  placeholder?: string
}

/**
 * Username field with debounced availability checking against
 * GET /api/public/username-available. Normalizes input to the allowed charset.
 */
export function UsernameInput({ value, onChange, onStatusChange, current, placeholder }: Props) {
  const [status, setStatus] = useState<UsernameStatus>("idle")
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const set = (s: UsernameStatus, msg: string | null) => {
    setStatus(s); setMessage(msg); onStatusChange?.(s)
  }

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    const v = value.trim().toLowerCase()

    if (!v) { set("idle", null); return }
    if (current && v === current.toLowerCase()) { set("available", "This is your current username"); return }

    set("checking", null)
    timer.current = setTimeout(async () => {
      try {
        const res = await api.get("/public/username-available", { params: { u: v } })
        const { available, valid, error } = res.data
        if (!valid) set("invalid", error || "Invalid username")
        else if (!available) set("taken", error || "That username is taken")
        else set("available", "Available")
      } catch {
        set("idle", null)
      }
    }, 450)

    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [value, current]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center gap-1 text-sm">
          <AtSign className="h-3.5 w-3.5" />
        </span>
        <Input
          value={value}
          placeholder={placeholder || "your-handle"}
          onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
          maxLength={30}
          className="bg-secondary/50 border-border text-foreground pl-8 pr-9"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {status === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {status === "available" && <Check className="h-4 w-4 text-success" />}
          {(status === "taken" || status === "invalid") && <X className="h-4 w-4 text-danger" />}
        </span>
      </div>
      {message && (
        <p className={cn("text-xs",
          status === "available" ? "text-success" : status === "checking" ? "text-muted-foreground" : "text-danger")}>
          {message}
        </p>
      )}
      <p className="text-[11px] text-muted-foreground">
        Your public profile will be at <span className="font-mono text-foreground">careerezi.com/u/{value || "your-handle"}</span>
      </p>
    </div>
  )
}
