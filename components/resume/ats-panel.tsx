"use client"

// ATS check tab of the resume builder. Re-runs the (free, rules-based) check as
// the resume changes; a pasted job description is read by the AI once, and its
// extracted requirements are reused for every later re-score. AI rewrites are
// applied as "Only this resume" overrides, never to the Career Profile.

import { useEffect, useRef, useState, type ReactNode } from "react"
import { toast } from "sonner"
import {
  AlertTriangle, CheckCircle2, ChevronRight, FileCheck2, Loader2, Plus, Sparkles, Wand2, X, XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  runAtsCheck, suggestRewrite,
  type AtsReport, type AtsCheck, type FixTarget, type JobAnalysis, type Suggestion,
} from "@/lib/resume-ats"
import { createItem, apiError, type CareerProfile } from "@/lib/career-profile"
import {
  listRows, withOverride, layoutOf,
  type ResumeData, type ResumeDoc, type TemplateId, type ListSection,
} from "@/lib/resume"
import { cn } from "@/lib/utils"

interface Props {
  data: ResumeData
  template: TemplateId
  profile: CareerProfile
  setProfile: (fn: (p: CareerProfile) => CareerProfile) => void
  doc: ResumeDoc
  updateDoc: (fn: (d: ResumeDoc) => ResumeDoc) => void
  onFix: (target: FixTarget) => void
}

type SuggestState = { loading?: boolean; result?: Suggestion; error?: string }

function band(score: number) {
  if (score >= 85) return { label: "Excellent", tone: "text-success" }
  if (score >= 70) return { label: "Good", tone: "text-primary" }
  if (score >= 50) return { label: "Needs work", tone: "text-warning" }
  return { label: "Weak", tone: "text-danger" }
}

