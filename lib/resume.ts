// Resume = Career Profile facts + this resume's choices.
//
// The Career Profile is the source of truth. A resume (stored in
// students.resume_data, format version 2 — see backend app/services/resume.py)
// only records what differs: items left out, a resume-specific order, per-field
// overrides ("Only this resume" edits), resume-only extra items, and the
// template/objective. New profile items appear on the resume automatically.

import type {
  CareerProfile, Education, Project, Experience, Achievement, Certification, Skill, About,
} from "@/lib/career-profile"
import { EDUCATION_LEVEL_SHORT } from "@/lib/career-profile-labels"
import { formatYM } from "@/lib/ym"
import { media } from "@/lib/public-profile"

// ─── What the templates render ──────────────────────────────────────────────

export interface PersonalInfo {
  name: string; email: string; phone: string; location: string
  linkedin: string; github: string; website: string
}
export interface EduItem { id: string; school: string; degree: string; field: string; start: string; end: string; gpa: string }
export interface ExpItem { id: string; company: string; role: string; start: string; end: string; current: boolean; description: string }
export interface ProjItem {
  id: string; name: string; tech: string; description: string
  /** live || repo — kept for older readers; templates use live_url / repo_url via ProjectLinks. */
  link: string
  live_url: string; repo_url: string
}
export interface CertItem { id: string; name: string; issuer: string; year: string; /** credential or CareerEzi verify page */ url: string }
export interface AchieveItem { id: string; title: string; description: string; year: string }
export interface ResumeData {
  personal: PersonalInfo
  /** Uploaded photo URL; "" = photo on but none uploaded (templates show initials); null = switched off. */
  photo: string | null
  objective: string
  summary: string
  experience: ExpItem[]
  education: EduItem[]
  projects: ProjItem[]
  skills: string
  strengths: string
  languages: string
  hobbies: string
  certifications: CertItem[]
  achievements: AchieveItem[]
}

/** Every template downloads as REAL TEXT. "ats" is rendered by the backend in one click
 *  (/student/resume/pdf); the designs use the browser's "Save as PDF". The layout decides
 *  how safely an ATS reads it — keep in sync with TEMPLATE_LAYOUT in backend resume_ats.py. */
export type TemplateLayout = "ats" | "single" | "two"
export const TEMPLATE_LAYOUT: Record<string, TemplateLayout> = {
  ats: "ats",
  classic: "single", minimal: "single", porygon: "single",
  modern: "two", sharp: "two", elegant: "two", azurill: "two", ditgar: "two", pikachu: "two",
}
export const layoutOf = (t: string): TemplateLayout => TEMPLATE_LAYOUT[t] ?? "two"

export type TemplateId =
  | "ats"                                              // real-text PDF from the backend (app/services/resume_pdf.py)
  | "modern" | "classic" | "minimal" | "sharp" | "elegant"
  | "azurill" | "ditgar" | "pikachu" | "porygon"     // designs after Reactive Resume (MIT)

// ─── What is stored ─────────────────────────────────────────────────────────

export type ListSection = "education" | "projects" | "experience" | "achievements" | "certifications"
export type ResumeSection = ListSection | "skills"
export type TextField = "summary" | "strengths" | "languages" | "hobbies"

interface ItemTypes {
  education: Education; projects: Project; experience: Experience
  achievements: Achievement; certifications: Certification
}
/** A resume-only item: the same fields as a profile item, with an 'x_…' id. */
export type ExtraItem<S extends ListSection> = Omit<ItemTypes[S], "id" | "sort_order" | "is_public"> & { id: string }

export interface Override { values: Record<string, unknown>; base: Record<string, unknown> }

export interface ResumeDoc {
  id: string
  name: string
  template: TemplateId
  objective: string
  /** Print the Career Profile photo on templates that have a photo slot. */
  show_photo: boolean
  excluded: Partial<Record<ResumeSection, string[]>>
  order: Partial<Record<ResumeSection, string[]>>
  /** "projects:12" → only the changed fields, plus the profile values they replaced. */
  overrides: Record<string, Override>
  extras: { [S in ListSection]?: ExtraItem<S>[] }
  text: Partial<Record<TextField, string>>
  personal: Partial<PersonalInfo>
}

export interface ResumeStore { version: 2; active_id: string; resumes: ResumeDoc[] }

export function newResume(id = "main", name = "My resume"): ResumeDoc {
  return { id, name, template: "ats", objective: "", show_photo: true, excluded: {}, order: {}, overrides: {}, extras: {}, text: {}, personal: {} }
}

/** Anything that isn't a v2 store (old one-blob resumes, empty) starts fresh —
 *  the old content was already copied into the Career Profile by the backend. */
export function loadStore(raw: unknown): ResumeStore {
  const r = raw as Partial<ResumeStore> | null
  if (r && r.version === 2 && Array.isArray(r.resumes) && r.resumes.length) {
    return {
      version: 2,
      active_id: r.resumes.some((d) => d.id === r.active_id) ? r.active_id! : r.resumes[0].id,
      resumes: r.resumes.map((d) => ({ ...newResume(d.id, d.name), ...d })),
    }
  }
  return { version: 2, active_id: "main", resumes: [newResume()] }
}

