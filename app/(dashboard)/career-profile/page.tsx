"use client"

// Career Profile — the one place a student enters portfolio facts.
// The public page (/u/<username>) and the resume builder read the same data.

import { useCallback, useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  IdCard, Pencil, Plus, Eye, EyeOff, ChevronUp, ChevronDown, Trash2, ExternalLink, Github,
  GraduationCap, FolderGit2, Briefcase, Wrench, Trophy, Award, BadgeCheck, MapPin, Star,
  Users, User as UserIcon, Camera, Globe, Sparkles, Info, X, SlidersHorizontal,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserAvatar } from "@/components/user-avatar"
import { PhotoPicker } from "@/components/photo-picker"
import { ItemDialog, AboutDialog } from "@/components/career-profile/item-forms"
import { SkillsEditor } from "@/components/career-profile/skills-editor"
import { PublicSettingsDialog } from "@/components/career-profile/public-settings-dialog"
import { useAuthStore } from "@/store/authStore"
import {
  fetchCareerProfile, updateItem, deleteItem, reorderItems, apiError, formatRange, formatYM,
  EDUCATION_LEVEL_SHORT, EMPLOYMENT_TYPES, ACHIEVEMENT_KINDS, OPEN_TO,
  type CareerProfile, type Section, type SectionItems, type Education, type Project,
  type Experience, type Achievement, type Certification, type PublicSection,
} from "@/lib/career-profile"
import { cn } from "@/lib/utils"

type ListSection = Exclude<Section, "skills">
// Per-browser "don't show the hidden-items banner again" (listed on /cookies).
const BANNER_KEY = "careerezi-cp-hidden-banner"

type DialogState = { section: ListSection; item?: SectionItems[ListSection] | null; initial?: Partial<Education> } | null

