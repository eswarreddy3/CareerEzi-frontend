"use client"

// Inline skills editor — shared by the Career Profile page and the resume builder.

import { useState, type FormEvent } from "react"
import { BadgeCheck, Eye, EyeOff, Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, inputClass } from "./fields"
import {
  createItem, updateItem, deleteItem, apiError, SKILL_CATEGORIES,
  type Skill, type SkillCategory,
} from "@/lib/career-profile"
import { cn } from "@/lib/utils"

export function SkillsEditor({ skills, onChange, showVisibility = true }: {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
  /** The public-page eye toggle; the resume builder hides it. */
  showVisibility?: boolean
}) {
  const [name, setName] = useState("")
  // "" = let the backend pick from its list of well-known skills (Docker → Tools …)
  const [category, setCategory] = useState<SkillCategory | "">("")
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState<number | null>(null)

  const add = async (e: FormEvent) => {
    e.preventDefault()
    const names = name.split(",").map((n) => n.trim().replace(/\s+/g, " ")).filter(Boolean)
    if (!names.length) return
    setAdding(true)
    const added: Skill[] = []
    for (const n of names) {
      if (skills.some((s) => s.name.toLowerCase() === n.toLowerCase())) continue
      try {
        added.push(await createItem("skills", category ? { name: n, category } : { name: n }))
      } catch (err) {
        toast.error(`${n}: ${apiError(err, "couldn't add")}`)
      }
    }
    onChange([...skills, ...added])
    setName("")
    setAdding(false)
  }

  const toggle = async (s: Skill) => {
    setBusy(s.id)
    try {
      const saved = await updateItem("skills", s.id, { is_public: !s.is_public })
      onChange(skills.map((x) => (x.id === s.id ? saved : x)))
    } catch (err) {
      toast.error(apiError(err))
    } finally { setBusy(null) }
  }

  const remove = async (s: Skill) => {
    setBusy(s.id)
    try {
      await deleteItem("skills", s.id)
      onChange(skills.filter((x) => x.id !== s.id))
    } catch (err) {
      toast.error(apiError(err))
    } finally { setBusy(null) }
  }

  const groups = SKILL_CATEGORIES
    .map((c) => ({ ...c, items: skills.filter((s) => s.category === c.value) }))
    .filter((g) => g.items.length)

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex flex-col sm:flex-row gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={300}
          placeholder="Add skills, e.g. Python, React" className={cn(inputClass, "flex-1")} aria-label="Skill name" />
        <NativeSelect value={category} onChange={(e) => setCategory(e.target.value as SkillCategory | "")}
          aria-label="Skill category" className="sm:w-48">
          <option value="">Auto category</option>
          {SKILL_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </NativeSelect>
        <Button type="submit" disabled={adding || !name.trim()} className="bg-primary text-primary-foreground hover:brightness-110">
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
        </Button>
      </form>

      {groups.length === 0 && (
        <p className="text-sm text-muted-foreground">No skills yet. Separate several with commas.</p>
      )}
      {groups.map((g) => (
        <div key={g.value}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{g.label}</p>
          <div className="flex flex-wrap gap-2">
            {g.items.map((s) => (
              <span key={s.id}
                className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm",
                  s.is_public || !showVisibility
                    ? "border-primary/30 bg-primary/10 text-foreground"
                    : "border-dashed border-border text-muted-foreground")}>
                {s.verified_by && (
                  <BadgeCheck className="h-3.5 w-3.5 text-success" aria-label={`Verified: ${s.verified_by}`}>
                    <title>{s.verified_by}</title>
                  </BadgeCheck>
                )}
                {s.name}
                {showVisibility && (
                  <button type="button" onClick={() => toggle(s)} disabled={busy === s.id}
                    aria-label={s.is_public ? `Hide ${s.name} from public profile` : `Show ${s.name} on public profile`}
                    title={s.is_public ? "Shown on public profile" : "Hidden from public profile"}
                    className="text-muted-foreground hover:text-foreground">
                    {s.is_public ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                )}
                <button type="button" onClick={() => remove(s)} disabled={busy === s.id}
                  aria-label={`Remove ${s.name}`} className="text-muted-foreground hover:text-danger">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
