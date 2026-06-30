"use client"

import { useState } from "react"
import { Globe, Loader2, Copy, ExternalLink, Check, AtSign, Pencil } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { UsernameInput, type UsernameStatus } from "@/components/username-input"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

export function PublicProfileSettings() {
  const { user, updateUser } = useAuthStore()
  const savedUsername = (user?.username as string) || ""
  const [username, setUsername] = useState(savedUsername)
  const [status, setStatus] = useState<UsernameStatus>("idle")
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [copied, setCopied] = useState(false)

  const isPublic = !!user?.is_public
  const publicUrl = savedUsername ? `https://www.careerezi.com/u/${savedUsername}` : ""

  const saveUsername = async () => {
    if (status === "taken" || status === "invalid" || status === "checking") return
    setSaving(true)
    try {
      const clean = username.trim().toLowerCase()
      await api.patch("/student/profile", { username: clean })
      updateUser({ username: clean })
      toast.success("Username saved")
      setEditing(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save username")
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setUsername(savedUsername)
    setStatus("idle")
    setEditing(false)
  }

  const togglePublic = async (next: boolean) => {
    if (next && !savedUsername) {
      toast.error("Set a username first")
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold font-serif text-foreground">Public Profile</h3>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Username — editable field */}
        {editing ? (
          <div className="space-y-1.5">
            <Label className="text-foreground flex items-center gap-1.5">
              <AtSign className="h-3.5 w-3.5 text-primary" /> Username
            </Label>
            <UsernameInput value={username} onChange={setUsername} onStatusChange={setStatus} current={savedUsername} />
            <div className="flex gap-2 mt-1">
              <Button onClick={saveUsername}
                disabled={saving || status === "taken" || status === "invalid" || status === "checking"}
                className="bg-primary hover:brightness-110 text-primary-foreground">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save
              </Button>
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border/50">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <AtSign className="h-3.5 w-3.5" /> Username
            </span>
            <span className={cn("text-sm font-medium truncate max-w-[55%]", savedUsername ? "text-foreground" : "text-muted-foreground/60")}>
              {savedUsername ? `@${savedUsername}` : "Not set"}
            </span>
          </div>
        )}

        {/* Visibility — always a toggle row */}
        <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border/50">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" /> Visibility
          </span>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-sm font-medium text-foreground">{isPublic ? "Public" : "Private"}</span>
            {toggling && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Switch checked={isPublic} onCheckedChange={togglePublic} disabled={toggling || !savedUsername} />
          </div>
        </div>

        {/* Public link — shown when public */}
        {isPublic && savedUsername ? (
          <div className="space-y-1.5">
            <Label className="text-foreground flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-primary" /> Public Link
            </Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 min-w-0 truncate text-xs bg-secondary/50 border border-border rounded-md px-3 py-2.5 text-foreground">
                {publicUrl}
              </code>
              <Button variant="outline" onClick={copyLink} className="flex-shrink-0 gap-1.5">
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <a href={`/u/${savedUsername}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex-shrink-0 gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" /> View
                </Button>
              </a>
            </div>
          </div>
        ) : (
          !savedUsername && (
            <p className="text-xs text-muted-foreground">Set a username to claim your public profile link.</p>
          )
        )}
      </div>
    </div>
  )
}
