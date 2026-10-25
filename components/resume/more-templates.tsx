// Four more resume templates, redrawn after Reactive Resume's designs
// (github.com/AmruthPillai/Reactive-Resume, MIT): Azurill, Ditgar, Pikachu, Porygon.
// Same contract as the five in app/(dashboard)/resume/page.tsx: an A4 page 794px
// wide, inline styles only (html2canvas captures it for the PDF), render-only.

import { Fragment, type CSSProperties, type ReactNode } from "react"
import type { ResumeData } from "@/lib/resume"
import { contactItems, ProjectLinks, CertLink, projectLinks } from "@/components/resume/links"

// ─── Shared bits ──────────────────────────────────────────────────────────────

const list = (s: string) => s.split(",").map(x => x.trim()).filter(Boolean)
const initials = (name: string) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?"
const range = (start: string, end: string, current = false) =>
  `${start}${start && (end || current) ? " – " : ""}${current ? "Present" : end}`
const headline = (d: ResumeData) => d.experience[0]?.role || d.education[0]?.degree || ""

/** Contact items as links ("LinkedIn" / "GitHub" text, full URL behind) — components/resume/links.tsx. */
const contacts = (d: ResumeData): ReactNode[] =>
  contactItems(d.personal).map((c) => <Fragment key={c.kind}>{c.node}</Fragment>)

/** Photo slot. null = switched off (renders nothing); "" = no upload, so initials. */
export function Photo({ data, size, radius, color, bg }: { data: ResumeData; size: number; radius: number | string; color: string; bg: string }) {
  if (data.photo === null) return null
  const box: CSSProperties = { width: size, height: size, borderRadius: radius, flexShrink: 0, overflow: "hidden" }
  if (data.photo) {
    // crossOrigin so html2canvas may read the backend-hosted image into the PDF canvas
    return <img src={data.photo} crossOrigin="anonymous" alt="" style={{ ...box, objectFit: "cover", display: "block" }} />
  }
  return (
    // resume-initials: hidden when printing so "PR" doesn't end up in the PDF's text
    <div className="resume-initials" style={{ ...box, background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700 }}>
      {initials(data.personal.name)}
    </div>
  )
}

function Lines({ text, style }: { text: string; style?: CSSProperties }) {
  return <div style={style}>{text.split("\n").filter(l => l.trim()).map((l, i) => <div key={i}>{l}</div>)}</div>
}

/** Name left, date right. */
function Row({ left, right, style }: { left: ReactNode; right?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, ...style }}>
      <div>{left}</div>
      {right ? <div style={{ flexShrink: 0 }}>{right}</div> : null}
    </div>
  )
}

/** The main-column entries every template renders, styled through `s`. */
interface EntryStyles { title: CSSProperties; sub: CSSProperties; date: CSSProperties; body: CSSProperties; gap: number }

function ExperienceItems({ data, s, wrap }: { data: ResumeData; s: EntryStyles; wrap?: (n: ReactNode, key: string) => ReactNode }) {
  return <>{data.experience.filter(e => e.company || e.role).map(e => {
    const n = (
      <div style={{ marginBottom: s.gap }}>
        <Row left={<span style={s.title}>{e.company || e.role}</span>} right={<span style={s.date}>{range(e.start, e.end, e.current)}</span>} />
        {e.company && e.role && <div style={s.sub}>{e.role}</div>}
        {e.description && <Lines text={e.description} style={{ ...s.body, marginTop: 3 }} />}
      </div>
    )
    return wrap ? wrap(n, e.id) : <div key={e.id}>{n}</div>
  })}</>
}

function ProjectItems({ data, s, wrap }: { data: ResumeData; s: EntryStyles; wrap?: (n: ReactNode, key: string) => ReactNode }) {
  return <>{data.projects.filter(p => p.name).map(p => {
    const n = (
      <div style={{ marginBottom: s.gap }}>
        <Row left={<span style={s.title}>{p.name}</span>} right={projectLinks(p).length ? <span style={{ ...s.date, fontSize: 10 }}><ProjectLinks proj={p} /></span> : null} />
        {p.tech && <div style={s.sub}>{p.tech}</div>}
        {p.description && <Lines text={p.description} style={{ ...s.body, marginTop: 3 }} />}
      </div>
    )
    return wrap ? wrap(n, p.id) : <div key={p.id}>{n}</div>
  })}</>
}

