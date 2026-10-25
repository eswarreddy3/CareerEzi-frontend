"use client"

// Customize public page — edits the design spec (lib/portfolio-design.ts) and
// section visibility, with a live preview of the real page. Nothing goes live
// until Save. The AI designer will fill in the same spec.

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  ArrowLeft, ChevronDown, ChevronUp, ExternalLink, ImagePlus, Loader2, Monitor, RotateCcw, Save, Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { PublicProfileView } from "@/components/public-profile-view"
import { useAuthStore } from "@/store/authStore"
import api from "@/lib/api"
import { media, type PublicProfile } from "@/lib/public-profile"
import { savePublicSettings, apiError, PUBLIC_SECTIONS, type PublicSection } from "@/lib/career-profile"
import {
  ACCENTS, BANNER_PATTERNS, DEFAULT_DESIGN, FONTS, LAYOUTS, LAYOUT_PRESETS, MODES, normalizeDesign,
  type Design, type Layout,
} from "@/lib/portfolio-design"
import { cn } from "@/lib/utils"

/** Remove the data of sections switched off in the draft, mirroring what the backend does. */
function applyHidden(p: PublicProfile, hidden: Set<PublicSection>): PublicProfile {
  const out: PublicProfile = { ...p }
  if (hidden.has("about")) delete out.about
  for (const s of ["projects", "experience", "education", "skills", "achievements"] as const) if (hidden.has(s)) delete out[s]
  if (hidden.has("certifications")) {
    out.certificates = []; out.external_certifications = undefined
    out.completed_courses = []; out.completed_domains = []
  }
  if (hidden.has("coding")) { out.coding_profiles = []; out.problems_solved = 0 }
  if (hidden.has("contact")) {
    out.linkedin = null; out.github = null
    if (out.about) out.about = { ...out.about, website: null }
  }
  return out
}

