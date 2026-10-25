"use client"

// Profile photo: upload + crop a real photo, or pick an illustrated avatar.
// Cropping happens in the browser (drag to position, slider to zoom) and only
// the 512px square result is uploaded; the backend re-encodes it to 400px WebP.

import { useEffect, useRef, useState, type PointerEvent } from "react"
import { Camera, Loader2, Trash2, Upload, ZoomIn, ZoomOut } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { AvatarPicker } from "@/components/avatar-picker"
import api from "@/lib/api"

const VIEW = 256          // crop viewport, CSS px — fits a 320px phone inside the dialog
const OUT = 512           // uploaded image, px
const MAX_BYTES = 10 * 1024 * 1024

interface Props {
  open: boolean
  onClose: () => void
  current?: string | null
  /** Called with the new avatar URL (uploaded path or preset URL), or null when removed. */
  onChange: (url: string | null) => void
}

export function PhotoPicker({ open, onClose, current, onChange }: Props) {
  const [src, setSrc] = useState<string | null>(null)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (!open) setSrc(null) }, [open])
  useEffect(() => () => { if (src) URL.revokeObjectURL(src) }, [src])

  const pick = (file?: File) => {
    if (!file) return
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return toast.error("Choose a PNG, JPG or WEBP image")
    if (file.size > MAX_BYTES) return toast.error("Photo must be under 10 MB")
    setSrc(URL.createObjectURL(file))
  }

  const upload = async (blob: Blob) => {
    setBusy(true)
    try {
      const form = new FormData()
      form.append("file", blob, "avatar.webp")
      const res = await api.post("/student/profile/avatar", form)
      onChange(res.data.avatar)
      toast.success("Photo updated")
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Upload failed")
    } finally { setBusy(false) }
  }

  const choosePreset = async (url: string) => {
    try {
      await api.patch("/student/profile", { avatar: url })
      onChange(url)
      toast.success("Avatar updated")
      onClose()
    } catch { toast.error("Failed to update avatar") }
  }

  const removePhoto = async () => {
    setBusy(true)
    try {
      await api.patch("/student/profile", { avatar: null })
      onChange(null)
      toast.success("Photo removed")
      onClose()
    } catch { toast.error("Couldn't remove photo") } finally { setBusy(false) }
  }

  return (
    <>
      <Dialog open={open && !presetsOpen} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="bg-popover border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground font-serif">Profile photo</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {src ? "Drag to position, use the slider to zoom." : "A clear, front-facing photo works best."}
            </DialogDescription>
          </DialogHeader>

          {src ? (
            <Cropper src={src} busy={busy} onCancel={() => setSrc(null)} onDone={upload} />
          ) : (
            <div className="space-y-2">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                onChange={(e) => { pick(e.target.files?.[0]); e.target.value = "" }} />
              <Button className="w-full bg-primary text-primary-foreground hover:brightness-110"
                onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" /> Upload a photo
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setPresetsOpen(true)}>
                <Camera className="h-4 w-4 mr-2" /> Choose an illustrated avatar
              </Button>
              {current && (
                <Button variant="ghost" className="w-full text-danger hover:text-danger" disabled={busy} onClick={removePhoto}>
                  <Trash2 className="h-4 w-4 mr-2" /> Remove photo
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AvatarPicker open={presetsOpen} onClose={() => setPresetsOpen(false)}
        onSelect={choosePreset} current={current ?? undefined} />
    </>
  )
}

function Cropper({ src, busy, onCancel, onDone }: {
  src: string; busy: boolean; onCancel: () => void; onDone: (blob: Blob) => void
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })       // offset of image centre from viewport centre, CSS px
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

  useEffect(() => {
    const i = new Image()
    i.onload = () => { setImg(i); setZoom(1); setPos({ x: 0, y: 0 }) }
    i.onerror = () => toast.error("Couldn't read that image")
    i.src = src
  }, [src])

  // Scale so the shorter side exactly covers the viewport at zoom 1.
  const base = img ? VIEW / Math.min(img.naturalWidth, img.naturalHeight) : 1
  const w = img ? img.naturalWidth * base * zoom : 0
  const h = img ? img.naturalHeight * base * zoom : 0
  const clamp = (p: { x: number; y: number }, ww = w, hh = h) => ({
    x: Math.max(-(ww - VIEW) / 2, Math.min((ww - VIEW) / 2, p.x)),
    y: Math.max(-(hh - VIEW) / 2, Math.min((hh - VIEW) / 2, p.y)),
  })

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (d) setPos(clamp({ x: d.px + e.clientX - d.x, y: d.py + e.clientY - d.y }))
  }
  const onZoom = (z: number) => {
    setZoom(z)
    if (img) setPos((p) => clamp(p, img.naturalWidth * base * z, img.naturalHeight * base * z))
  }

  const finish = () => {
    if (!img) return
    const scale = base * zoom                           // CSS px per source px
    const sx = (w / 2 - VIEW / 2 - pos.x) / scale
    const sy = (h / 2 - VIEW / 2 - pos.y) / scale
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = OUT
    const ctx = canvas.getContext("2d")!
    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(img, sx, sy, VIEW / scale, VIEW / scale, 0, 0, OUT, OUT)
    canvas.toBlob((b) => (b ? onDone(b) : toast.error("Couldn't process the image")), "image/webp", 0.9)
  }

  return (
    <div className="space-y-4">
      <div
        className="relative mx-auto overflow-hidden rounded-xl bg-secondary touch-none cursor-grab active:cursor-grabbing select-none"
        style={{ width: VIEW, height: VIEW }}
        onPointerDown={onDown} onPointerMove={onMove}
        onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)}>
        {img && (
          <img src={src} alt="" draggable={false} className="absolute max-w-none pointer-events-none"
            style={{ width: w, height: h, left: VIEW / 2 - w / 2 + pos.x, top: VIEW / 2 - h / 2 + pos.y }} />
        )}
        {/* circular guide — the photo is shown round across the app */}
        <div aria-hidden className="absolute inset-0 pointer-events-none rounded-full"
          style={{ boxShadow: "0 0 0 9999px rgb(0 0 0 / 0.45)" }} />
      </div>
      <div className="flex items-center gap-3 px-2">
        <ZoomOut className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden />
        {/* --muted (the default track) disappears against the dark popover; use the border token */}
        <Slider min={1} max={3} step={0.01} value={[zoom]} onValueChange={([z]) => onZoom(z)} aria-label="Zoom"
          className="[&_[data-slot=slider-track]]:bg-border" />
        <ZoomIn className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={busy}>Back</Button>
        <Button className="flex-1 bg-primary text-primary-foreground hover:brightness-110" onClick={finish} disabled={busy || !img}>
          {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save photo
        </Button>
      </div>
    </div>
  )
}