function EducationItems({ data, s, compact }: { data: ResumeData; s: EntryStyles; compact?: boolean }) {
  return <>{data.education.filter(e => e.school).map(e => {
    const degree = [e.degree, e.field && `in ${e.field}`].filter(Boolean).join(" ")
    return compact ? (
      <div key={e.id} style={{ marginBottom: s.gap }}>
        <div style={s.title}>{e.school}</div>
        {degree && <div style={s.sub}>{degree}</div>}
        <div style={s.date}>{[range(e.start, e.end), e.gpa].filter(Boolean).join(" · ")}</div>
      </div>
    ) : (
      <div key={e.id} style={{ marginBottom: s.gap }}>
        <Row left={<span style={s.title}>{e.school}</span>} right={<span style={s.date}>{range(e.start, e.end)}</span>} />
        <Row left={<span style={s.sub}>{degree}</span>} right={e.gpa ? <span style={s.date}>{e.gpa}</span> : null} />
      </div>
    )
  })}</>
}

function CertItems({ data, s }: { data: ResumeData; s: EntryStyles }) {
  return <>{data.certifications.filter(c => c.name).map(c => (
    <div key={c.id} style={{ marginBottom: s.gap }}>
      <div style={s.title}>{c.name}</div>
      <div style={s.sub}>{[c.issuer, c.year].filter(Boolean).join(" · ")}<CertLink cert={c} prefix={c.issuer || c.year ? " · " : ""} /></div>
    </div>
  ))}</>
}

function AchievementItems({ data, s, wrap }: { data: ResumeData; s: EntryStyles; wrap?: (n: ReactNode, key: string) => ReactNode }) {
  return <>{data.achievements.filter(a => a.title).map(a => {
    const n = (
      <div style={{ marginBottom: s.gap }}>
        <Row left={<span style={s.title}>{a.title}</span>} right={a.year ? <span style={s.date}>{a.year}</span> : null} />
        {a.description && <Lines text={a.description} style={{ ...s.body, marginTop: 2 }} />}
      </div>
    )
    return wrap ? wrap(n, a.id) : <div key={a.id}>{n}</div>
  })}</>
}

// ─── Azurill: centred header, sidebar left, timeline right (teal) ─────────────

const AZ = "#0f766e"

