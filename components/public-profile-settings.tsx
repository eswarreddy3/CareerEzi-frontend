"use client"

import { useState } from "react"
import { Globe, Loader2, Copy, ExternalLink, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { UsernameInput, type UsernameStatus } from "@/components/username-input"
import { useAuthStore } from "@/store/authStore"
import api from "@/lib/api"

export function PublicProfileSettings() {
  const { user, updateUser } = useAuthStore()
  const savedUsername = (user?.username as string) || ""
  const [username, setUsername] = useState(savedUsername)
  const [status, setStatus] = useState<UsernameStatus>("idle")
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [copied, setCopied] = useState(false)

  const isPublic = !!user?.is_public
  const dirty = username.trim().toLowerCase() !== savedUsername.toLowerCase()
  const publicUrl = savedUsername ? `https://www.careerezi.com/u/${savedUsername}` : ""

  const saveUsername = async () => {
    if (status === "taken" || status === "invalid" || status === "checking") return
    setSaving(true)
    try {
      const clean = username.trim().toLowerCase()
      await api.patch("/student/profile", { username: clean })
      updateUser({ username: clean })
      toast.success("Username saved")
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save username")
    } finally {
      setSaving(false)
    }
  }

  const togglePublic = async (next: boolean) => {
    if (next && !savedUsername) {
      toast.error("Set and save a username first")
      return
    }
    setToggling(true)
    try {
      await api.patch("/student/profile", { is_public: next })
      updateUser({ is_public: next })
      toast.success(next ? "Your profile is now public" : "Your profile is now private")
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update visibility")
    } finally {
      setToggling(false)
    }
  }

  const copyLink = async () => {
    if (!publicUrl) return
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Couldn't copy link")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold font-serif text-foreground flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" /> Public Profile
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Share a portfolio of your coding stats and CareerEzi achievements with recruiters.
        </p>
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <Label className="text-foreground">Username</Label>
        <UsernameInput value={username} onChange={setUsername} onStatusChange={setStatus} current={savedUsername} />
        {dirty && (
          <Button
            size="sm"
            onClick={saveUsername}
            disabled={saving || status === "taken" || status === "invalid" || status === "checking"}
            className="bg-primary hover:brightness-110 text-primary-foreground mt-1"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save Username
          </Button>
        )}
      </div>

      {/* Visibility toggle */}
      <div className="flex items-center justify-between rounded-xl bg-secondary/30 border border-border px-4 py-3">
        <div className="min-w-0 pr-3">
          <p className="text-sm font-medium text-foreground">Make profile public</p>
          <p className="text-xs text-muted-foreground">Anyone with the link can view it. Off by default.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {toggling && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <Switch checked={isPublic} onCheckedChange={togglePublic} disabled={toggling || !savedUsername} />
        </div>
      </div>

      {/* Share link */}
      {isPublic && savedUsername && (
        <div className="space-y-2">
          <Label className="text-foreground">Your public link</Label>
          <div className="flex items-center gap-2">
            <code className="flex-1 min-w-0 truncate text-xs bg-secondary/50 border border-border rounded-lg px-3 py-2 text-foreground">
              {publicUrl}
            </code>
            <Button size="sm" variant="outline" onClick={copyLink} className="flex-shrink-0 gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <a href={`/u/${savedUsername}`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="flex-shrink-0 gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> View
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
