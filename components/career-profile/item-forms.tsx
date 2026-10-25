"use client"

// The ONE set of Career Profile forms. The Career Profile page and the resume
// builder both open these dialogs, so every fact is entered in one place.

import { useForm, Controller, type Control, type FieldValues, type Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { ModalForm } from "@/components/modal-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, NativeSelect, ToggleRow, YMInput, TagInput, inputClass } from "./fields"
import {
  createItem, updateItem, saveAbout, apiError,
  EDUCATION_LEVELS, EMPLOYMENT_TYPES, ACHIEVEMENT_KINDS, OPEN_TO,
  type Section, type SectionItems, type About, type EducationLevel,
} from "@/lib/career-profile"

// ─── Shared schema pieces ───────────────────────────────────────────────────

const text = (max: number) => z.string().max(max, `At most ${max} characters`)
const required = (max: number, label: string) => z.string().trim().min(1, `${label} is required`).max(max, `At most ${max} characters`)
const link = (max = 500) => text(max).refine(
  (v) => !v.trim() || /^(https?:\/\/)?[^\s/]+\.[^\s]+$/i.test(v.trim()), "Enter a valid link")
const ym = z.string()

/** End must not be before start (compares the common 'YYYY[-MM]' prefix, like the backend). */
function datesInOrder(d: { start_date?: string; end_date?: string }) {
  const s = d.start_date, e = d.end_date
  return !s || !e || e.slice(0, s.length) >= s.slice(0, e.length)
}
const dateOrderIssue = { message: "End date can't be before start date", path: ["end_date"] }

/** '' → null and trim strings, so optional fields are cleared rather than saved blank. */
function toBody(values: Record<string, unknown>) {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(values)) {
    out[k] = typeof v === "string" ? (v.trim() === "" ? null : v.trim()) : v
  }
  return out
}

interface DialogProps<S extends Section> {
  open: boolean
  onClose: () => void
  /** Existing item to edit; omit to create. */
  item?: SectionItems[S] | null
  /** Pre-filled values when creating (e.g. degree from the college record). */
  initial?: Partial<SectionItems[S]>
  onSaved: (item: SectionItems[S]) => void
}

function useSave<S extends Section>(section: S, { item, onSaved, onClose }: DialogProps<S>) {
  return async (values: Record<string, unknown>) => {
    try {
      const body = toBody(values) as Partial<SectionItems[S]>
      const saved = item ? await updateItem(section, item.id, body) : await createItem(section, body)
      onSaved(saved)
      toast.success(item ? "Saved" : "Added")
      onClose()
    } catch (err) {
      toast.error(apiError(err, "Couldn't save"))
    }
  }
}

function DateField<T extends FieldValues>({ control, name, label, disabled, error }: {
  control: Control<T>; name: Path<T>; label: string; disabled?: boolean; error?: string
}) {
  return (
    <Field label={label} error={error} labelFor={false}>
      <Controller control={control} name={name}
        render={({ field }) => <YMInput label={label} value={field.value ?? ""} onChange={field.onChange} disabled={disabled} />} />
    </Field>
  )
}

function BoolField<T extends FieldValues>({ control, name, label, hint }: {
  control: Control<T>; name: Path<T>; label: string; hint?: string
}) {
  return (
    <Controller control={control} name={name}
      render={({ field }) => <ToggleRow label={label} hint={hint} checked={!!field.value} onChange={field.onChange} />} />
  )
}

// ─── Education ──────────────────────────────────────────────────────────────

const educationSchema = z.object({
  level: z.enum(["degree", "pg", "diploma", "intermediate", "ssc", "other"]),
  institution: required(200, "Institution"),
  board: text(150), field: text(150),
  start_date: ym, end_date: ym, is_current: z.boolean(),
  score: text(20), score_type: z.string(), show_score: z.boolean(),
}).refine(datesInOrder, dateOrderIssue)
type EducationValues = z.infer<typeof educationSchema>

const FIELD_HINTS: Record<EducationLevel, { board: string; field: string }> = {
  degree: { board: "JNTU Hyderabad", field: "B.Tech – Computer Science" },
  pg: { board: "Osmania University", field: "MBA – Finance" },
  diploma: { board: "SBTET", field: "Diploma in ECE" },
  intermediate: { board: "Board of Intermediate Education / CBSE", field: "MPC" },
  ssc: { board: "State Board / CBSE / ICSE", field: "" },
  other: { board: "", field: "" },
}