export function AzurillTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary } = data
  const skills = list(data.skills), strengths = list(data.strengths), languages = list(data.languages), hobbies = list(data.hobbies)
  const s: EntryStyles = {
    title: { fontWeight: 700, fontSize: 12.5, color: "#1e293b" },
    sub: { fontSize: 11.5, color: "#334155" },
    date: { fontSize: 11, color: "#334155" },
    body: { fontSize: 11.5, color: "#334155", lineHeight: 1.6 },
    gap: 10,
  }
  const side: EntryStyles = { ...s, title: { ...s.title, fontSize: 11.5 }, sub: { fontSize: 11, color: "#334155" }, date: { fontSize: 10.5, color: "#475569" }, gap: 8 }
  const Heading = ({ children }: { children: ReactNode }) => <div style={{ fontSize: 17, color: AZ, marginBottom: 6 }}>{children}</div>
  const Side = ({ title, children }: { title: string; children: ReactNode }) => <div style={{ marginBottom: 20 }}><Heading>{title}</Heading>{children}</div>
  // Main sections hang off a vertical rule with a ring per entry.
  const Timeline = ({ title, children }: { title: string; children: ReactNode }) => (
    <div style={{ marginBottom: 20 }}>
      <Heading>{title}</Heading>
      <div style={{ borderLeft: `1.5px solid ${AZ}`, marginLeft: 7, paddingLeft: 18 }}>{children}</div>
    </div>
  )
  // The ring is a float, not position:absolute — positioned wrappers make the PDF store
  // all entry text after every heading, which scrambles the order ATS software reads.
  const ring = (n: ReactNode, key: string) => (
    <div key={key}>
      <div aria-hidden style={{ float: "left", marginLeft: -26, marginTop: 3, width: 11, height: 11, boxSizing: "border-box", borderRadius: "50%", border: `1.5px solid ${AZ}`, background: "white" }} />
      {n}
    </div>
  )

  return (
    <div style={{ width: 794, minHeight: 1123, background: "white", color: "#1e293b", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 12, padding: "32px 36px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        {data.photo !== null && <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><Photo data={data} size={104} radius="50%" color="white" bg={AZ} /></div>}
        <div style={{ fontSize: 28, fontWeight: 600, color: "#1e293b" }}>{personal.name || "Your Name"}</div>
        {headline(data) && <div style={{ fontSize: 13, color: "#334155", marginTop: 2 }}>{headline(data)}</div>}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "2px 16px", fontSize: 11, color: "#334155", marginTop: 8 }}>
          {contacts(data).map((c, i) => <span key={i}><span style={{ color: AZ }}>● </span>{c}</span>)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 30 }}>
        <div style={{ width: 225, flexShrink: 0 }}>
          {skills.length > 0 && <Side title="Skills"><div style={{ fontSize: 11.5, color: "#334155", lineHeight: 1.7 }}>{skills.join(", ")}</div></Side>}
          {data.education.length > 0 && <Side title="Education"><EducationItems data={data} s={side} compact /></Side>}
          {data.certifications.length > 0 && <Side title="Certifications"><CertItems data={data} s={side} /></Side>}
          {strengths.length > 0 && <Side title="Strengths">{strengths.map((x, i) => <div key={i} style={{ fontSize: 11.5, color: "#334155", marginBottom: 2 }}>{x}</div>)}</Side>}
          {languages.length > 0 && <Side title="Languages">{languages.map((x, i) => <div key={i} style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 2 }}>{x}</div>)}</Side>}
          {hobbies.length > 0 && <Side title="Interests"><div style={{ fontSize: 11.5, color: "#334155", lineHeight: 1.7 }}>{hobbies.join(", ")}</div></Side>}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {(summary || objective) && (
            <Timeline title={summary ? "Summary" : "Objective"}>
              {ring(<p style={{ ...s.body, margin: 0 }}>{summary || objective}</p>, "summary")}
              {summary && objective && ring(<p style={{ ...s.body, margin: "8px 0 0" }}><b>Objective: </b>{objective}</p>, "objective")}
            </Timeline>
          )}
          {data.experience.length > 0 && <Timeline title="Experience"><ExperienceItems data={data} s={s} wrap={ring} /></Timeline>}
          {data.projects.length > 0 && <Timeline title="Projects"><ProjectItems data={data} s={s} wrap={ring} /></Timeline>}
          {data.achievements.length > 0 && <Timeline title="Achievements"><AchievementItems data={data} s={s} wrap={ring} /></Timeline>}
        </div>
      </div>
    </div>
  )
}

// ─── Ditgar: solid purple header block + tinted sidebar, summary band (purple) ─

const DG = "#7155a0", DG_TINT = "#e5ddef"

