"use client"

// Left panel of the resume builder. Facts come from the Career Profile; this
// panel only chooses what goes on the resume and records resume-only edits.
// Editing an item opens the SAME form as the Career Profile page, with an extra
// "Only this resume" button.

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  ChevronUp, ChevronDown, Pencil, Plus, RotateCcw, Trash2, BadgeCheck, AlertTriangle, IdCard, ExternalLink,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ItemDialog } from "@/components/career-profile/item-forms"
import { SkillsEditor } from "@/components/career-profile/skills-editor"
import {
  saveAbout, apiError, type CareerProfile, type SectionItems, type About,
} from "@/lib/career-profile"
import { EDUCATION_LEVEL_SHORT } from "@/lib/career-profile-labels"
import { formatRange, formatYM } from "@/lib/ym"
import {
  listRows, skillRows, profileText, profilePersonal, withOverride, withoutOverride, extraId, uploadedPhoto,
  type ResumeDoc, type ListSection, type TextField, type Row, type PersonalInfo, type AccountInfo,
} from "@/lib/resume"
import { cn } from "@/lib/utils"

interface Props {
  profile: CareerProfile
  setProfile: (fn: (p: CareerProfile) => CareerProfile) => void
  doc: ResumeDoc
  updateDoc: (fn: (d: ResumeDoc) => ResumeDoc) => void
  account: AccountInfo
}

type DialogState = { section: ListSection; row?: Row<SectionItems[ListSection]> } | null

const SECTION_META: Record<ListSection, { title: string; add: string }> = {
  experience: { title: "Work Experience", add: "Add experience" },
  education: { title: "Education", add: "Add education" },
  projects: { title: "Projects", add: "Add project" },
  certifications: { title: "Certifications", add: "Add certification" },
  achievements: { title: "Achievements", add: "Add achievement" },
}

function rowLabel(section: ListSection, item: any): { title: string; sub: string } {
  switch (section) {
    case "education": return { title: item.field || EDUCATION_LEVEL_SHORT[item.level as keyof typeof EDUCATION_LEVEL_SHORT], sub: [item.institution, formatRange(item.start_date, item.end_date, item.is_current)].filter(Boolean).join(" · ") }
    case "projects": return { title: item.title, sub: (item.skills ?? []).join(", ") }
    case "experience": return { title: item.role, sub: [item.company, formatRange(item.start_date, item.end_date, item.is_current)].filter(Boolean).join(" · ") }
    case "achievements": return { title: item.title, sub: [item.organization, formatYM(item.date)].filter(Boolean).join(" · ") }
    case "certifications": return { title: item.name, sub: [item.issuer, formatYM(item.issue_date)].filter(Boolean).join(" · ") }
  }
}