export default function CareerProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [profile, setProfile] = useState<CareerProfile | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [dialog, setDialog] = useState<DialogState>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [photoOpen, setPhotoOpen] = useState(false)
  const [publicOpen, setPublicOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ section: ListSection; id: number; label: string } | null>(null)
  const [revealing, setRevealing] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(true)
  useEffect(() => {
    try { setBannerDismissed(localStorage.getItem(BANNER_KEY) === "1") } catch { setBannerDismissed(false) }
  }, [])
  const dismissBanner = () => {
    setBannerDismissed(true)
    try { localStorage.setItem(BANNER_KEY, "1") } catch {}
  }

  const load = useCallback(() => {
    setLoadError(false)
    fetchCareerProfile().then(setProfile).catch(() => setLoadError(true))
  }, [])
  useEffect(load, [load])

  // Completeness is computed server-side; refresh it quietly after any change.
  const refreshCompleteness = useCallback(() => {
    fetchCareerProfile()
      .then((p) => setProfile((cur) => (cur ? { ...cur, completeness: p.completeness } : p)))
      .catch(() => {})
  }, [])

  const setItems = <S extends Section>(section: S, items: SectionItems[S][]) => {
    setProfile((p) => (p ? { ...p, [section]: items } : p))
    refreshCompleteness()
  }

  const onSaved = <S extends ListSection>(section: S, saved: SectionItems[S]) => {
    if (!profile) return
    if (section === "education") { load(); return }     // order is computed by the backend
    const list = profile[section] as SectionItems[S][]
    const exists = list.some((i) => i.id === saved.id)
    setItems(section, exists ? list.map((i) => (i.id === saved.id ? saved : i)) : [...list, saved])
  }

  const toggleVisibility = async (section: ListSection, item: SectionItems[ListSection]) => {
    try {
      const saved = await updateItem(section, item.id, { is_public: !item.is_public })
      onSaved(section, saved)
    } catch (err) { toast.error(apiError(err)) }
  }

  const move = async (section: ListSection, index: number, dir: -1 | 1) => {
    if (!profile) return
    const list = [...profile[section]] as SectionItems[ListSection][]
    const j = index + dir
    if (j < 0 || j >= list.length) return
    ;[list[index], list[j]] = [list[j], list[index]]
    setProfile({ ...profile, [section]: list })                // optimistic
    try {
      await reorderItems(section, list.map((i) => i.id))
    } catch (err) {
      toast.error(apiError(err, "Couldn't reorder"))
      load()
    }
  }

  const doDelete = async () => {
    if (!profile || !confirmDelete) return
    const { section, id } = confirmDelete
    setConfirmDelete(null)
    try {
      await deleteItem(section, id)
      setItems(section, (profile[section] as SectionItems[ListSection][]).filter((i) => i.id !== id))
      toast.success("Removed")
    } catch (err) { toast.error(apiError(err)) }
  }

  if (loadError) {
    return (
      <GlassCard className="text-center py-12">
        <p className="text-foreground font-medium">Couldn't load your Career Profile.</p>
        <Button variant="outline" className="mt-4" onClick={load}>Try again</Button>
      </GlassCard>
    )
  }
  if (!profile) return <PageSkeleton />

  const hiddenImported = profile.imported_at
    ? (["education", "projects", "experience", "achievements", "certifications", "skills"] as Section[])
        .flatMap((s) => (profile[s] as SectionItems[Section][]).filter((i) => !i.is_public).map((i) => ({ s, i })))
    : []

  const revealAll = async () => {
    setRevealing(true)
    try {
      for (const { s, i } of hiddenImported) await updateItem(s, i.id, { is_public: true })
      load()
      toast.success("Everything is now shown on your public profile")
    } catch (err) {
      toast.error(apiError(err))
      load()
    } finally { setRevealing(false) }
  }

  const hasDegree = profile.education.some((e) => ["degree", "pg", "diploma"].includes(e.level))
  const collegeSuggestion = !hasDegree && user?.college_name
    ? {
        level: "degree" as const, institution: user.college_name, field: user.branch ?? "",
        end_date: user.passout_year ? String(user.passout_year) : "",
      }
    : null

  const hiddenSections = new Set(profile.public_settings?.hidden_sections ?? [])
  const offPublic = (s: PublicSection) => hiddenSections.has(s)

  const rowProps = (section: ListSection) => ({
    onEdit: (item: SectionItems[ListSection]) => setDialog({ section, item }),
    onToggle: (item: SectionItems[ListSection]) => toggleVisibility(section, item),
    onMove: (index: number, dir: -1 | 1) => move(section, index, dir),
  })

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page title */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <IdCard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">Career Profile</h1>
          <p className="text-sm text-muted-foreground">Fill this in once. It powers your resume and your public profile.</p>
        </div>
      </motion.div>

      {/* Header: photo, headline, completeness */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <GlassCard>
          <div className="flex flex-col sm:flex-row gap-5">
            <button type="button" onClick={() => setPhotoOpen(true)} aria-label="Change profile photo"
              className="relative self-center sm:self-start group flex-shrink-0">
              <UserAvatar name={user?.name ?? ""} photoUrl={user?.avatar} size="xl" className="!h-24 !w-24" fallbackClassName="text-2xl" />
              <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow ring-2 ring-card group-hover:brightness-110">
                <Camera className="h-4 w-4" />
              </span>
            </button>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold font-serif text-foreground">{user?.name}</h2>
                  <p className={cn("text-sm mt-0.5", profile.about.headline ? "text-foreground/90" : "text-muted-foreground italic")}>
                    {profile.about.headline || "Add a headline — e.g. Aspiring Data Analyst | SQL · Power BI"}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setAboutOpen(true)} className="hidden sm:inline-flex">
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                </Button>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
                {user?.college_name && <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{user.college_name}</span>}
                {profile.about.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.about.location}</span>}
                {profile.about.open_to && profile.about.open_to !== "not_looking" && (
                  <span className="chip chip-success">Open to {OPEN_TO.find((o) => o.value === profile.about.open_to)?.label.toLowerCase()}</span>
                )}
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setAboutOpen(true)} className="sm:hidden">
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit about
                </Button>
                {user?.is_public && user?.username ? (
                  <a href={`/u/${user.username}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm"><ExternalLink className="h-3.5 w-3.5 mr-1.5" /> View public profile</Button>
                  </a>
                ) : (
                  <Link href="/profile"><Button variant="outline" size="sm"><Globe className="h-3.5 w-3.5 mr-1.5" /> Turn on public profile</Button></Link>
                )}
                <Button variant="outline" size="sm" onClick={() => setPublicOpen(true)}>
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" /> Public page sections
                </Button>
                <Link href="/resume"><Button variant="outline" size="sm">Open resume builder</Button></Link>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Profile strength</span>
              <span className="tabular-nums font-semibold text-primary">{profile.completeness.percent}%</span>
            </div>
            <Progress value={profile.completeness.percent} className="h-2" />
            {profile.completeness.missing.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Next: {profile.completeness.missing.slice(0, 3).join(" · ")}
              </p>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Imported-from-resume banner */}
      {hiddenImported.length > 0 && !bannerDismissed && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <Info className="h-5 w-5 text-primary flex-shrink-0" />
          <p className="text-sm text-foreground flex-1">
            <strong>{hiddenImported.length} item{hiddenImported.length > 1 ? "s are" : " is"} hidden from your public profile.</strong>{" "}
            Items copied from your resume builder start hidden. Use the <EyeOff className="inline h-3.5 w-3.5" /> button on an item to show it, or show them all.
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button size="sm" onClick={revealAll} disabled={revealing} className="bg-primary text-primary-foreground hover:brightness-110">
              Show all
            </Button>
            <IconBtn label="Dismiss" onClick={dismissBanner}><X className="h-4 w-4" /></IconBtn>
          </div>
        </div>
      )}

      {/* About */}
      <SectionCard icon={UserIcon} title="About" hiddenPublic={offPublic("about")} action={
        <Button variant="ghost" size="sm" onClick={() => setAboutOpen(true)}><Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit</Button>
      }>
        {profile.about.about
          ? <p className="text-sm text-foreground/90 whitespace-pre-line">{profile.about.about}</p>
          : <Empty text="A few lines about who you are and what you want to work on. Also used as your resume summary." />}
        {(profile.about.languages || profile.about.website) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
            {profile.about.languages && <span>Speaks {profile.about.languages}</span>}
            {profile.about.website && (
              <a href={profile.about.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> {profile.about.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        )}
      </SectionCard>

      {/* Education */}
      <SectionCard icon={GraduationCap} title="Education" hiddenPublic={offPublic("education")} subtitle="Degree, Intermediate / Diploma and SSC"
        onAdd={() => setDialog({ section: "education" })}>
        {collegeSuggestion && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-dashed border-primary/40 p-3 mb-3">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground flex-1">
              From your college record: <strong>{collegeSuggestion.institution}</strong>
              {collegeSuggestion.field && <> · {collegeSuggestion.field}</>}
              {collegeSuggestion.end_date && <> · Batch {collegeSuggestion.end_date}</>}
            </p>
            <Button size="sm" variant="outline" onClick={() => setDialog({ section: "education", initial: collegeSuggestion })}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </div>
        )}
        <ItemList items={profile.education} empty="Add your degree, Intermediate and SSC." sortable={false}
          {...rowProps("education")} onDelete={(e) => setConfirmDelete({ section: "education", id: e.id, label: e.institution })}
          render={(e) => <EducationRow e={e} />} />
      </SectionCard>

      {/* Projects */}
      <SectionCard icon={FolderGit2} title="Projects" hiddenPublic={offPublic("projects")} subtitle="What you've built — the first thing recruiters look for"
        onAdd={() => setDialog({ section: "projects" })}>
        <ItemList items={profile.projects} empty="Add a project you built — college, personal or hackathon."
          {...rowProps("projects")} onDelete={(p) => setConfirmDelete({ section: "projects", id: p.id, label: p.title })}
          render={(p) => <ProjectRow p={p} />} />
      </SectionCard>

      {/* Experience */}
      <SectionCard icon={Briefcase} title="Experience" hiddenPublic={offPublic("experience")} subtitle="Internships, part-time and freelance work"
        onAdd={() => setDialog({ section: "experience" })}>
        <ItemList items={profile.experience} empty="No internships yet? That's fine — projects count too."
          {...rowProps("experience")} onDelete={(x) => setConfirmDelete({ section: "experience", id: x.id, label: `${x.role} at ${x.company}` })}
          render={(x) => <ExperienceRow x={x} />} />
      </SectionCard>

      {/* Skills */}
      <SectionCard icon={Wrench} title="Skills" hiddenPublic={offPublic("skills")}
        subtitle="✓ = CareerEzi has evidence (coding practice, a course or GitHub)">
        <SkillsEditor skills={profile.skills} onChange={(s) => setItems("skills", s)} />
      </SectionCard>

      {/* Achievements */}
      <SectionCard icon={Trophy} title="Achievements" hiddenPublic={offPublic("achievements")} subtitle="Hackathons, awards, club roles, publications"
        onAdd={() => setDialog({ section: "achievements" })}>
        <ItemList items={profile.achievements} empty="Hackathons, contest ranks, club leadership, awards."
          {...rowProps("achievements")} onDelete={(a) => setConfirmDelete({ section: "achievements", id: a.id, label: a.title })}
          render={(a) => <AchievementRow a={a} />} />
      </SectionCard>

      {/* Certifications */}
      <SectionCard icon={Award} title="Certifications" hiddenPublic={offPublic("certifications")} subtitle="CareerEzi certificates are added automatically"
        onAdd={() => setDialog({ section: "certifications" })}>
        {profile.verified_certificates.length > 0 && (
          <ul className="space-y-2 mb-3">
            {profile.verified_certificates.map((c) => (
              <li key={c.certificate_uid} className="flex items-center gap-3 rounded-lg bg-secondary/40 px-3 py-2.5">
                <BadgeCheck className="h-4 w-4 text-success flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.issuer} · Verified</p>
                </div>
                <Link href={`/verify/${c.certificate_uid}`} target="_blank" className="text-xs text-primary hover:underline flex-shrink-0">View</Link>
              </li>
            ))}
          </ul>
        )}
        <ItemList items={profile.certifications} empty="Add certificates from Coursera, NPTEL, AWS and others."
          {...rowProps("certifications")} onDelete={(c) => setConfirmDelete({ section: "certifications", id: c.id, label: c.name })}
          render={(c) => <CertificationRow c={c} />} />
      </SectionCard>

      {/* Dialogs */}
      {dialog && (
        <ItemDialog section={dialog.section} open item={dialog.item} initial={dialog.initial as never}
          onClose={() => setDialog(null)} onSaved={(saved) => onSaved(dialog.section, saved)} />
      )}
      {aboutOpen && (
        <AboutDialog open about={profile.about} onClose={() => setAboutOpen(false)}
          onSaved={(about) => { setProfile((p) => (p ? { ...p, about } : p)); refreshCompleteness() }} />
      )}
      {publicOpen && (
        <PublicSettingsDialog open settings={profile.public_settings ?? { hidden_sections: [] }}
          isPublic={!!user?.is_public} username={user?.username}
          onClose={() => setPublicOpen(false)}
          onSaved={(public_settings) => setProfile((p) => (p ? { ...p, public_settings } : p))} />
      )}
      <PhotoPicker open={photoOpen} onClose={() => setPhotoOpen(false)} current={user?.avatar}
        onChange={(url) => { updateUser({ avatar: url }); refreshCompleteness() }} />
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent className="bg-popover border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Remove this item?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{confirmDelete?.label}&rdquo; will be removed from your Career Profile, your resume and your public profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} className="bg-danger text-white hover:brightness-110">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Layout pieces ──────────────────────────────────────────────────────────

function SectionCard({ icon: Icon, title, subtitle, onAdd, action, hiddenPublic, children }: {
  icon: LucideIcon; title: string; subtitle?: string; onAdd?: () => void; action?: ReactNode
  /** The whole section is switched off on the public page. */
  hiddenPublic?: boolean
  children: ReactNode
}) {
  return (
    <GlassCard role="region" aria-label={title} className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className="h-4.5 w-4.5 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold font-serif text-foreground flex flex-wrap items-center gap-2">
              {title}
              {hiddenPublic && (
                <span className="inline-flex items-center gap-1 text-[11px] font-sans font-normal text-muted-foreground border border-border rounded-full px-2 py-0.5">
                  <EyeOff className="h-3 w-3" /> Not on public page
                </span>
              )}
            </h3>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {action}
        {onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd} className="flex-shrink-0">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        )}
      </div>
      {children}
    </GlassCard>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-muted-foreground">{text}</p>
}

function ItemList<T extends SectionItems[ListSection]>({ items, empty, render, onEdit, onToggle, onMove, onDelete, sortable = true }: {
  items: T[]; empty: string; render: (item: T) => ReactNode
  onEdit: (item: T) => void; onToggle: (item: T) => void
  onMove: (index: number, dir: -1 | 1) => void; onDelete: (item: T) => void
  /** false when the backend fixes the order (education: by level, newest first). */
  sortable?: boolean
}) {
  if (!items.length) return <Empty text={empty} />
  return (
    <ul className="divide-y divide-border/60">
      {items.map((item, i) => (
        <li key={item.id} className={cn("py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-2 sm:gap-3", !item.is_public && "opacity-70")}>
          <div className="min-w-0 flex-1">
            {render(item)}
            {!item.is_public && (
              <p className="text-xs text-muted-foreground mt-1.5 inline-flex items-center gap-1">
                <EyeOff className="h-3 w-3" /> Hidden from public profile
              </p>
            )}
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0 self-end sm:self-start -mr-1.5">
            {sortable && <>
              <IconBtn label="Move up" onClick={() => onMove(i, -1)} disabled={i === 0}><ChevronUp className="h-4 w-4" /></IconBtn>
              <IconBtn label="Move down" onClick={() => onMove(i, 1)} disabled={i === items.length - 1}><ChevronDown className="h-4 w-4" /></IconBtn>
            </>}
            <IconBtn label={item.is_public ? "Hide from public profile" : "Show on public profile"} onClick={() => onToggle(item)}>
              {item.is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </IconBtn>
            <IconBtn label="Edit" onClick={() => onEdit(item)}><Pencil className="h-4 w-4" /></IconBtn>
            <IconBtn label="Remove" onClick={() => onDelete(item)} danger><Trash2 className="h-4 w-4" /></IconBtn>
          </div>
        </li>
      ))}
    </ul>
  )
}

function IconBtn({ label, onClick, disabled, danger, children }: {
  label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className={cn("w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground transition-colors",
        "hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:pointer-events-none",
        danger && "hover:text-danger")}>
      {children}
    </button>
  )
}

function Meta({ children }: { children: ReactNode[] }) {
  const parts = children.filter(Boolean)
  if (!parts.length) return null
  return (
    <p className="text-xs text-muted-foreground mt-0.5">
      {parts.map((p, i) => <span key={i}>{i > 0 && " · "}{p}</span>)}
    </p>
  )
}

function LinkOut({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
      <Icon className="h-3 w-3" /> {label}
    </a>
  )
}

// ─── Item rows ──────────────────────────────────────────────────────────────

function EducationRow({ e }: { e: Education }) {
  const score = e.score && `${e.score_type === "cgpa" ? "CGPA " : ""}${e.score}${e.score_type === "percent" ? "%" : ""}`
  return (
    <>
      <p className="text-sm font-medium text-foreground">
        {e.field ? `${e.field}` : EDUCATION_LEVEL_SHORT[e.level]}
        {e.field && <span className="text-muted-foreground font-normal"> · {EDUCATION_LEVEL_SHORT[e.level]}</span>}
      </p>
      <p className="text-sm text-foreground/80">{e.institution}</p>
      <Meta>{[e.board, formatRange(e.start_date, e.end_date, e.is_current),
        score && <span key="s">{score}{!e.show_score && " (hidden publicly)"}</span>]}</Meta>
    </>
  )
}

function ProjectRow({ p }: { p: Project }) {
  return (
    <>
      <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
        {p.title}
        {p.is_featured && <Star className="h-3.5 w-3.5 text-warning fill-warning" aria-label="Featured" />}
      </p>
      <Meta>{[
        p.is_team
          ? <span key="t" className="inline-flex items-center gap-1"><Users className="h-3 w-3" />Team{p.team_size ? ` of ${p.team_size}` : ""}{p.role ? ` · ${p.role}` : ""}</span>
          : <span key="t" className="inline-flex items-center gap-1"><UserIcon className="h-3 w-3" />Solo</span>,
        formatRange(p.start_date, p.end_date, p.is_ongoing),
      ]}</Meta>
      {p.description && <p className="text-sm text-foreground/80 mt-1.5 line-clamp-2 whitespace-pre-line">{p.description}</p>}
      {p.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {p.skills.map((s) => <span key={s} className="chip">{s}</span>)}
        </div>
      )}
      {(p.live_url || p.repo_url) && (
        <div className="flex gap-3 mt-2">
          {p.live_url && <LinkOut href={p.live_url} icon={ExternalLink} label="Live" />}
          {p.repo_url && <LinkOut href={p.repo_url} icon={Github} label="Code" />}
        </div>
      )}
    </>
  )
}

function ExperienceRow({ x }: { x: Experience }) {
  return (
    <>
      <p className="text-sm font-medium text-foreground">{x.role}</p>
      <p className="text-sm text-foreground/80">{x.company}</p>
      <Meta>{[EMPLOYMENT_TYPES.find((t) => t.value === x.employment_type)?.label, x.location,
        formatRange(x.start_date, x.end_date, x.is_current)]}</Meta>
      {x.description && <p className="text-sm text-foreground/80 mt-1.5 line-clamp-3 whitespace-pre-line">{x.description}</p>}
    </>
  )
}

function AchievementRow({ a }: { a: Achievement }) {
  return (
    <>
      <p className="text-sm font-medium text-foreground">{a.title}</p>
      <Meta>{[ACHIEVEMENT_KINDS.find((k) => k.value === a.kind)?.label, a.organization, formatYM(a.date)]}</Meta>
      {a.description && <p className="text-sm text-foreground/80 mt-1.5 line-clamp-2">{a.description}</p>}
      {a.url && <div className="mt-1.5"><LinkOut href={a.url} icon={ExternalLink} label="Link" /></div>}
    </>
  )
}

function CertificationRow({ c }: { c: Certification }) {
  return (
    <>
      <p className="text-sm font-medium text-foreground">{c.name}</p>
      <Meta>{[c.issuer, formatYM(c.issue_date), c.credential_id && `ID ${c.credential_id}`]}</Meta>
      {c.credential_url && <div className="mt-1.5"><LinkOut href={c.credential_url} icon={ExternalLink} label="Show credential" /></div>}
    </>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-56 w-full rounded-xl" />
      {[0, 1, 2].map((i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
    </div>
  )
}