export function EducationDialog(props: DialogProps<"education">) {
  const e = props.item ?? props.initial
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      level: e?.level ?? "degree", institution: e?.institution ?? "", board: e?.board ?? "",
      field: e?.field ?? "", start_date: e?.start_date ?? "", end_date: e?.end_date ?? "",
      is_current: e?.is_current ?? false, score: e?.score ?? "", score_type: e?.score_type ?? "",
      show_score: e?.show_score ?? true,
    },
  })
  const save = useSave("education", props)
  const level = watch("level"), current = watch("is_current"), score = watch("score")
  const hints = FIELD_HINTS[level]

  return (
    <ModalForm title={props.item ? "Edit education" : "Add education"} isOpen={props.open} onClose={props.onClose}
      onSubmit={handleSubmit((v) => save({ ...v, end_date: v.is_current ? "" : v.end_date, score_type: v.score ? v.score_type : "" }))}
      isLoading={isSubmitting} submitLabel="Save">
      <Field label="Level" required>
        <NativeSelect {...register("level")}>
          {EDUCATION_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </NativeSelect>
      </Field>
      <Field label={level === "degree" || level === "pg" ? "College" : "School / college"} required error={errors.institution?.message}>
        <Input className={inputClass} {...register("institution")} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={level === "degree" || level === "pg" ? "University" : "Board"} error={errors.board?.message}>
          <Input className={inputClass} placeholder={hints.board} {...register("board")} />
        </Field>
        {level !== "ssc" && (
          <Field label="Course / stream" error={errors.field?.message}>
            <Input className={inputClass} placeholder={hints.field} {...register("field")} />
          </Field>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateField control={control} name="start_date" label="Start" />
        <DateField control={control} name="end_date" label="End (or expected)" disabled={current} error={errors.end_date?.message} />
      </div>
      <BoolField control={control} name="is_current" label="I'm currently studying here" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Score" error={errors.score?.message}>
          <Input className={inputClass} placeholder="8.4 or 92" {...register("score")} />
        </Field>
        <Field label="Score type">
          <NativeSelect {...register("score_type")} disabled={!score}>
            <option value="">—</option>
            <option value="cgpa">CGPA</option>
            <option value="percent">Percentage</option>
            <option value="grade">Grade</option>
          </NativeSelect>
        </Field>
      </div>
      {score && <BoolField control={control} name="show_score" label="Show score on public profile"
        hint="Your resume always includes it." />}
    </ModalForm>
  )
}

// ─── Project ────────────────────────────────────────────────────────────────

const projectSchema = z.object({
  title: required(150, "Title"),
  description: text(3000),
  skills: z.array(z.string()).max(15),
  is_team: z.boolean(),
  team_size: z.string().refine((v) => !v || (/^\d+$/.test(v) && +v >= 2 && +v <= 50), "Team size must be 2–50"),
  role: text(100),
  start_date: ym, end_date: ym, is_ongoing: z.boolean(),
  live_url: link(), repo_url: link(),
  is_featured: z.boolean(),
}).refine(datesInOrder, dateOrderIssue)
type ProjectValues = z.infer<typeof projectSchema>

export function ProjectDialog(props: DialogProps<"projects">) {
  const p = props.item
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: p?.title ?? "", description: p?.description ?? "", skills: p?.skills ?? [],
      is_team: p?.is_team ?? false, team_size: p?.team_size ? String(p.team_size) : "", role: p?.role ?? "",
      start_date: p?.start_date ?? "", end_date: p?.end_date ?? "", is_ongoing: p?.is_ongoing ?? false,
      live_url: p?.live_url ?? "", repo_url: p?.repo_url ?? "", is_featured: p?.is_featured ?? false,
    },
  })
  const save = useSave("projects", props)
  const team = watch("is_team"), ongoing = watch("is_ongoing")

  return (
    <ModalForm title={p ? "Edit project" : "Add project"} isOpen={props.open} onClose={props.onClose}
      onSubmit={handleSubmit((v) => save({
        ...v,
        team_size: v.is_team && v.team_size ? Number(v.team_size) : null,
        end_date: v.is_ongoing ? "" : v.end_date,
      }))}
      isLoading={isSubmitting} submitLabel="Save">
      <Field label="Project title" required error={errors.title?.message}>
        <Input className={inputClass} placeholder="Campus Connect – event app" {...register("title")} />
      </Field>
      <Field label="Description" hint="What it does, what you built, and the result." error={errors.description?.message}>
        <Textarea rows={4} className={inputClass} {...register("description")} />
      </Field>
      <Field label="Skills used" hint="Press Enter after each skill." labelFor={false}>
        <Controller control={control} name="skills"
          render={({ field }) => <TagInput label="Skills used" value={field.value} onChange={field.onChange} placeholder="React, Flask, MySQL" />} />
      </Field>
      <BoolField control={control} name="is_team" label="Team project" />
      {team && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Team size" error={errors.team_size?.message}>
            <Input type="number" min={2} max={50} className={inputClass} {...register("team_size")} />
          </Field>
          <Field label="Your role" error={errors.role?.message}>
            <Input className={inputClass} placeholder="Backend developer" {...register("role")} />
          </Field>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateField control={control} name="start_date" label="Start" />
        <DateField control={control} name="end_date" label="End" disabled={ongoing} error={errors.end_date?.message} />
      </div>
      <BoolField control={control} name="is_ongoing" label="Still working on it" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Live link" error={errors.live_url?.message}>
          <Input className={inputClass} placeholder="myapp.vercel.app" {...register("live_url")} />
        </Field>
        <Field label="Source code" error={errors.repo_url?.message}>
          <Input className={inputClass} placeholder="github.com/you/repo" {...register("repo_url")} />
        </Field>
      </div>
      <BoolField control={control} name="is_featured" label="Feature this project" hint="Shown first on your public profile." />
    </ModalForm>
  )
}