export function AtsPanel({ data, template, profile, setProfile, doc, updateDoc, onFix }: Props) {
  const [report, setReport] = useState<AtsReport | null>(null)
  const [checking, setChecking] = useState(false)
  const [jd, setJd] = useState("")
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null)
  const [matching, setMatching] = useState(false)
  const [suggest, setSuggest] = useState<Record<string, SuggestState>>({})
  const seq = useRef(0)

  // Free re-check whenever the resume (or the saved job requirements) change.
  useEffect(() => {
    const n = ++seq.current
    const t = setTimeout(async () => {
      setChecking(true)
      try {
        const r = await runAtsCheck(data, template, { jobAnalysis: analysis })
        if (n === seq.current) setReport(r)
      } catch (err) {
        if (n === seq.current) toast.error(apiError(err, "Couldn't run the ATS check"))
      } finally {
        if (n === seq.current) setChecking(false)
      }
    }, 600)
    return () => clearTimeout(t)
  }, [data, template, analysis])

  const matchJob = async () => {
    setMatching(true)
    try {
      const r = await runAtsCheck(data, template, { jobDescription: jd })
      if (r.match_error) toast.error(r.match_error.message)
      if (r.job) setAnalysis(r.job)
      setReport(r)
    } catch (err) {
      toast.error(apiError(err, "Couldn't check the job match"))
    } finally { setMatching(false) }
  }

  const addSkill = async (name: string) => {
    try {
      const s = await createItem("skills", { name })
      setProfile((p) => ({ ...p, skills: [...p.skills, s] }))
      toast.success(`${name} added to your skills`)
    } catch (err) { toast.error(apiError(err, "Couldn't add the skill")) }
  }

  const ask = async (key: string, kind: "bullets" | "summary", section?: ListSection, itemId?: string) => {
    setSuggest((s) => ({ ...s, [key]: { loading: true } }))
    try {
      const result = await suggestRewrite(data, kind, { section, itemId, jobAnalysis: analysis })
      setSuggest((s) => ({ ...s, [key]: { result } }))
      setReport((r) => (r ? { ...r, ai: { ...r.ai, quota: result.quota } } : r))
    } catch (err) {
      setSuggest((s) => ({ ...s, [key]: { error: apiError(err, "Couldn't get suggestions") } }))
    }
  }

  /** Apply as a resume-only change — the Career Profile keeps the original. */
  const apply = (key: string, kind: "bullets" | "summary", text: string, section?: ListSection, itemId?: string) => {
    if (kind === "summary") {
      updateDoc((d) => ({ ...d, text: { ...d.text, summary: text } }))
    } else if (section && itemId) {
      const row = listRows(section, profile, doc).find((r) => r.key === itemId)
      if (!row) return
      if (row.source === "extra") {
        updateDoc((d) => ({ ...d, extras: { ...d.extras, [section]: (d.extras[section] ?? []).map((x) => (x.id === itemId ? { ...x, description: text } : x)) } }))
      } else if (row.profileItem) {
        updateDoc((d) => withOverride(d, section, row.profileItem as object, { description: text }))
      }
    }
    setSuggest((s) => { const n = { ...s }; delete n[key]; return n })
    toast.success("Applied to this resume only — your Career Profile is unchanged")
  }

  if (!report) {
    return <div className="flex items-center gap-2 text-sm text-muted-foreground p-4"><Loader2 className="h-4 w-4 animate-spin" /> Checking your resume…</div>
  }

  const b = band(report.score)
  const ai = report.ai
  const entries = ([["projects", data.projects], ["experience", data.experience]] as const)
    .flatMap(([section, items]) => items.filter((it) => it.description.trim()).map((it) => ({
      section: section as ListSection, id: it.id,
      title: section === "projects" ? (it as ResumeData["projects"][number]).name : `${(it as ResumeData["experience"][number]).role} — ${(it as ResumeData["experience"][number]).company}`,
    })))

  return (
    <div className="space-y-3">
      {/* Score */}
      <Card>
        <div className="flex items-center gap-4">
          <ScoreRing score={report.score} />
          <div className="flex-1 min-w-0">
            <p className={cn("text-lg font-bold font-serif", b.tone)}>{b.label}</p>
            <p className="text-xs text-muted-foreground">
              ATS score {checking && <Loader2 className="inline h-3 w-3 animate-spin ml-1" />}
              · {report.stats.words} words
            </p>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {report.categories.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between text-xs"><span className="text-foreground">{c.label}</span>
                <span className="tabular-nums text-muted-foreground">{Math.round(c.earned)}/{c.max}</span></div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden mt-1">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(100 * c.earned) / c.max}%` }} />
              </div>
            </div>
          ))}
        </div>
        {layoutOf(template) === "two" && (
          <div className="mt-3 rounded-lg border border-warning/30 bg-warning/10 p-2.5 text-xs text-foreground">
            <p className="font-semibold flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-warning" /> Two-column design</p>
            <p className="text-muted-foreground mt-0.5">It downloads as real text, but some ATS software reads the columns out of order. Use the ATS template for online applications.</p>
            <Button size="sm" className="mt-2 h-7 bg-primary text-primary-foreground hover:brightness-110"
              onClick={() => onFix({ action: "template", value: "ats" })}>
              <FileCheck2 className="h-3.5 w-3.5 mr-1" /> Switch to ATS template
            </Button>
          </div>
        )}
      </Card>

      {/* Job match — only when the college has AI */}
      {ai.available && (
        <Card title="Match a job" icon={<Sparkles className="h-4 w-4 text-primary" />}>
          {analysis ? (
            <div className="flex items-start justify-between gap-2 text-xs">
              <p className="text-muted-foreground">Matching against <span className="text-foreground font-medium">{analysis.role || "this job"}</span>. Edits re-score automatically.</p>
              <button type="button" onClick={() => { setAnalysis(null); setJd("") }} aria-label="Clear job"
                className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <>
              <Textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={4} maxLength={8000}
                aria-label="Job description" placeholder="Paste the job description from the company's posting…"
                className="bg-secondary/50 border-border text-foreground text-xs" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-muted-foreground">{ai.quota.remaining} of {ai.quota.limit} AI checks left today</span>
                <Button size="sm" onClick={matchJob} disabled={matching || jd.trim().length < 40 || ai.quota.remaining <= 0}
                  className="bg-primary text-primary-foreground hover:brightness-110 h-8">
                  {matching ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />} Check match
                </Button>
              </div>
            </>
          )}
          {report.match && (
            <div className="mt-3 space-y-2">
              <p className="text-sm"><span className="font-bold text-foreground tabular-nums">{report.match.percent}%</span>
                <span className="text-muted-foreground"> of the job's keywords are on your resume</span></p>
              <KeywordGroup title="Must have" hits={report.match.must_have} onAdd={addSkill} />
              <KeywordGroup title="Nice to have" hits={report.match.nice_to_have} onAdd={addSkill} />
              {report.match.must_have.some((k) => !k.found) && (
                <p className="text-[11px] text-muted-foreground">Add a missing keyword only if you genuinely have that skill — interviews will test it.</p>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Checks */}
      <Card title="What to fix">
        <ul className="divide-y divide-border/60 -my-1">
          {report.checks.filter((c) => c.category !== "match").map((c) => <CheckRow key={c.id} c={c} onFix={onFix} />)}
        </ul>
      </Card>

      {/* AI rewrites */}
      {ai.available && (
        <Card title="Improve with AI" icon={<Wand2 className="h-4 w-4 text-primary" />}>
          <p className="text-[11px] text-muted-foreground mb-2">
            Suggestions never invent facts — fill in any [placeholders] with real numbers. Applying changes this resume only.
          </p>
          <SuggestRow label="Professional summary" state={suggest.summary} disabled={ai.quota.remaining <= 0}
            onAsk={() => ask("summary", "summary")} onApply={(t) => apply("summary", "summary", t)}
            onDismiss={() => setSuggest((s) => { const n = { ...s }; delete n.summary; return n })} />
          {entries.map((e) => {
            const key = `${e.section}:${e.id}`
            return (
              <SuggestRow key={key} label={e.title} state={suggest[key]} disabled={ai.quota.remaining <= 0} bullets
                onAsk={() => ask(key, "bullets", e.section, e.id)} onApply={(t) => apply(key, "bullets", t, e.section, e.id)}
                onDismiss={() => setSuggest((s) => { const n = { ...s }; delete n[key]; return n })} />
            )
          })}
        </Card>
      )}
    </div>
  )
}

// ─── Pieces ─────────────────────────────────────────────────────────────────

function Card({ title, icon, children }: { title?: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="glass-card rounded-xl p-4">
      {title && <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">{icon}{title}</h3>}
      {children}
    </section>
  )
}

function ScoreRing({ score }: { score: number }) {
  const r = 30, c = 2 * Math.PI * r
  return (
    <div className="relative w-20 h-20 flex-shrink-0" role="img" aria-label={`ATS score ${score} out of 100`}>
      <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--secondary)" strokeWidth="7" />
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} style={{ transition: "stroke-dashoffset .5s" }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-bold font-serif text-foreground tabular-nums">{score}</span>
    </div>
  )
}

function CheckRow({ c, onFix }: { c: AtsCheck; onFix: (t: FixTarget) => void }) {
  const Icon = c.status === "pass" ? CheckCircle2 : c.status === "warn" ? AlertTriangle : XCircle
  const tone = c.status === "pass" ? "text-success" : c.status === "warn" ? "text-warning" : "text-danger"
  return (
    <li className="py-2 flex gap-2">
      <Icon className={cn("h-4 w-4 flex-shrink-0 mt-0.5", tone)} aria-label={c.status} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs font-medium text-foreground">{c.label}</p>
          <span className="text-[10px] tabular-nums text-muted-foreground flex-shrink-0">{c.earned}/{c.max}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">{c.message}</p>
        {c.fix && <p className="text-[11px] text-foreground/80 mt-0.5">{c.fix}</p>}
        {c.target && (
          <button type="button" onClick={() => onFix(c.target!)} className="text-[11px] text-primary hover:underline mt-0.5 inline-flex items-center">
            {c.target.action === "template" ? "Switch template" : "Fix this"} <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </li>
  )
}

function KeywordGroup({ title, hits, onAdd }: { title: string; hits: { keyword: string; found: boolean }[]; onAdd: (k: string) => void }) {
  if (!hits.length) return null
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {hits.map((h) => h.found ? (
          <span key={h.keyword} className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] text-foreground">
            <CheckCircle2 className="h-3 w-3 text-success" aria-label="found" /> {h.keyword}
          </span>
        ) : (
          <button key={h.keyword} type="button" onClick={() => onAdd(h.keyword)} title="Add to your skills — only if you really have it"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-danger/40 px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/50">
            <Plus className="h-3 w-3" aria-hidden /> <span className="sr-only">Add missing skill</span>{h.keyword}
          </button>
        ))}
      </div>
    </div>
  )
}

function SuggestRow({ label, state, disabled, bullets, onAsk, onApply, onDismiss }: {
  label: string; state?: SuggestState; disabled: boolean; bullets?: boolean
  onAsk: () => void; onApply: (text: string) => void; onDismiss: () => void
}) {
  const result = state?.result
  const text = result ? (bullets ? result.suggestions.map((s) => `• ${s}`).join("\n") : result.suggestions[0] ?? "") : ""
  return (
    <div className="py-2 border-t border-border/60 first-of-type:border-t-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-foreground truncate">{label}</p>
        {!result && (
          <Button size="sm" variant="outline" className="h-7 text-xs flex-shrink-0" onClick={onAsk} disabled={disabled || state?.loading}>
            {state?.loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Wand2 className="h-3 w-3 mr-1" />} Improve
          </Button>
        )}
      </div>
      {state?.error && <p className="text-[11px] text-danger mt-1">{state.error}</p>}
      {result && (
        <div className="mt-2 rounded-lg border border-primary/25 bg-primary/5 p-2.5">
          <p className="text-xs text-foreground whitespace-pre-line">{text || "No suggestion this time."}</p>
          {result.note && <p className="text-[11px] text-muted-foreground mt-1.5">{result.note}</p>}
          <div className="flex gap-2 mt-2">
            {text && <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground hover:brightness-110" onClick={() => onApply(text)}>Apply to this resume</Button>}
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onDismiss}>Dismiss</Button>
          </div>
        </div>
      )}
    </div>
  )
}
