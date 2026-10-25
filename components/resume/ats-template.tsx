// "ATS" template — the on-screen twin of the backend's text PDF
// (CareerEzi-backend/app/services/resume_pdf.py). Same section order, headings
// and wording, so what the student previews is what the download contains.
// Sizes are the PDF's points × 4/3 (pt → CSS px) on the 794px-wide A4 canvas.
// Deliberately plain: one column, no photo, icons or colour — what ATS parsers read best.

import { Fragment } from "react"
import type { ResumeData } from "@/lib/resume"
import { contactItems, ProjectLinks, CertLink, projectLinks } from "@/components/resume/links"

const INK = "#111111", MUTED = "#444444", RULE = "#999999"
const FONT = "'DejaVu Sans', 'Segoe UI', Arial, Helvetica, sans-serif"

const join = (parts: (string | undefined | null)[], sep = " | ") => parts.filter(Boolean).join(sep)
const range = (start: string, end: string, current = false) => {
  const e = current ? "Present" : end
  return start && e ? `${start} – ${e}` : start || e || ""
}
/** Same splitting as resume_pdf.split_bullets. */
const bullets = (text: string) =>
  text.split("\n").map((l) => l.replace(/^\s*(?:[•●▪◦\-*–]\s*|\d+[.)]\s+)/, "").trim()).filter(Boolean)

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 12 }}>
      <h2 style={{ fontSize: 14.7, fontWeight: 700, margin: 0, lineHeight: "18.7px", color: INK }}>{title.toUpperCase()}</h2>
      <hr style={{ border: 0, borderTop: `0.8px solid ${RULE}`, margin: "2px 0 6px" }} />
      {children}
    </section>
  )
}

function Described({ text }: { text: string }) {
  const bs = bullets(text)
  if (!bs.length) return null
  if (bs.length === 1) return <p style={{ margin: 0 }}>{bs[0]}</p>
  return (
    <ul style={{ margin: 0, paddingLeft: 16, listStyle: "none" }}>
      {bs.map((b, i) => <li key={i} style={{ textIndent: -13, paddingLeft: 0 }}>•&nbsp;&nbsp;{b}</li>)}
    </ul>
  )
}

const title = { fontSize: 14, fontWeight: 700, lineHeight: "18.7px" } as const
const meta = { fontSize: 12.7, color: MUTED, lineHeight: "17.3px" } as const

export function AtsTemplate({ data }: { data: ResumeData }) {
  const p = data.personal
  const contact = contactItems(p)
  const extra = ([["languages", "Languages"], ["strengths", "Strengths"], ["hobbies", "Interests"]] as const)
    .filter(([k]) => data[k].trim())

  return (
    <div style={{ width: 794, minHeight: 1123, background: "#fff", color: INK, fontFamily: FONT, fontSize: 13.3, lineHeight: "18.7px", padding: "53px 60px", boxSizing: "border-box" }}>
      <h1 style={{ fontSize: 25.3, fontWeight: 700, margin: 0, lineHeight: "30.7px" }}>{p.name || "Your Name"}</h1>
      {contact.length > 0 && (
        <p style={{ ...meta, margin: 0 }}>
          {contact.map((c, i) => <Fragment key={c.kind}>{i > 0 && " | "}{c.node}</Fragment>)}
        </p>
      )}

      {data.objective.trim() && <Section title="Career Objective"><p style={{ margin: 0 }}>{data.objective}</p></Section>}
      {data.summary.trim() && <Section title="Professional Summary"><p style={{ margin: 0 }}>{data.summary}</p></Section>}

      {data.education.some((e) => e.school) && (
        <Section title="Education">
          {data.education.filter((e) => e.school).map((e) => (
            <div key={e.id} style={{ marginBottom: 5 }}>
              <div style={title}>{join([e.field ? join([e.degree, e.field], " in ") : e.degree, e.school], ", ")}</div>
              <div style={meta}>{join([range(e.start, e.end), e.gpa])}</div>
            </div>
          ))}
        </Section>
      )}

      {data.experience.some((x) => x.company || x.role) && (
        <Section title="Experience">
          {data.experience.filter((x) => x.company || x.role).map((x) => (
            <div key={x.id} style={{ marginBottom: 5 }}>
              <div style={title}>{join([x.role, x.company], " — ")}</div>
              {range(x.start, x.end, x.current) && <div style={meta}>{range(x.start, x.end, x.current)}</div>}
              <Described text={x.description} />
            </div>
          ))}
        </Section>
      )}

      {data.projects.some((pr) => pr.name) && (
        <Section title="Projects">
          {data.projects.filter((pr) => pr.name).map((pr) => (
            <div key={pr.id} style={{ marginBottom: 5 }}>
              <div style={title}>{pr.name}</div>
              {(pr.tech || projectLinks(pr).length > 0) && (
                <div style={meta}>{pr.tech}{pr.tech && projectLinks(pr).length > 0 && " | "}<ProjectLinks proj={pr} /></div>
              )}
              <Described text={pr.description} />
            </div>
          ))}
        </Section>
      )}

      {data.skills.trim() && <Section title="Skills"><p style={{ margin: 0 }}>{data.skills}</p></Section>}

      {data.certifications.some((c) => c.name) && (
        <Section title="Certifications">
          {data.certifications.filter((c) => c.name).map((c) => (
            <div key={c.id} style={{ paddingLeft: 16, textIndent: -13 }}>•&nbsp;&nbsp;{join([c.name, c.issuer, c.year], " — ")}<CertLink cert={c} prefix=" | " /></div>
          ))}
        </Section>
      )}

      {data.achievements.some((a) => a.title) && (
        <Section title="Achievements">
          {data.achievements.filter((a) => a.title).map((a) => (
            <div key={a.id} style={{ paddingLeft: 16, textIndent: -13 }}>
              •&nbsp;&nbsp;{join([a.title, a.year], " — ")}{a.description ? `: ${a.description}` : ""}
            </div>
          ))}
        </Section>
      )}

      {extra.length > 0 && (
        <Section title="Additional Information">
          {extra.map(([k, label]) => <p key={k} style={{ margin: 0 }}><b>{label}:</b> {data[k]}</p>)}
        </Section>
      )}
    </div>
  )
}