/** Where CareerEzi's public pages live — the verify link printed on resumes. */
const siteOrigin = () => (typeof window !== "undefined" ? window.location.origin : "https://www.careerezi.com")

export const extraId = () => `x_${Math.random().toString(36).slice(2, 10)}`

// ─── Rows: one per item, as the editor and the templates see it ─────────────

export type RowSource = "profile" | "extra" | "verified"

export interface Row<T> {
  key: string
  source: RowSource
  /** Profile values with this resume's overrides applied. */
  item: T
  /** The untouched profile item (profile rows only). */
  profileItem?: T
  included: boolean
  /** Fields overridden for this resume. */
  overridden: string[]
  /** The profile changed one of those fields after it was overridden. */
  stale: boolean
}

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)

function ordered<T extends { key: string }>(rows: T[], order: string[] | undefined): T[] {
  if (!order?.length) return rows
  const byKey = new Map(rows.map((r) => [r.key, r]))
  const first = order.map((k) => byKey.get(k)).filter(Boolean) as T[]
  const placed = new Set(first.map((r) => r.key))
  return [...first, ...rows.filter((r) => !placed.has(r.key))]     // new items go last
}

export function listRows<S extends ListSection>(section: S, profile: CareerProfile, doc: ResumeDoc): Row<ItemTypes[S]>[] {
  const excluded = new Set(doc.excluded[section] ?? [])
  const rows: Row<ItemTypes[S]>[] = (profile[section] as ItemTypes[S][]).map((p) => {
    const key = String(p.id)
    const ov = doc.overrides[`${section}:${key}`]
    const overridden = ov ? Object.keys(ov.values) : []
    return {
      key, source: "profile" as const,
      item: (ov ? { ...p, ...ov.values } : p) as ItemTypes[S],
      profileItem: p,
      included: !excluded.has(key),
      overridden,
      stale: !!ov && Object.keys(ov.base).some((f) => !same((p as any)[f], ov.base[f])),
    }
  })
  if (section === "certifications") {
    // CareerEzi certificates: verified, so not editable — only include/exclude.
    for (const c of profile.verified_certificates) {
      const key = `v_${c.certificate_uid}`
      rows.push({
        key, source: "verified", included: !excluded.has(key), overridden: [], stale: false,
        item: {
          id: -1, sort_order: 0, is_public: true, name: c.title, issuer: c.issuer,
          issue_date: c.issued_at ? c.issued_at.slice(0, 7) : null, credential_id: c.certificate_uid,
          credential_url: `${siteOrigin()}/verify/${c.certificate_uid}`,
        } as unknown as ItemTypes[S],
      })
    }
  }
  for (const x of (doc.extras[section] ?? []) as ExtraItem<S>[]) {
    rows.push({
      key: x.id, source: "extra", included: !excluded.has(x.id), overridden: [], stale: false,
      item: x as unknown as ItemTypes[S],
    })
  }
  return ordered(rows, doc.order[section])
}

export function skillRows(profile: CareerProfile, doc: ResumeDoc): Row<Skill>[] {
  const excluded = new Set(doc.excluded.skills ?? [])
  return ordered(profile.skills.map((s) => ({
    key: String(s.id), source: "profile" as const, item: s, profileItem: s,
    included: !excluded.has(String(s.id)), overridden: [], stale: false,
  })), doc.order.skills)
}

/** Profile value behind a resume text field (summary ↔ About). */
export function profileText(about: About, field: TextField): string {
  return (field === "summary" ? about.about : about[field]) ?? ""
}

export interface AccountInfo {
  name?: string; email?: string; phone?: string | null; linkedin?: string | null; github?: string | null
  avatar?: string | null
}

export function profilePersonal(account: AccountInfo, about: About): PersonalInfo {
  return {
    name: account.name ?? "", email: account.email ?? "", phone: account.phone ?? "",
    location: about.location ?? "", linkedin: account.linkedin ?? "", github: account.github ?? "",
    website: about.website ?? "",
  }
}

// ─── Overrides ──────────────────────────────────────────────────────────────

/** Record an "Only this resume" edit: keep only fields that differ from the
 *  profile, remembering the profile value each one replaced. */
export function withOverride(doc: ResumeDoc, section: ListSection, profileItem: object, values: Record<string, unknown>): ResumeDoc {
  const key = `${section}:${(profileItem as { id: number }).id}`
  const p = profileItem as Record<string, unknown>
  const prev = doc.overrides[key]
  const diff: Record<string, unknown> = {}, base: Record<string, unknown> = {}
  for (const [f, v] of Object.entries(values)) {
    if (!(f in p) || same(v, p[f])) continue
    diff[f] = v
    // keep the original snapshot for fields that were already overridden
    base[f] = prev && f in prev.base ? prev.base[f] : p[f]
  }
  const overrides = { ...doc.overrides }
  if (Object.keys(diff).length) overrides[key] = { values: diff, base }
  else delete overrides[key]
  return { ...doc, overrides }
}