// ─── Experience ─────────────────────────────────────────────────────────────

const experienceSchema = z.object({
  company: required(150, "Company"), role: required(150, "Role"),
  employment_type: z.string(), location: text(120),
  start_date: ym, end_date: ym, is_current: z.boolean(),
  description: text(3000),
}).refine(datesInOrder, dateOrderIssue)
type ExperienceValues = z.infer<typeof experienceSchema>

export function ExperienceDialog(props: DialogProps<"experience">) {
  const x = props.item
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: x?.company ?? "", role: x?.role ?? "", employment_type: x?.employment_type ?? "internship",
      location: x?.location ?? "", start_date: x?.start_date ?? "", end_date: x?.end_date ?? "",
      is_current: x?.is_current ?? false, description: x?.description ?? "",
    },
  })
  const save = useSave("experience", props)
  const current = watch("is_current")

  return (
    <ModalForm title={x ? "Edit experience" : "Add experience"} isOpen={props.open} onClose={props.onClose}
      onSubmit={handleSubmit((v) => save({ ...v, end_date: v.is_current ? "" : v.end_date }))}
      isLoading={isSubmitting} submitLabel="Save">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Role" required error={errors.role?.message}>
          <Input className={inputClass} placeholder="Web Development Intern" {...register("role")} />
        </Field>
        <Field label="Company" required error={errors.company?.message}>
          <Input className={inputClass} {...register("company")} />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Type">
          <NativeSelect {...register("employment_type")}>
            <option value="">—</option>
            {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <Input className={inputClass} placeholder="Hyderabad / Remote" {...register("location")} />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateField control={control} name="start_date" label="Start" />
        <DateField control={control} name="end_date" label="End" disabled={current} error={errors.end_date?.message} />
      </div>
      <BoolField control={control} name="is_current" label="I currently work here" />
      <Field label="What you did" hint="One point per line works well." error={errors.description?.message}>
        <Textarea rows={4} className={inputClass} {...register("description")} />
      </Field>
    </ModalForm>
  )
}

// ─── Achievement ────────────────────────────────────────────────────────────

const achievementSchema = z.object({
  title: required(200, "Title"), kind: z.string(), organization: text(150),
  date: ym, url: link(), description: text(2000),
})
type AchievementValues = z.infer<typeof achievementSchema>

export function AchievementDialog(props: DialogProps<"achievements">) {
  const a = props.item
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<AchievementValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: a?.title ?? "", kind: a?.kind ?? "hackathon", organization: a?.organization ?? "",
      date: a?.date ?? "", url: a?.url ?? "", description: a?.description ?? "",
    },
  })
  const save = useSave("achievements", props)

  return (
    <ModalForm title={a ? "Edit achievement" : "Add achievement"} isOpen={props.open} onClose={props.onClose}
      onSubmit={handleSubmit((v) => save(v))} isLoading={isSubmitting} submitLabel="Save">
      <Field label="Title" required error={errors.title?.message}>
        <Input className={inputClass} placeholder="Smart India Hackathon – Finalist" {...register("title")} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Type">
          <NativeSelect {...register("kind")}>
            {ACHIEVEMENT_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Organised by" error={errors.organization?.message}>
          <Input className={inputClass} {...register("organization")} />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateField control={control} name="date" label="Date" />
        <Field label="Link" error={errors.url?.message}>
          <Input className={inputClass} placeholder="Certificate, post or article" {...register("url")} />
        </Field>
      </div>
      <Field label="Description" error={errors.description?.message}>
        <Textarea rows={3} className={inputClass} {...register("description")} />
      </Field>
    </ModalForm>
  )
}

// ─── Certification (outside CareerEzi) ──────────────────────────────────────

const certificationSchema = z.object({
  name: required(200, "Name"), issuer: text(150), issue_date: ym,
  credential_id: text(100), credential_url: link(),
})
type CertificationValues = z.infer<typeof certificationSchema>