export function DitgarTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary } = data
  const skills = list(data.skills), strengths = list(data.strengths), languages = list(data.languages), hobbies = list(data.hobbies)
  const s: EntryStyles = {
    title: { fontWeight: 700, fontSize: 12.5, color: "#1f2937" },
    sub: { fontSize: 11.5, color: "#374151" },
    date: { fontSize: 11, color: "#374151" },
    body: { fontSize: 11.5, color: "#374151", lineHeight: 1.6 },
    gap: 10,
  }
  const side: EntryStyles = { ...s, title: { ...s.title, fontSize: 11.5 }, sub: { fontSize: 11, color: "#374151" }, date: { fontSize: 10.5, color: "#4b5563" }, gap: 8 }
  const Heading = ({ children }: { children: ReactNode }) => (
    <div style={{ fontSize: 16, fontWeight: 600, color: DG, borderBottom: `1.5px solid ${DG}`, paddingBottom: 2, marginBottom: 7 }}>{children}</div>
  )
  const Sec = ({ title, children }: { title: string; children: ReactNode }) => <div style={{ marginBottom: 18 }}><Heading>{title}</Heading>{children}</div>
  // Entries in the main column carry a short accent bar beside the title lines.
  const bar = (n: ReactNode, key: string) => <div key={key} style={{ borderLeft: `3px solid ${DG}`, paddingLeft: 9, marginLeft: -12 }}>{n}</div>

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", background: "white", fontFamily: "'Segoe UI', 'Source Sans Pro', Arial, sans-serif", fontSize: 12 }}>
      <div style={{ width: 270, flexShrink: 0, background: DG_TINT, display: "flex", flexDirection: "column" }}>
        <div style={{ background: DG, color: "white", padding: "28px 26px 22px" }}>
          <Photo data={data} size={104} radius="50%" color={DG} bg="white" />
          <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15, marginTop: data.photo === null ? 0 : 12 }}>{personal.name || "Your Name"}</div>
          {headline(data) && <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 4 }}>{headline(data)}</div>}
          <div style={{ marginTop: 10, fontSize: 11, lineHeight: 1.7, wordBreak: "break-all" }}>
            {contacts(data).map((c, i) => <div key={i}>{c}</div>)}
          </div>
        </div>
        <div style={{ padding: "22px 26px", flex: 1 }}>
          {skills.length > 0 && <Sec title="Skills"><div style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{skills.join(", ")}</div></Sec>}
          {data.education.length > 0 && <Sec title="Education"><EducationItems data={data} s={side} compact /></Sec>}
          {data.certifications.length > 0 && <Sec title="Certifications"><CertItems data={data} s={side} /></Sec>}
          {strengths.length > 0 && <Sec title="Strengths">{strengths.map((x, i) => <div key={i} style={{ fontSize: 11.5, color: "#374151", marginBottom: 2 }}>{x}</div>)}</Sec>}
          {languages.length > 0 && <Sec title="Languages">{languages.map((x, i) => <div key={i} style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 2 }}>{x}</div>)}</Sec>}
          {hobbies.length > 0 && <Sec title="Interests"><div style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{hobbies.join(", ")}</div></Sec>}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {(summary || objective) && (
          <div style={{ background: DG_TINT, padding: "24px 28px 18px" }}>
            {summary && <Sec title="Summary"><p style={{ ...s.body, margin: 0 }}>{summary}</p></Sec>}
            {objective && <Sec title="Objective"><p style={{ ...s.body, margin: 0 }}>{objective}</p></Sec>}
          </div>
        )}
        <div style={{ padding: "22px 28px" }}>
          {data.experience.length > 0 && <Sec title="Experience"><ExperienceItems data={data} s={s} wrap={bar} /></Sec>}
          {data.projects.length > 0 && <Sec title="Projects"><ProjectItems data={data} s={s} wrap={bar} /></Sec>}
          {data.achievements.length > 0 && <Sec title="Achievements"><AchievementItems data={data} s={s} /></Sec>}
        </div>
      </div>
    </div>
  )
}

// ─── Pikachu: square photo + sidebar left, rounded colour header right (rose) ─

const PK = "#9b4f68"