export default function CustomizePublicPage() {
  const { user } = useAuthStore()
  const [preview, setPreview] = useState<PublicProfile | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [design, setDesign] = useState<Design>(DEFAULT_DESIGN)
  const [hidden, setHidden] = useState<Set<PublicSection>>(new Set())
  const [saved, setSaved] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const snapshot = (d: Design, h: Set<PublicSection>) => JSON.stringify({ d, h: [...h].sort() })
  const dirty = !!saved && snapshot(design, hidden) !== saved

  const load = async () => {
    setLoadError(false)
    try {
      const p: PublicProfile = (await api.get("/student/career-profile/preview")).data
      const d = normalizeDesign(p.design)
      const h = new Set((p.hidden_sections ?? []) as PublicSection[])
      setPreview(p); setDesign(d); setHidden(h); setSaved(snapshot(d, h))
    } catch { setLoadError(true) }
  }
  useEffect(() => { load() }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const h = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener("beforeunload", h)
    return () => window.removeEventListener("beforeunload", h)
  }, [dirty])

  const set = (patch: Partial<Design>) => setDesign((d) => ({ ...d, ...patch }))
  const pickLayout = (layout: Layout) => setDesign((d) => ({
    ...d, layout, ...LAYOUT_PRESETS[layout],
    // keep an uploaded banner — the preset only suggests a pattern
    ...(d.banner.kind === "image" ? { banner: d.banner } : {}),
  }))
  const moveSection = (i: number, dir: -1 | 1) => setDesign((d) => {
    const order = [...d.section_order]; const j = i + dir
    if (j < 0 || j >= order.length) return d
    ;[order[i], order[j]] = [order[j], order[i]]
    return { ...d, section_order: order }
  })
  const toggleSection = (s: PublicSection, show: boolean) => setHidden((h) => {
    const n = new Set(h); if (show) n.delete(s); else n.add(s); return n
  })

  const uploadBanner = async (file?: File) => {
    if (!file) return
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return toast.error("Choose a PNG, JPG or WEBP image")
    if (file.size > 8 * 1024 * 1024) return toast.error("Banner must be under 8 MB")
    setUploading(true)
    try {
      const form = new FormData(); form.append("file", file)
      const res = await api.post("/student/career-profile/banner", form)
      set({ banner: { kind: "image", value: res.data.url } })
    } catch (err) {
      toast.error(apiError(err, "Upload failed"))
    } finally { setUploading(false) }
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await savePublicSettings({ design, hidden_sections: [...hidden] })
      const d = normalizeDesign(res.design); const h = new Set(res.hidden_sections)
      setDesign(d); setHidden(h); setSaved(snapshot(d, h))
      toast.success(user?.is_public ? "Your public page is updated" : "Saved — turn your public page on in Profile to share it")
    } catch (err) {
      toast.error(apiError(err, "Couldn't save"))
    } finally { setSaving(false) }
  }

  const draft = useMemo(
    () => (preview ? { ...applyHidden(preview, hidden), design } : null), [preview, hidden, design])

  if (loadError) {
    return (
      <div className="text-center py-16">
        <p className="text-foreground font-medium">Couldn't load your page.</p>
        <Button variant="outline" className="mt-4" onClick={load}>Try again</Button>
      </div>
    )
  }
  if (!draft) {
    return (
      <div className="flex flex-col lg:flex-row gap-4">
        <Skeleton className="lg:w-[360px] h-[70vh] rounded-xl" />
        <Skeleton className="flex-1 h-[70vh] rounded-xl" />
      </div>
    )
  }

  const sectionLabel = (s: PublicSection) => PUBLIC_SECTIONS.find((x) => x.value === s)?.label ?? s

  return (
    <div className="flex flex-col lg:h-[calc(100vh-4rem)] lg:-m-6 lg:-mt-2">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 lg:px-6 py-3 border-b border-border bg-background">
        <Link href="/career-profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Career Profile
        </Link>
        <h1 className="text-lg font-bold font-serif text-foreground">Customize public page</h1>
        {dirty && <span className="text-xs text-warning">Unsaved changes</span>}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setDesign(DEFAULT_DESIGN); setHidden(new Set()) }}>
            <RotateCcw className="h-4 w-4 mr-1.5" /> Default
          </Button>
          {user?.is_public && user.username && (
            <a href={`/u/${user.username}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4 mr-1.5" /> Live page</Button>
            </a>
          )}
          <Button size="sm" onClick={save} disabled={saving || !dirty} className="bg-primary text-primary-foreground hover:brightness-110">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />} Save
          </Button>
        </div>
      </div>

      {!user?.is_public && (
        <p className="text-sm rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 mt-3 lg:mx-6 text-foreground">
          Your public page is off — only you can see this preview.{" "}
          <Link href="/profile" className="text-primary hover:underline">Turn it on in Profile</Link> to share it.
        </p>
      )}

      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
        {/* ── Controls ── */}
        <div className="lg:w-[360px] flex-shrink-0 lg:overflow-y-auto lg:border-r border-border py-4 lg:px-5 space-y-6">
          <Group title="Layout">
            <div className="grid grid-cols-3 gap-2">
              {LAYOUTS.map((l) => (
                <button key={l.value} type="button" aria-pressed={design.layout === l.value} onClick={() => pickLayout(l.value)}
                  className={cn("rounded-lg border p-2 text-left transition-colors",
                    design.layout === l.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40")}>
                  <LayoutThumb layout={l.value} />
                  <span className="block text-xs font-semibold text-foreground mt-1.5">{l.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{LAYOUTS.find((l) => l.value === design.layout)?.hint}</p>
          </Group>

          <Group title="Accent colour">
            <div className="flex flex-wrap gap-2.5">
              {ACCENTS.map((a) => (
                <button key={a.value} type="button" onClick={() => set({ accent: a.value })}
                  aria-pressed={design.accent === a.value} aria-label={a.label} title={a.label}
                  className={cn("w-8 h-8 rounded-full ring-offset-2 ring-offset-background transition-shadow",
                    design.accent === a.value ? "ring-2 ring-foreground" : "hover:ring-2 hover:ring-border")}
                  style={{ background: a.swatch }} />
              ))}
            </div>
          </Group>

          <Group title="Heading font">
            <Segmented value={design.font} onChange={(v) => set({ font: v })}
              options={FONTS.map((f) => ({ value: f.value, label: <span className={cn("text-sm", f.sample)}>Aa · {f.label}</span> }))} />
          </Group>

          <Group title="Theme">
            <Segmented value={design.mode} onChange={(v) => set({ mode: v })}
              options={MODES.map((m) => ({ value: m.value, label: m.label }))} />
          </Group>

          <Group title="Banner">
            <div className="grid grid-cols-4 gap-2">
              {BANNER_PATTERNS.map((b) => {
                const active = design.banner.kind === "pattern" && design.banner.value === b.value
                return (
                  <button key={b.value} type="button" aria-pressed={active}
                    onClick={() => set({ banner: { kind: "pattern", value: b.value } })}
                    className={cn("rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                      active ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground")}>
                    {b.label}
                  </button>
                )
              })}
            </div>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
              onChange={(e) => { uploadBanner(e.target.files?.[0]); e.target.value = "" }} />
            {design.banner.kind === "image" ? (
              <div className="mt-2 flex items-center gap-2">
                <img src={media(design.banner.value)} alt="Your banner" className="h-12 flex-1 min-w-0 rounded-md object-cover border border-border" />
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>Change</Button>
                <Button variant="ghost" size="sm" aria-label="Remove banner image"
                  onClick={() => set({ banner: { kind: "pattern", value: "grid" } })}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <ImagePlus className="h-4 w-4 mr-1.5" />}
                Upload a banner image
              </Button>
            )}
            <p className="text-xs text-muted-foreground mt-1.5">Use a wide 4:1 image (e.g. 1600×400). Keep text and faces near the centre — phones trim the sides slightly.</p>
          </Group>

          <Group title="Sections" hint="Order and visibility. Name, photo, headline and college always show.">
            <ul className="rounded-lg border border-border divide-y divide-border/60">
              {design.section_order.map((s, i) => (
                <li key={s} className={cn("flex items-center gap-2 px-2.5 py-1.5", hidden.has(s) && "opacity-60")}>
                  <span className="flex-1 text-sm text-foreground">{sectionLabel(s)}</span>
                  <MiniBtn label={`Move ${sectionLabel(s)} up`} onClick={() => moveSection(i, -1)} disabled={i === 0}><ChevronUp className="h-4 w-4" /></MiniBtn>
                  <MiniBtn label={`Move ${sectionLabel(s)} down`} onClick={() => moveSection(i, 1)} disabled={i === design.section_order.length - 1}><ChevronDown className="h-4 w-4" /></MiniBtn>
                  <Switch checked={!hidden.has(s)} onCheckedChange={(v) => toggleSection(s, v)} aria-label={`Show ${sectionLabel(s)}`} />
                </li>
              ))}
            </ul>
          </Group>
        </div>

        {/* ── Live preview ── */}
        <div className="flex-1 lg:overflow-y-auto bg-secondary/40 lg:p-6 py-4">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5" /> Live preview</p>
          <div className="rounded-xl border border-border overflow-hidden shadow-xl" aria-label="Preview of your public page">
            <PublicProfileView p={draft} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-foreground mb-2">{title}</h2>
      {hint && <p className="text-xs text-muted-foreground -mt-1 mb-2">{hint}</p>}
      {children}
    </section>
  )
}

function Segmented<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]
}) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-secondary/60" role="group">
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={cn("flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
            value === o.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function MiniBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:pointer-events-none">
      {children}
    </button>
  )
}

/** Tiny schematic of each layout for the picker. The Developer thumbnail is
 *  intentionally dark in both themes — it depicts that layout's look. */
function LayoutThumb({ layout }: { layout: Layout }) {
  const dark = layout === "developer"
  return (
    <div aria-hidden className={cn("h-14 rounded-md border p-1.5 flex flex-col gap-1",
      dark ? "bg-zinc-900 border-zinc-700" : "bg-background border-border")}>
      <div className={cn("flex items-center gap-1", layout === "minimal" && "justify-center")}>
        <span className={cn("w-3 h-3 rounded-full", dark ? "bg-emerald-500/70" : "bg-primary/60")} />
        <span className={cn("h-1.5 w-8 rounded", dark ? "bg-zinc-600" : "bg-muted-foreground/40")} />
      </div>
      {layout === "classic" && <div className="grid grid-cols-4 gap-0.5">{[0, 1, 2, 3].map((i) => <span key={i} className="h-1.5 rounded bg-muted-foreground/25" />)}</div>}
      <div className={cn("grid gap-0.5 mt-auto", layout === "minimal" ? "grid-cols-1 px-2" : "grid-cols-2")}>
        <span className={cn("h-2.5 rounded", dark ? "bg-zinc-700" : "bg-muted-foreground/20")} />
        <span className={cn("h-2.5 rounded", dark ? "bg-zinc-700" : "bg-muted-foreground/20", layout === "minimal" && "hidden")} />
      </div>
    </div>
  )
}