export function withoutOverride(doc: ResumeDoc, section: ListSection, key: string): ResumeDoc {
  const overrides = { ...doc.overrides }
  delete overrides[`${section}:${key}`]
  return { ...doc, overrides }
}

/** Drop overrides / exclusions / order entries for items that no longer exist. */
export function pruneDoc(doc: ResumeDoc, profile: CareerProfile): ResumeDoc {
  const live: Record<ResumeSection, Set<string>> = {
    education: new Set(profile.education.map((i) => String(i.id))),
    projects: new Set(profile.projects.map((i) => String(i.id))),
    experience: new Set(profile.experience.map((i) => String(i.id))),
    achievements: new Set(profile.achievements.map((i) => String(i.id))),
    certifications: new Set([
      ...profile.certifications.map((i) => String(i.id)),
      ...profile.verified_certificates.map((c) => `v_${c.certificate_uid}`),
    ]),
    skills: new Set(profile.skills.map((i) => String(i.id))),
  }
  for (const [s, xs] of Object.entries(doc.extras)) for (const x of xs ?? []) live[s as ResumeSection].add(x.id)
  const keep = (m: ResumeDoc["excluded"]) => Object.fromEntries(
    Object.entries(m).map(([s, keys]) => [s, (keys ?? []).filter((k) => live[s as ResumeSection]?.has(k))]))
  const overrides = Object.fromEntries(Object.entries(doc.overrides).filter(([k]) => {
    const [s, id] = k.split(":")
    return live[s as ResumeSection]?.has(id)
  }))
  return { ...doc, excluded: keep(doc.excluded), order: keep(doc.order), overrides }
}

// ─── Build what the templates render ────────────────────────────────────────

function eduScore(e: Education): string {
  if (!e.score) return ""
  return e.score_type === "cgpa" ? `${e.score} CGPA` : e.score_type === "percent" ? `${e.score}%` : e.score
}
/** Only uploaded photos go on a resume — the preset avatars are cartoons. */
export const uploadedPhoto = (avatar: string | null | undefined) =>
  avatar && avatar.includes("/static/uploads/") ? media(avatar)! : ""

const bare = (url: string | null | undefined) => (url ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "")

export function buildResumeData(profile: CareerProfile, account: AccountInfo, doc: ResumeDoc): ResumeData {
  const inc = <T,>(rows: Row<T>[]) => rows.filter((r) => r.included)
  const personal = { ...profilePersonal(account, profile.about) }
  for (const [k, v] of Object.entries(doc.personal)) if (typeof v === "string") personal[k as keyof PersonalInfo] = v
  const text = (f: TextField) => doc.text[f] ?? profileText(profile.about, f)

  return {
    personal: { ...personal, linkedin: bare(personal.linkedin), github: bare(personal.github), website: bare(personal.website) },
    photo: doc.show_photo ? uploadedPhoto(account.avatar) : null,
    objective: doc.objective,
    summary: text("summary"),
    strengths: text("strengths"),
    languages: text("languages"),
    hobbies: text("hobbies"),
    skills: inc(skillRows(profile, doc)).map((r) => r.item.name).join(", "),
    experience: inc(listRows("experience", profile, doc)).map(({ key, item: x }) => ({
      id: key, company: x.company, role: x.role, start: formatYM(x.start_date), end: formatYM(x.end_date),
      current: x.is_current, description: x.description ?? "",
    })),
    education: inc(listRows("education", profile, doc)).map(({ key, item: e }) => {
      // Templates print "<degree> in <field>": "Intermediate in MPC", "B.Tech – CSE".
      const school = ["intermediate", "ssc", "diploma"].includes(e.level)
      return {
        id: key, school: e.institution,
        degree: school ? EDUCATION_LEVEL_SHORT[e.level] : (e.field || EDUCATION_LEVEL_SHORT[e.level]),
        field: school ? (e.field ?? "") : "",
        start: formatYM(e.start_date), end: e.is_current ? "Present" : formatYM(e.end_date),
        gpa: eduScore(e),     // the resume always shows the score; show_score is for the public page
      }
    }),
    projects: inc(listRows("projects", profile, doc)).map(({ key, item: p }) => ({
      id: key, name: p.title,
      tech: [p.skills?.join(", "), p.is_team ? `Team of ${p.team_size ?? "several"}${p.role ? `, ${p.role}` : ""}` : ""]
        .filter(Boolean).join(" · "),
      description: p.description ?? "",
      link: bare(p.live_url || p.repo_url),
      live_url: bare(p.live_url), repo_url: bare(p.repo_url),
    })),
    certifications: inc(listRows("certifications", profile, doc)).map(({ key, item: c }) => ({
      id: key, name: c.name, issuer: c.issuer ?? "", year: formatYM(c.issue_date), url: bare(c.credential_url),
    })),
    achievements: inc(listRows("achievements", profile, doc)).map(({ key, item: a }) => ({
      id: key, title: a.title, description: a.description ?? "", year: formatYM(a.date),
    })),
  }
}