export function PikachuTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary } = data
  const skills = list(data.skills), strengths = list(data.strengths), languages = list(data.languages), hobbies = list(data.hobbies)
  const serif = "Georgia, 'Times New Roman', serif"
  const s: EntryStyles = {
    title: { fontWeight: 700, fontSize: 12.5, color: "#1f2937" },
    sub: { fontSize: 11.5, color: "#374151" },
    date: { fontSize: 11, color: "#374151" },
    body: { fontSize: 11.5, color: "#374151", lineHeight: 1.6 },
    gap: 10,
  }
  const side: EntryStyles = { ...s, title: { ...s.title, fontSize: 11.5 }, sub: { fontSize: 11, color: "#374151" }, date: { fontSize: 10.5, color: "#4b5563" }, gap: 8 }
  const Sec = ({ title, children }: { title: string; children: ReactNode }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: serif, fontSize: 17, color: PK, borderBottom: `1px solid ${PK}`, paddingBottom: 2, marginBottom: 7 }}>{title}</div>
      {children}
    </div>
  )

  return (
    <div style={{ width: 794, minHeight: 1123, background: "white", color: "#1f2937", fontFamily: "'Source Sans Pro', 'Segoe UI', Arial, sans-serif", fontSize: 12, padding: "24px 36px", boxSizing: "border-box", display: "flex", gap: 26 }}>
      <div style={{ width: 225, flexShrink: 0 }}>
        {data.photo !== null && <div style={{ marginBottom: 22 }}><Photo data={data} size={112} radius={8} color="white" bg={PK} /></div>}
        {skills.length > 0 && <Sec title="Skills"><div style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{skills.join(", ")}</div></Sec>}
        {data.education.length > 0 && <Sec title="Education"><EducationItems data={data} s={side} compact /></Sec>}
        {data.certifications.length > 0 && <Sec title="Certifications"><CertItems data={data} s={side} /></Sec>}
        {strengths.length > 0 && <Sec title="Strengths">{strengths.map((x, i) => <div key={i} style={{ fontSize: 11.5, color: "#374151", marginBottom: 2 }}>{x}</div>)}</Sec>}
        {languages.length > 0 && <Sec title="Languages">{languages.map((x, i) => <div key={i} style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 2 }}>{x}</div>)}</Sec>}
        {hobbies.length > 0 && <Sec title="Interests"><div style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.7 }}>{hobbies.join(", ")}</div></Sec>}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ background: PK, color: "white", borderRadius: 8, padding: "22px 32px 18px", marginBottom: 22 }}>
          <div style={{ fontFamily: serif, fontSize: 28, lineHeight: 1.15 }}>{personal.name || "Your Name"}</div>
          {headline(data) && <div style={{ fontSize: 12.5, opacity: 0.92, marginTop: 4 }}>{headline(data)}</div>}
          <div style={{ height: 1, background: "rgba(255,255,255,0.85)", margin: "9px 0" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 18px", fontSize: 11 }}>
            {contacts(data).map((c, i) => <span key={i}>{c}</span>)}
          </div>
        </div>
        {summary && <Sec title="Summary"><p style={{ ...s.body, margin: 0 }}>{summary}</p></Sec>}
        {objective && <Sec title="Objective"><p style={{ ...s.body, margin: 0 }}>{objective}</p></Sec>}
        {data.experience.length > 0 && <Sec title="Experience"><ExperienceItems data={data} s={s} /></Sec>}
        {data.projects.length > 0 && <Sec title="Projects"><ProjectItems data={data} s={s} /></Sec>}
        {data.achievements.length > 0 && <Sec title="Achievements"><AchievementItems data={data} s={s} /></Sec>}
      </div>
    </div>
  )
}

// ─── Porygon: single column, boxed header, solid section bars (brick) ─────────

const PG = "#8c5852", PG_LINE = "#e2d6d4"

