// Contact links for every resume template. LinkedIn and GitHub print as the words
// "LinkedIn" / "GitHub" with the full https:// URL behind them; email gets mailto:,
// a website stays visible as its address. The browser keeps <a href> as clickable
// links when the student uses "Save as PDF"; the backend's ATS PDF does the same
// (app/services/resume_pdf.py). Colour is inherited so each template keeps its look.

import type { CSSProperties, ReactNode } from "react"
import { Fragment } from "react"
import type { PersonalInfo, ProjItem, CertItem } from "@/lib/resume"

const URL_RE = /^(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/?#][^\s"<>]*)?$/i

/** "linkedin.com/in/priya" → "https://linkedin.com/in/priya"; "" when the value isn't a web
 *  address (it is then shown as plain text, never linked). Same rule as backend resume_pdf._href. */
export const hrefOf = (url: string) => {
  const u = (url || "").trim()
  if (!URL_RE.test(u)) return ""
  return /^https?:\/\//i.test(u) ? u : `https://${u}`
}

const linkStyle: CSSProperties = { color: "inherit", textDecoration: "underline", textUnderlineOffset: 2 }

export function ResumeLink({ href, children, style }: { href: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, ...style }}>{children}</a>
  )
}

export type ContactKind = "email" | "phone" | "location" | "linkedin" | "github" | "website"

/** One rendered contact item per filled field, in the usual order. */
export function contactItems(p: PersonalInfo, kinds: ContactKind[] = ["email", "phone", "location", "linkedin", "github", "website"]):
  { kind: ContactKind; node: ReactNode }[] {
  const out: { kind: ContactKind; node: ReactNode }[] = []
  for (const kind of kinds) {
    const v = p[kind]
    if (!v) continue
    const node =
      kind === "email" ? <ResumeLink href={`mailto:${v}`} style={{ textDecoration: "none" }}>{v}</ResumeLink>
      : kind === "linkedin" || kind === "github" || kind === "website"
        ? (hrefOf(v)
          ? <ResumeLink href={hrefOf(v)}>{kind === "linkedin" ? "LinkedIn" : kind === "github" ? "GitHub" : v}</ResumeLink>
          : v)
      : v
    out.push({ kind, node })
  }
  return out
}

/** Project links: "Live Demo" (live URL) and "GitHub" / "Source Code" (repo URL). Same
 *  labels as backend resume_pdf._project_links. Renders nothing when there are none. */
export function projectLinks(p: ProjItem): { label: string; href: string }[] {
  const out: { label: string; href: string }[] = []
  const live = hrefOf(p.live_url), repo = hrefOf(p.repo_url)
  if (live) out.push({ label: "Live Demo", href: live })
  if (repo) out.push({ label: /(^|\.)github\.com/i.test(new URL(repo).hostname) ? "GitHub" : "Source Code", href: repo })
  return out
}

export function ProjectLinks({ proj, sep = " | " }: { proj: ProjItem; sep?: string }) {
  const links = projectLinks(proj)
  if (!links.length) return null
  return <>{links.map((l, i) => <Fragment key={l.label}>{i > 0 && sep}<ResumeLink href={l.href}>{l.label}</ResumeLink></Fragment>)}</>
}

/** "Certificate" link to the credential (or CareerEzi verify page); nothing when there is no valid URL. */
export function CertLink({ cert, prefix = "" }: { cert: CertItem; prefix?: string }) {
  const href = hrefOf(cert.url)
  if (!href) return null
  return <>{prefix}<ResumeLink href={href}>Certificate</ResumeLink></>
}
