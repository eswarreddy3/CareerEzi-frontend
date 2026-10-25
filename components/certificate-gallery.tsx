"use client"

// Certificate gallery for the public portfolio: real certificate thumbnails in a
// compact grid (first 6, then "Show all"), filter chips, and a lightbox with
// ← / → navigation. CareerEzi certificates render from the backend
// (/api/public/certificates/<uid>.webp); outside certificates get a styled tile.

import { useEffect, useState, type KeyboardEvent } from "react"
import { motion } from "framer-motion"
import { Award, ChevronLeft, ChevronRight, ExternalLink, FileText, ShieldCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { media, type PublicCertificate } from "@/lib/public-profile"
import type { Certification } from "@/lib/career-profile"
import { formatYM } from "@/lib/ym"
import { cn } from "@/lib/utils"

type Kind = "domain" | "course" | "external"

interface Tile {
  key: string
  kind: Kind
  title: string
  issuer: string
  date: string
  verified: boolean
  thumb?: string
  large?: string
  verifyHref?: string
  pdfHref?: string
  credentialHref?: string
  credentialId?: string
}

const FILTERS: { value: Kind | "all"; label: string }[] = [
  { value: "all", label: "All" }, { value: "domain", label: "Domain tracks" },
  { value: "course", label: "Courses" }, { value: "external", label: "Other" },
]
const INITIAL = 6

function fmtIssued(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""
}

export function CertificateGallery({ certificates, external }: {
  certificates: PublicCertificate[]
  external: Omit<Certification, "is_public" | "sort_order">[]
}) {
  const tiles: Tile[] = [
    ...certificates.map((c): Tile => {
      const img = c.image_url ? media(c.image_url) : undefined
      return {
        key: c.certificate_uid, kind: c.kind, title: c.title, issuer: c.issuer, date: fmtIssued(c.issued_at),
        verified: true, thumb: img && `${img}?w=480`, large: img && `${img}?w=1200`,
        verifyHref: `/verify/${c.certificate_uid}`, pdfHref: c.pdf_url ? media(c.pdf_url) : undefined,
        credentialId: c.certificate_uid,
      }
    }),
    ...external.map((c): Tile => ({
      key: `x${c.id}`, kind: "external", title: c.name, issuer: c.issuer ?? "", date: formatYM(c.issue_date),
      verified: false, credentialHref: c.credential_url ?? undefined, credentialId: c.credential_id ?? undefined,
    })),
  ]
  const [filter, setFilter] = useState<Kind | "all">("all")
  const [expanded, setExpanded] = useState(false)
  const [open, setOpen] = useState<number | null>(null)

  const counts = { domain: 0, course: 0, external: 0 } as Record<Kind, number>
  tiles.forEach((t) => counts[t.kind]++)
  const filters = FILTERS.filter((f) => f.value === "all" || counts[f.value as Kind] > 0)
  const visible = tiles.filter((t) => filter === "all" || t.kind === filter)
  const shown = expanded ? visible : visible.slice(0, INITIAL)
  const verifiedCount = tiles.filter((t) => t.verified).length

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{tiles.length}</span> certificate{tiles.length !== 1 && "s"}
          {verifiedCount > 0 && <> · <span className="text-success font-medium">{verifiedCount} verified by CareerEzi</span></>}
        </p>
        {filters.length > 2 && (
          <div className="flex flex-wrap gap-1.5 sm:ml-auto" role="group" aria-label="Filter certificates">
            {filters.map((f) => {
              const n = f.value === "all" ? tiles.length : counts[f.value as Kind]
              return (
                <button key={f.value} type="button" aria-pressed={filter === f.value}
                  onClick={() => { setFilter(f.value); setExpanded(false) }}
                  className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                    filter === f.value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                  {f.label} <span className="opacity-70 tabular-nums">{n}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {shown.map((t) => (
          <motion.li key={t.key} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button type="button" onClick={() => setOpen(visible.indexOf(t))}
              aria-label={`${t.title} — open certificate`}
              className="group w-full text-left rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-[box-shadow,border-color] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
              <div className="relative aspect-[1.414] bg-secondary overflow-hidden">
                {t.thumb ? (
                  <img src={t.thumb} alt="" loading="lazy" decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-card p-3 text-center">
                    <Award className="h-7 w-7 text-muted-foreground" aria-hidden />
                    <span className="text-[11px] font-medium text-muted-foreground line-clamp-2">{t.issuer || "Certificate"}</span>
                  </div>
                )}
                {t.verified && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-background/90 text-[10px] font-semibold text-success shadow-sm">
                    <ShieldCheck className="h-3 w-3" aria-hidden /> Verified
                  </span>
                )}
              </div>
              <div className="px-3 py-2.5">
                {/* two lines reserved so tiles line up when some titles wrap */}
                <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.5em]">{t.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{[t.date, t.issuer].filter(Boolean).join(" · ")}</p>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>

      {visible.length > INITIAL && (
        <div className="text-center mt-4">
          <button type="button" onClick={() => setExpanded((e) => !e)}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-card hover:border-primary/40 text-foreground">
            {expanded ? "Show fewer" : `Show all ${visible.length}`}
          </button>
        </div>
      )}

      <Lightbox tiles={visible} index={open} onIndex={setOpen} />
    </div>
  )
}

function Lightbox({ tiles, index, onIndex }: { tiles: Tile[]; index: number | null; onIndex: (i: number | null) => void }) {
  const t = index !== null ? tiles[index] : null
  const go = (d: -1 | 1) => index !== null && onIndex((index + d + tiles.length) % tiles.length)
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1) }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1) }
  }
  // Warm the neighbours so arrowing through feels instant.
  useEffect(() => {
    if (index === null) return
    for (const d of [-1, 1]) {
      const n = tiles[(index + d + tiles.length) % tiles.length]
      if (n?.large) { const img = new Image(); img.src = n.large }
    }
  }, [index, tiles])

  return (
    <Dialog open={!!t} onOpenChange={(o) => !o && onIndex(null)}>
      <DialogContent onKeyDown={onKey} className="bg-popover border-border max-w-4xl p-0 overflow-hidden gap-0">
        {t && (
          <>
            <div className="relative bg-secondary">
              {t.large ? (
                <img src={t.large} alt={`${t.title} certificate`} className="w-full h-auto max-h-[70vh] object-contain" />
              ) : (
                <div className="aspect-[2.2] flex flex-col items-center justify-center gap-3 text-center p-6">
                  <Award className="h-10 w-10 text-muted-foreground" aria-hidden />
                  <p className="text-sm text-muted-foreground">Issued outside CareerEzi{t.issuer ? ` by ${t.issuer}` : ""}</p>
                </div>
              )}
              {tiles.length > 1 && (
                <>
                  <NavBtn side="left" label="Previous certificate" onClick={() => go(-1)}><ChevronLeft className="h-5 w-5" /></NavBtn>
                  <NavBtn side="right" label="Next certificate" onClick={() => go(1)}><ChevronRight className="h-5 w-5" /></NavBtn>
                </>
              )}
            </div>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="min-w-0 flex-1">
                <DialogTitle className="font-serif text-lg text-foreground">{t.title}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {[t.issuer, t.date].filter(Boolean).join(" · ")}
                  {t.credentialId && <span className="block font-mono text-[11px] mt-0.5">ID {t.credentialId}</span>}
                </DialogDescription>
              </div>
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                {t.verifyHref && (
                  <a href={t.verifyHref} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:brightness-110">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verify
                  </a>
                )}
                {t.pdfHref && (
                  <a href={t.pdfHref} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-secondary/60 text-foreground border border-border hover:border-primary/30">
                    <FileText className="h-3.5 w-3.5" /> PDF
                  </a>
                )}
                {t.credentialHref && (
                  <a href={t.credentialHref} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-secondary/60 text-foreground border border-border hover:border-primary/30">
                    <ExternalLink className="h-3.5 w-3.5" /> Show credential
                  </a>
                )}
              </div>
            </div>
            {tiles.length > 1 && (
              <p className="px-5 pb-4 -mt-2 text-[11px] text-muted-foreground tabular-nums">
                {index! + 1} of {tiles.length} · use ← → to browse
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function NavBtn({ side, label, onClick, children }: { side: "left" | "right"; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}
      className={cn("absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/85 text-foreground shadow flex items-center justify-center hover:bg-background",
        side === "left" ? "left-3" : "right-3")}>
      {children}
    </button>
  )
}