export function PorygonTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary } = data
  const skills = list(data.skills), strengths = list(data.strengths), languages = list(data.languages), hobbies = list(data.hobbies)
  const serif = "Georgia, 'Times New Roman', serif"
  const s: EntryStyles = {
    title: { fontWeight: 700, fontSize: 12.5, color: "#1f2937" },
    sub: { fontSize: 11.5, color: "#374151" },
    date: { fontSize: 11, color: "#374151" },
    body: { fontSize: 11.5, color: "#374151", lineHeight: 1.6 },
    gap: 0,
  }
  // Every entry sits in its own ruled cell under a solid bar heading.
  const Sec = ({ title, children }: { title: string; children: ReactNode }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ background: PG, color: "white", fontFamily: serif, fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", padding: "4px 12px" }}>{title}</div>
      <div style={{ border: `1px solid ${PG_LINE}`, borderTop: "none" }}>{children}</div>
    </div>
  )
  const cell = (n: ReactNode, key: string) => <div key={key} style={{ padding: "8px 12px", borderTop: `1px solid ${PG_LINE}` }}>{n}</div>
  const Cells = ({ items }: { items: string[] }) => (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {items.map((x, i) => <div key={i} style={{ padding: "6px 12px", fontSize: 11.5, color: "#374151", borderRight: `1px solid ${PG_LINE}` }}>{x}</div>)}
    </div>
  )
  const cs = contacts(data)

  return (
    <div style={{ width: 794, minHeight: 1123, background: "white", color: "#1f2937", fontFamily: "'Lato', 'Segoe UI', Arial, sans-serif", fontSize: 12, padding: "16px 36px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", border: `1px solid ${PG}`, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ padding: "12px 12px 8px" }}>
            <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 700, lineHeight: 1.1 }}>{personal.name || "Your Name"}</div>
            {headline(data) && <div style={{ fontSize: 12.5, color: PG, marginTop: 4 }}>{headline(data)}</div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `1px solid ${PG_LINE}` }}>
            {cs.map((c, i) => (
              <div key={i} style={{ padding: "5px 12px", fontSize: 11, color: "#374151", borderTop: i >= 2 ? `1px solid ${PG_LINE}` : "none", borderRight: i % 2 === 0 ? `1px solid ${PG_LINE}` : "none", wordBreak: "break-all" }}>{c}</div>
            ))}
          </div>
        </div>
        {data.photo !== null && (
          <div style={{ padding: 10, borderLeft: `1px solid ${PG_LINE}`, display: "flex", alignItems: "center" }}>
            <Photo data={data} size={98} radius={6} color="white" bg={PG} />
          </div>
        )}
      </div>

      {summary && <Sec title="Summary">{cell(<p style={{ ...s.body, margin: 0 }}>{summary}</p>, "s")}</Sec>}
      {objective && <Sec title="Objective">{cell(<p style={{ ...s.body, margin: 0 }}>{objective}</p>, "o")}</Sec>}
      {data.experience.length > 0 && <Sec title="Experience"><ExperienceItems data={data} s={s} wrap={cell} /></Sec>}
      {data.projects.length > 0 && <Sec title="Projects"><ProjectItems data={data} s={s} wrap={cell} /></Sec>}
      {data.education.length > 0 && (
        <Sec title="Education">{data.education.filter(e => e.school).map(e => cell(<EducationItems data={{ ...data, education: [e] }} s={s} />, e.id))}</Sec>
      )}
      {skills.length > 0 && <Sec title="Skills"><Cells items={skills} /></Sec>}
      {data.certifications.length > 0 && (
        <Sec title="Certifications">{data.certifications.filter(c => c.name).map(c => cell(
          <><Row left={<span style={s.title}>{c.name}</span>} right={c.year ? <span style={s.date}>{c.year}</span> : null} />{(c.issuer || c.url) && <div style={s.sub}>{c.issuer}<CertLink cert={c} prefix={c.issuer ? " · " : ""} /></div>}</>, c.id))}</Sec>
      )}
      {data.achievements.length > 0 && (
        <Sec title="Achievements">{data.achievements.filter(a => a.title).map(a => cell(<AchievementItems data={{ ...data, achievements: [a] }} s={s} />, a.id))}</Sec>
      )}
      {strengths.length > 0 && <Sec title="Strengths"><Cells items={strengths} /></Sec>}
      {languages.length > 0 && <Sec title="Languages"><Cells items={languages} /></Sec>}
      {hobbies.length > 0 && <Sec title="Interests"><Cells items={hobbies} /></Sec>}
    </div>
  )
}