export function CertificationDialog(props: DialogProps<"certifications">) {
  const c = props.item
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CertificationValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: c?.name ?? "", issuer: c?.issuer ?? "", issue_date: c?.issue_date ?? "",
      credential_id: c?.credential_id ?? "", credential_url: c?.credential_url ?? "",
    },
  })
  const save = useSave("certifications", props)

  return (
    <ModalForm title={c ? "Edit certification" : "Add certification"}
      description="Certificates from outside CareerEzi. Your CareerEzi certificates are added automatically."
      isOpen={props.open} onClose={props.onClose}
      onSubmit={handleSubmit((v) => save(v))} isLoading={isSubmitting} submitLabel="Save">
      <Field label="Certificate name" required error={errors.name?.message}>
        <Input className={inputClass} placeholder="AWS Certified Cloud Practitioner" {...register("name")} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Issued by" error={errors.issuer?.message}>
          <Input className={inputClass} placeholder="Amazon Web Services" {...register("issuer")} />
        </Field>
        <DateField control={control} name="issue_date" label="Issued" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Credential ID" error={errors.credential_id?.message}>
          <Input className={inputClass} {...register("credential_id")} />
        </Field>
        <Field label="Credential link" error={errors.credential_url?.message}>
          <Input className={inputClass} {...register("credential_url")} />
        </Field>
      </div>
    </ModalForm>
  )
}

// ─── About ──────────────────────────────────────────────────────────────────

const aboutSchema = z.object({
  headline: text(120), about: text(2000), location: text(120), open_to: z.string(),
  website: link(255), languages: text(255), strengths: text(500), hobbies: text(500),
})
type AboutValues = z.infer<typeof aboutSchema>

export function AboutDialog({ open, onClose, about, onSaved }: {
  open: boolean; onClose: () => void; about: About; onSaved: (a: About) => void
}) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<AboutValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      headline: about.headline ?? "", about: about.about ?? "", location: about.location ?? "",
      open_to: about.open_to ?? "", website: about.website ?? "", languages: about.languages ?? "",
      strengths: about.strengths ?? "", hobbies: about.hobbies ?? "",
    },
  })
  const aboutLen = watch("about")?.length ?? 0
  const submit = async (v: AboutValues) => {
    try {
      onSaved(await saveAbout(toBody(v) as Partial<About>))
      toast.success("Saved")
      onClose()
    } catch (err) {
      toast.error(apiError(err, "Couldn't save"))
    }
  }

  return (
    <ModalForm title="About you" isOpen={open} onClose={onClose} onSubmit={handleSubmit(submit)}
      isLoading={isSubmitting} submitLabel="Save">
      <Field label="Headline" hint="One line recruiters read first." error={errors.headline?.message}>
        <Input className={inputClass} placeholder="Aspiring Full-Stack Developer | Python · React" {...register("headline")} />
      </Field>
      <Field label="About" hint={`${aboutLen}/2000 — also used as your resume summary.`} error={errors.about?.message}>
        <Textarea rows={5} className={inputClass} {...register("about")} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Open to">
          <NativeSelect {...register("open_to")}>
            <option value="">Don't show</option>
            {OPEN_TO.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <Input className={inputClass} placeholder="Hyderabad, Telangana" {...register("location")} />
        </Field>
      </div>
      <Field label="Personal website" error={errors.website?.message}>
        <Input className={inputClass} placeholder="yourname.dev" {...register("website")} />
      </Field>
      <Field label="Languages you speak" error={errors.languages?.message}>
        <Input className={inputClass} placeholder="English, Telugu, Hindi" {...register("languages")} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Strengths" error={errors.strengths?.message}>
          <Input className={inputClass} placeholder="Problem solving, teamwork" {...register("strengths")} />
        </Field>
        <Field label="Hobbies" error={errors.hobbies?.message}>
          <Input className={inputClass} placeholder="Chess, blogging" {...register("hobbies")} />
        </Field>
      </div>
    </ModalForm>
  )
}

// ─── Dispatcher ─────────────────────────────────────────────────────────────

/** Open the right form for any section except skills (skills are edited inline — see SkillsEditor). */
export function ItemDialog<S extends Exclude<Section, "skills">>({ section, ...props }: DialogProps<S> & { section: S }) {
  // key: remount per item so the form's defaultValues always match what's being edited.
  const key = `${section}-${props.item?.id ?? "new"}-${props.open}`
  switch (section) {
    case "education": return <EducationDialog key={key} {...(props as unknown as DialogProps<"education">)} />
    case "projects": return <ProjectDialog key={key} {...(props as unknown as DialogProps<"projects">)} />
    case "experience": return <ExperienceDialog key={key} {...(props as unknown as DialogProps<"experience">)} />
    case "achievements": return <AchievementDialog key={key} {...(props as unknown as DialogProps<"achievements">)} />
    case "certifications": return <CertificationDialog key={key} {...(props as unknown as DialogProps<"certifications">)} />
  }
  return null
}
