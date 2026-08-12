"use client"

/**
 * Mounts the floating Saarthi for students at AI-licensed colleges only.
 *
 * Split out from the layout so the licence check lives in one place: an
 * unlicensed college renders nothing at all — no orb, no placeholder, no
 * network chatter beyond the single free /capabilities call the layout already
 * needs for the nav.
 */

import { useEffect } from "react"

import { SaarthiCompanion } from "@/components/saarthi/saarthi-companion"
import { useAuthStore } from "@/store/authStore"
import { useAIStore } from "@/store/aiStore"

export function SaarthiMount() {
  const role = useAuthStore((s) => s.user?.role)
  const { caps, load, has } = useAIStore()

  useEffect(() => {
    if (role === "student") load()
  }, [role, load])

  if (role !== "student" || !caps || !has("ai_coach")) return null
  return <SaarthiCompanion />
}
