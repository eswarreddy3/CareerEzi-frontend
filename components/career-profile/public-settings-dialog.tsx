"use client"

// Which sections appear on the public page (/u/<username>). Hidden sections are
// filtered out by the backend, so their data never reaches visitors.

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ToggleRow } from "./fields"
import {
  savePublicSettings, apiError, PUBLIC_SECTIONS, type PublicSection, type PublicSettings,
} from "@/lib/career-profile"

export function PublicSettingsDialog({ open, onClose, settings, onSaved, isPublic, username }: {
  open: boolean; onClose: () => void; settings: PublicSettings; onSaved: (s: PublicSettings) => void
  isPublic: boolean; username?: string | null
}) {
  const [hidden, setHidden] = useState<Set<PublicSection>>(new Set(settings.hidden_sections))
  const [saving, setSaving] = useState(false)

  const toggle = (section: PublicSection, show: boolean) =>
    setHidden((h) => {
      const next = new Set(h)
      if (show) next.delete(section); else next.add(section)
      return next
    })

  const save = async () => {
    setSaving(true)
    try {
      onSaved(await savePublicSettings({ hidden_sections: [...hidden] }))
      toast.success("Public page updated")
      onClose()
    } catch (err) {
      toast.error(apiError(err, "Couldn't save"))
    } finally { setSaving(false) }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-popover border-border max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground font-serif">Public page sections</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose what visitors see. Your name, photo, headline and college are always shown.
          </DialogDescription>
        </DialogHeader>

        {!isPublic && (
          <p className="text-sm rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-foreground">
            Your public page is off.{" "}
            <Link href="/profile" className="text-primary hover:underline">
              {username ? "Turn it on in Profile" : "Pick a username in Profile"}
            </Link>{" "}to share it.
          </p>
        )}

        <div className="divide-y divide-border/60">
          {PUBLIC_SECTIONS.map((sec) => (
            <div key={sec.value} className="py-1.5">
              <ToggleRow label={sec.label} hint={sec.hint} checked={!hidden.has(sec.value)}
                onChange={(show) => toggle(sec.value, show)} />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          To hide a single item instead, use its eye button on the Career Profile page.
        </p>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button className="flex-1 bg-primary text-primary-foreground hover:brightness-110" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