export function ResumeEditor({ profile, setProfile, doc, updateDoc, account }: Props) {
  const [dialog, setDialog] = useState<DialogState>(null)
  const [manageSkills, setManageSkills] = useState(false)

  const isEmpty = !profile.education.length && !profile.projects.length && !profile.experience.length && !profile.skills.length

  // ── list operations ──
  const toggle = (section: ListSection | "skills", key: string, include: boolean) =>
    updateDoc((d) => {
      const cur = new Set(d.excluded[section] ?? [])
      if (include) cur.delete(key); else cur.add(key)
      return { ...d, excluded: { ...d.excluded, [section]: [...cur] } }
    })

  const move = (section: ListSection, rows: Row<unknown>[], i: number, dir: -1 | 1) => {
    const keys = rows.map((r) => r.key)
    const j = i + dir
    if (j < 0 || j >= keys.length) return
    ;[keys[i], keys[j]] = [keys[j], keys[i]]
    updateDoc((d) => ({ ...d, order: { ...d.order, [section]: keys } }))
  }

  const removeExtra = (section: ListSection, key: string) =>
    updateDoc((d) => ({ ...d, extras: { ...d.extras, [section]: (d.extras[section] ?? []).filter((x) => x.id !== key) } }))

  const onProfileSaved = (section: ListSection, saved: SectionItems[ListSection], row?: Row<unknown>) => {
    setProfile((p) => {
      const list = p[section] as SectionItems[ListSection][]
      const exists = list.some((i) => i.id === saved.id)
      return { ...p, [section]: exists ? list.map((i) => (i.id === saved.id ? saved : i)) : [...list, saved] }
    })
    // "Save to profile" makes the profile the truth again for this item.
    if (row) updateDoc((d) => withoutOverride(d, section, row.key))
  }

  const onLocal = (section: ListSection, row: Row<unknown> | undefined, body: Record<string, unknown>) => {
    if (!row) {                                            // new resume-only item
      updateDoc((d) => ({ ...d, extras: { ...d.extras, [section]: [...(d.extras[section] ?? []), { ...body, id: extraId() }] } }))
      toast.success("Added to this resume only")
    } else if (row.source === "extra") {
      updateDoc((d) => ({ ...d, extras: { ...d.extras, [section]: (d.extras[section] ?? []).map((x) => (x.id === row.key ? { ...x, ...body } : x)) } }))
    } else {
      updateDoc((d) => withOverride(d, section, row.profileItem as object, body))
      toast.success("Changed for this resume only")
    }
  }

  const sections: ListSection[] = ["experience", "education", "projects", "certifications", "achievements"]

  return (
    <>
      <div className="rounded-xl border border-primary/25 bg-primary/5 p-3 mb-2 text-xs text-foreground">
        <p className="flex items-start gap-2">
          <IdCard className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <span>
            Built from your <Link href="/career-profile" className="text-primary font-medium hover:underline">Career Profile</Link>.
            Tick what goes on this resume. Edits can update your profile or apply to this resume only.
          </span>
        </p>
        {isEmpty && (
          <Link href="/career-profile" className="mt-2 inline-flex items-center gap-1 text-primary font-medium hover:underline">
            Your Career Profile is empty — add education and projects <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["personal", "projects"]} className="space-y-2">
        <Panel value="personal" title="Personal Info">
          <PersonalFields doc={doc} updateDoc={updateDoc} base={profilePersonal(account, profile.about)}
            hasPhoto={!!uploadedPhoto(account.avatar)} />
        </Panel>

        <Panel value="summary" title="Professional Summary" badge={doc.text.summary !== undefined}>
          <TextOverride field="summary" doc={doc} updateDoc={updateDoc} about={profile.about} rows={4}
            onSavedToProfile={(about) => setProfile((p) => ({ ...p, about }))}
            placeholder="A concise overview of your skills and goals…" />
        </Panel>

        <Panel value="objective" title="Career Objective">
          <Textarea className="bg-secondary/50 border-border text-foreground text-sm resize-none" rows={3}
            value={doc.objective} maxLength={1000} aria-label="Career objective"
            placeholder="A focused statement about the role you want — for this resume only."
            onChange={(e) => updateDoc((d) => ({ ...d, objective: e.target.value }))} />
        </Panel>

        {sections.map((section) => {
          const rows = listRows(section, profile, doc) as Row<any>[]
          const included = rows.filter((r) => r.included).length
          return (
            <Panel key={section} value={section} title={SECTION_META[section].title}
              count={rows.length ? `${included}/${rows.length}` : undefined}>
              {rows.length === 0 && <p className="text-xs text-muted-foreground mb-2">Nothing here yet.</p>}
              <ul className="space-y-1.5">
                {rows.map((row, i) => {
                  const { title, sub } = rowLabel(section, row.item)
                  return (
                    <li key={row.key} className={cn("rounded-lg border border-border/60 bg-secondary/30 p-2.5", !row.included && "opacity-60")}>
                      <div className="flex items-start gap-2.5">
                        <Checkbox checked={row.included} onCheckedChange={(v) => toggle(section, row.key, v === true)}
                          aria-label={`Include ${title} on this resume`} className="mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate flex items-center gap-1.5">
                            {row.source === "verified" && <BadgeCheck className="h-3.5 w-3.5 text-success flex-shrink-0" aria-label="Verified" />}
                            <span className="truncate">{title}</span>
                          </p>
                          {sub && <p className="text-[11px] text-muted-foreground truncate">{sub}</p>}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {row.source === "extra" && <Tag>Resume only</Tag>}
                            {row.overridden.length > 0 && <Tag tone="primary">Edited for this resume</Tag>}
                          </div>
                          {row.stale && (
                            <p className="text-[11px] text-warning mt-1 flex items-start gap-1">
                              <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                              Your profile changed since you edited this.
                            </p>
                          )}
                        </div>
                        <div className="flex items-center flex-shrink-0 -mr-1">
                          <MiniBtn label="Move up" onClick={() => move(section, rows, i, -1)} disabled={i === 0}><ChevronUp className="h-3.5 w-3.5" /></MiniBtn>
                          <MiniBtn label="Move down" onClick={() => move(section, rows, i, 1)} disabled={i === rows.length - 1}><ChevronDown className="h-3.5 w-3.5" /></MiniBtn>
                          {row.source !== "verified" && (
                            <MiniBtn label="Edit" onClick={() => setDialog({ section, row })}><Pencil className="h-3.5 w-3.5" /></MiniBtn>
                          )}
                          {row.overridden.length > 0 && (
                            <MiniBtn label="Reset to profile version" onClick={() => updateDoc((d) => withoutOverride(d, section, row.key))}>
                              <RotateCcw className="h-3.5 w-3.5" />
                            </MiniBtn>
                          )}
                          {row.source === "extra" && (
                            <MiniBtn label="Delete" onClick={() => removeExtra(section, row.key)} danger><Trash2 className="h-3.5 w-3.5" /></MiniBtn>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <Button type="button" size="sm" variant="outline" onClick={() => setDialog({ section })}
                className="w-full mt-2 border-dashed border-border/60 text-muted-foreground hover:text-foreground text-xs">
                <Plus className="h-3 w-3 mr-1" /> {SECTION_META[section].add}
              </Button>
            </Panel>
          )
        })}

        <Panel value="skills" title="Skills"
          count={profile.skills.length ? `${skillRows(profile, doc).filter((r) => r.included).length}/${profile.skills.length}` : undefined}>
          <p className="text-[11px] text-muted-foreground mb-2">Tap a skill to leave it off this resume.</p>
          <div className="flex flex-wrap gap-1.5">
            {skillRows(profile, doc).map((r) => (
              <button key={r.key} type="button" aria-pressed={r.included}
                onClick={() => toggle("skills", r.key, !r.included)}
                className={cn("rounded-full border px-2.5 py-1 text-xs transition-colors",
                  r.included ? "border-primary/40 bg-primary/10 text-foreground" : "border-dashed border-border text-muted-foreground line-through")}>
                {r.item.name}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setManageSkills((v) => !v)} className="text-xs text-primary hover:underline mt-3">
            {manageSkills ? "Done" : "Add or remove skills in your profile"}
          </button>
          {manageSkills && (
            <div className="mt-3">
              <SkillsEditor skills={profile.skills} showVisibility={false}
                onChange={(skills) => setProfile((p) => ({ ...p, skills }))} />
            </div>
          )}
        </Panel>

        {(["strengths", "languages", "hobbies"] as TextField[]).map((f) => (
          <Panel key={f} value={f} badge={doc.text[f] !== undefined}
            title={f === "strengths" ? "Strengths" : f === "languages" ? "Languages" : "Hobbies & Interests"}>
            <TextOverride field={f} doc={doc} updateDoc={updateDoc} about={profile.about} rows={2}
              onSavedToProfile={(about) => setProfile((p) => ({ ...p, about }))}
              placeholder="Comma-separated" />
          </Panel>
        ))}
      </Accordion>

      {dialog && (
        <ItemDialog section={dialog.section} open
          item={dialog.row ? (dialog.row.item as never) : null}
          onClose={() => setDialog(null)}
          onSaved={(saved) => onProfileSaved(dialog.section, saved, dialog.row)}
          resume={{
            localOnly: dialog.row?.source === "extra",
            onLocal: (body) => onLocal(dialog.section, dialog.row, body),
          }} />
      )}
    </>
  )
}

// ─── Pieces ─────────────────────────────────────────────────────────────────

function Panel({ value, title, count, badge, children }: {
  value: string; title: string; count?: string; badge?: boolean; children: ReactNode
}) {
  return (
    <AccordionItem value={value} className="glass-card border-0 rounded-xl overflow-hidden">
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
        <span className="flex items-center gap-2">
          {title}
          {count && <span className="text-[11px] font-normal text-muted-foreground tabular-nums">{count}</span>}
          {badge && <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-label="Edited for this resume" />}
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">{children}</AccordionContent>
    </AccordionItem>
  )
}

function Tag({ tone, children }: { tone?: "primary"; children: ReactNode }) {
  return (
    <span className={cn("text-[10px] px-1.5 py-0.5 rounded border",
      tone === "primary" ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground")}>
      {children}
    </span>
  )
}

function MiniBtn({ label, onClick, disabled, danger, children }: {
  label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className={cn("w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground",
        "disabled:opacity-30 disabled:pointer-events-none", danger && "hover:text-danger")}>
      {children}
    </button>
  )
}

const TEXT_LABELS: Record<TextField, string> = {
  summary: "Professional summary", strengths: "Strengths", languages: "Languages", hobbies: "Hobbies and interests",
}

const PERSONAL_LABELS: { key: keyof PersonalInfo; label: string; wide?: boolean }[] = [
  { key: "name", label: "Full name" }, { key: "location", label: "Location" },
  { key: "email", label: "Email" }, { key: "phone", label: "Phone" },
  { key: "linkedin", label: "LinkedIn" }, { key: "github", label: "GitHub" },
  { key: "website", label: "Website / portfolio", wide: true },
]

function PersonalFields({ doc, updateDoc, base, hasPhoto }: {
  doc: ResumeDoc; updateDoc: Props["updateDoc"]; base: PersonalInfo; hasPhoto: boolean
}) {
  const set = (k: keyof PersonalInfo, v: string) => updateDoc((d) => {
    const personal = { ...d.personal }
    if (v === base[k]) delete personal[k]; else personal[k] = v
    return { ...d, personal }
  })
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {PERSONAL_LABELS.map(({ key, label, wide }) => {
          const overridden = doc.personal[key] !== undefined
          return (
            <div key={key} className={cn("space-y-1", wide && "col-span-2")}>
              <Label className="text-[11px] text-muted-foreground flex items-center justify-between">
                {label}
                {overridden && (
                  <button type="button" onClick={() => set(key, base[key])} className="text-primary hover:underline">Reset</button>
                )}
              </Label>
              <Input value={doc.personal[key] ?? base[key]} maxLength={255} onChange={(e) => set(key, e.target.value)}
                aria-label={label}
                className={cn("bg-secondary/50 border-border text-foreground text-sm h-8", overridden && "border-primary/50")} />
            </div>
          )
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Filled from your account and Career Profile. Changes here apply to this resume only — phone and email are never shown on your public page.
      </p>
      <div className="flex items-start justify-between gap-3 pt-2 border-t border-border">
        <div>
          <Label htmlFor="resume-show-photo" className="text-sm text-foreground">Show photo</Label>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {hasPhoto
              ? "Used by templates with a photo slot. Many recruiters and applicant tracking systems prefer resumes without one."
              : <>No photo uploaded — templates show your initials. <Link href="/career-profile" className="text-primary hover:underline">Add a photo</Link></>}
          </p>
        </div>
        <Switch id="resume-show-photo" checked={doc.show_photo}
          onCheckedChange={(v) => updateDoc((d) => ({ ...d, show_photo: v }))} />
      </div>
    </div>
  )
}

function TextOverride({ field, doc, updateDoc, about, rows, placeholder, onSavedToProfile }: {
  field: TextField; doc: ResumeDoc; updateDoc: Props["updateDoc"]; about: About; rows: number
  placeholder?: string; onSavedToProfile: (a: About) => void
}) {
  const [saving, setSaving] = useState(false)
  const profileValue = profileText(about, field)
  const value = doc.text[field] ?? profileValue
  const overridden = doc.text[field] !== undefined
  const max = field === "summary" ? 2000 : field === "languages" ? 255 : 500

  const set = (v: string) => updateDoc((d) => {
    const text = { ...d.text }
    if (v === profileValue) delete text[field]; else text[field] = v
    return { ...d, text }
  })
  const reset = () => set(profileValue)
  const saveToProfile = async () => {
    setSaving(true)
    try {
      const saved = await saveAbout({ [field === "summary" ? "about" : field]: value || null } as Partial<About>)
      onSavedToProfile(saved)
      updateDoc((d) => { const text = { ...d.text }; delete text[field]; return { ...d, text } })
      toast.success("Saved to your Career Profile")
    } catch (err) {
      toast.error(apiError(err, "Couldn't save"))
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-1.5">
      <Textarea className={cn("bg-secondary/50 border-border text-foreground text-sm resize-none", overridden && "border-primary/50")}
        rows={rows} value={value} maxLength={max} placeholder={placeholder} aria-label={TEXT_LABELS[field]}
        onChange={(e) => set(e.target.value)} />
      {overridden ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          <span className="text-primary">Edited for this resume</span>
          <button type="button" onClick={reset} className="text-muted-foreground hover:text-foreground hover:underline">Use profile version</button>
          <button type="button" onClick={saveToProfile} disabled={saving} className="text-muted-foreground hover:text-foreground hover:underline">
            {saving ? "Saving…" : "Save to profile"}
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          {field === "summary" ? "From your Career Profile About." : "From your Career Profile."} Editing here changes this resume only.
        </p>
      )}
    </div>
  )
}
