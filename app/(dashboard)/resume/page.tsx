"use client"

// Resume builder. The facts come from the Career Profile (lib/resume.ts merges
// them with this resume's choices); the templates below (and the four in
// components/resume/more-templates.tsx) only render.

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Printer, RotateCcw, Cloud, CloudOff, ZoomIn, ZoomOut, FileCheck2, AlertTriangle, PencilLine, Gauge, Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"
import { fetchCareerProfile, type CareerProfile } from "@/lib/career-profile"
import {
  buildResumeData, loadStore, newResume, pruneDoc, layoutOf,
  type ResumeData, type ResumeDoc, type ResumeStore, type TemplateId,
} from "@/lib/resume"
import { ResumeEditor } from "@/components/resume/resume-editor"
import { AtsTemplate } from "@/components/resume/ats-template"
import { ResumeLink, hrefOf, contactItems, ProjectLinks, CertLink, projectLinks } from "@/components/resume/links"
import { AtsPanel } from "@/components/resume/ats-panel"
import { downloadTextPdf, type FixTarget } from "@/lib/resume-ats"
import { AzurillTemplate, DitgarTemplate, PikachuTemplate, PorygonTemplate, Photo } from "@/components/resume/more-templates"

const TEMPLATES: { id: TemplateId; label: string; accent: string }[] = [
  { id: "ats",     label: "ATS",     accent: "#111111" },   // real-text PDF — the one to upload to job portals
  { id: "modern",  label: "Modern",  accent: "#0E7070" },
  { id: "classic", label: "Classic", accent: "#1a1a1a" },
  { id: "minimal", label: "Minimal", accent: "#6366f1" },
  { id: "sharp",   label: "Sharp",   accent: "#059669" },
  { id: "elegant", label: "Elegant", accent: "#d97706" },
  { id: "azurill", label: "Timeline", accent: "#0f766e" },
  { id: "ditgar",  label: "Bold",     accent: "#7155a0" },
  { id: "pikachu", label: "Banner",   accent: "#9b4f68" },
  { id: "porygon", label: "Boxed",    accent: "#8c5852" },
]

// ─── Template 1: Modern (teal sidebar) ───────────────────────────────────────
function ModernTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary, experience, education, projects, skills, strengths, languages, hobbies, certifications, achievements } = data
  const skillList      = skills.split(",").map(s => s.trim()).filter(Boolean)
  const strengthList   = strengths.split(",").map(s => s.trim()).filter(Boolean)
  const languageList   = languages.split(",").map(s => s.trim()).filter(Boolean)
  const hobbyList      = hobbies.split(",").map(s => s.trim()).filter(Boolean)

  return (
    <div style={{ width: 794, minHeight: 1123, display: "flex", fontFamily: "Arial, Helvetica, sans-serif", background: "white", fontSize: 12 }}>
      {/* Sidebar */}
      <div style={{ width: 230, background: "#18181b", color: "white", padding: "36px 18px", display: "flex", flexDirection: "column", gap: 20, flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          {data.photo !== null && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Photo data={data} size={72} radius="50%" color="#18181b" bg="#0E7070" />
            </div>
          )}
          <div style={{ marginTop: data.photo === null ? 0 : 10, fontSize: 15, fontWeight: 700, color: "#0E7070", lineHeight: 1.3 }}>{personal.name || "Your Name"}</div>
          {experience[0]?.role && <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>{experience[0].role}</div>}
        </div>

        <SideSection title="Contact" color="#0E7070">
          {/* SVG icons, not emoji: emoji turn into stray characters in the PDF's text layer.
              Links are printed in full (linkedin.com/in/…) so ATS software recognises them. */}
          {personal.email    && <SideRow icon={Mail} text={<ResumeLink href={`mailto:${personal.email}`} style={{ textDecoration: "none" }}>{personal.email}</ResumeLink>} />}
          {personal.phone    && <SideRow icon={Phone} text={personal.phone} />}
          {personal.location && <SideRow icon={MapPin} text={personal.location} />}
          {personal.linkedin && <SideRow icon={Linkedin} text={hrefOf(personal.linkedin) ? <ResumeLink href={hrefOf(personal.linkedin)}>LinkedIn</ResumeLink> : personal.linkedin} />}
          {personal.github   && <SideRow icon={Github} text={hrefOf(personal.github) ? <ResumeLink href={hrefOf(personal.github)}>GitHub</ResumeLink> : personal.github} />}
          {personal.website  && <SideRow icon={Globe} text={hrefOf(personal.website) ? <ResumeLink href={hrefOf(personal.website)}>{personal.website}</ResumeLink> : personal.website} />}
        </SideSection>

        {skillList.length > 0 && (
          <SideSection title="Skills" color="#0E7070">
            {skillList.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0E7070", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>{s}</span>
              </div>
            ))}
          </SideSection>
        )}

        {certifications.length > 0 && (
          <SideSection title="Certifications" color="#0E7070">
            {certifications.map(c => c.name ? (
              <div key={c.id} style={{ marginBottom: 7 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{c.name}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}<CertLink cert={c} prefix={c.issuer || c.year ? " · " : ""} /></div>
              </div>
            ) : null)}
          </SideSection>
        )}

        {strengthList.length > 0 && (
          <SideSection title="Strengths" color="#0E7070">
            {strengthList.map((s, i) => <div key={i} style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 3 }}>· {s}</div>)}
          </SideSection>
        )}

        {languageList.length > 0 && (
          <SideSection title="Languages" color="#0E7070">
            {languageList.map((l, i) => <div key={i} style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 3 }}>· {l}</div>)}
          </SideSection>
        )}

        {hobbyList.length > 0 && (
          <SideSection title="Interests" color="#0E7070">
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7 }}>{hobbyList.join(" · ")}</div>
          </SideSection>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "36px 28px", background: "white", color: "#1e293b" }}>
        {objective && (
          <BodySection title="Objective" borderColor="#0E7070">
            <p style={{ fontSize: 12, lineHeight: 1.75, color: "#475569" }}>{objective}</p>
          </BodySection>
        )}
        {summary && (
          <BodySection title="Summary" borderColor="#0E7070">
            <p style={{ fontSize: 12, lineHeight: 1.75, color: "#475569" }}>{summary}</p>
          </BodySection>
        )}

        {experience.length > 0 && (
          <BodySection title="Experience" borderColor="#0E7070">
            {experience.map(exp => !exp.company && !exp.role ? null : (
              <div key={exp.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{exp.role || "Role"}</div>
                    <div style={{ fontSize: 11, color: "#0E7070", fontWeight: 600 }}>{exp.company}</div>
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b", flexShrink: 0, marginLeft: 8 }}>
                    {exp.start}{(exp.start && (exp.end || exp.current)) ? " – " : ""}{exp.current ? "Present" : exp.end}
                  </div>
                </div>
                {exp.description && <DescLines text={exp.description} />}
              </div>
            ))}
          </BodySection>
        )}

        {education.length > 0 && (
          <BodySection title="Education" borderColor="#0E7070">
            {education.map(edu => !edu.school ? null : (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{edu.school}</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>{edu.start}{edu.start && edu.end ? " – " : ""}{edu.end}</div>
                </div>
                <div style={{ fontSize: 11, color: "#475569" }}>
                  {[edu.degree, edu.field ? `in ${edu.field}` : "", edu.gpa ? `GPA: ${edu.gpa}` : ""].filter(Boolean).join(" ")}
                </div>
              </div>
            ))}
          </BodySection>
        )}

        {projects.length > 0 && (
          <BodySection title="Projects" borderColor="#0E7070">
            {projects.map(proj => !proj.name ? null : (
              <div key={proj.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{proj.name}</div>
                  {projectLinks(proj).length > 0 && <div style={{ fontSize: 9.5, color: "#0E7070" }}><ProjectLinks proj={proj} /></div>}
                </div>
                {proj.tech && <div style={{ fontSize: 10, color: "#0E7070", fontWeight: 600, marginBottom: 2 }}>{proj.tech}</div>}
                {proj.description && <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.65 }}>{proj.description}</div>}
              </div>
            ))}
          </BodySection>
        )}
      </div>
    </div>
  )
}
function SideSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 7, paddingBottom: 4, borderBottom: `1px solid ${color}40` }}>{title}</div>
      {children}
    </div>
  )
}
function SideRow({ icon: Icon, text }: { icon: LucideIcon; text: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "flex-start" }}>
      <Icon aria-hidden size={11} strokeWidth={2} style={{ flexShrink: 0, opacity: 0.8, marginTop: 1.5, color: "#cbd5e1" }} />
      <span style={{ fontSize: 10, color: "#cbd5e1", wordBreak: "break-all", lineHeight: 1.4 }}>{text}</span>
    </div>
  )
}
function BodySection({ title, borderColor, children }: { title: string; borderColor: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#18181b", marginBottom: 8, paddingBottom: 4, borderBottom: `2px solid ${borderColor}` }}>{title}</div>
      {children}
    </div>
  )
}
function DescLines({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 5, fontSize: 11, color: "#475569", lineHeight: 1.65 }}>
      {text.split("\n").map((l, i) => <div key={i}>{l}</div>)}
    </div>
  )
}

// ─── Template 2: Classic (serif, B&W) ────────────────────────────────────────
function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary, experience, education, projects, skills, strengths, languages, hobbies, certifications, achievements } = data
  const skillList      = skills.split(",").map(s => s.trim()).filter(Boolean)
  const strengthList   = strengths.split(",").map(s => s.trim()).filter(Boolean)
  const languageList   = languages.split(",").map(s => s.trim()).filter(Boolean)
  const hobbyList      = hobbies.split(",").map(s => s.trim()).filter(Boolean)
  const contactParts = contactItems(personal)

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "Georgia, 'Times New Roman', serif", background: "white", color: "#1a1a1a", padding: "44px 52px", fontSize: 12, boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{personal.name || "YOUR NAME"}</div>
        <div style={{ height: 2, background: "#1a1a1a", margin: "8px 0 6px" }} />
        <div style={{ fontSize: 10.5, color: "#555", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "3px 14px" }}>
          {contactParts.map((c) => <span key={c.kind}>{c.node}</span>)}
        </div>
        <div style={{ height: 1, background: "#1a1a1a", marginTop: 8 }} />
      </div>

      {objective && <ClassicSection title="Objective"><p style={{ fontSize: 12, lineHeight: 1.75, color: "#333" }}>{objective}</p></ClassicSection>}
      {summary && <ClassicSection title="Summary"><p style={{ fontSize: 12, lineHeight: 1.75, color: "#333" }}>{summary}</p></ClassicSection>}

      {experience.length > 0 && (
        <ClassicSection title="Professional Experience">
          {experience.map(exp => !exp.company && !exp.role ? null : (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{exp.company}</span>
                <span style={{ fontSize: 10.5, color: "#555" }}>{exp.start}{(exp.start && (exp.end || exp.current)) ? " – " : ""}{exp.current ? "Present" : exp.end}</span>
              </div>
              <div style={{ fontStyle: "italic", fontSize: 11.5, color: "#444", marginBottom: 4 }}>{exp.role}</div>
              {exp.description && <div style={{ fontSize: 11.5, lineHeight: 1.7 }}>{exp.description.split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>}
            </div>
          ))}
        </ClassicSection>
      )}

      {education.length > 0 && (
        <ClassicSection title="Education">
          {education.map(edu => !edu.school ? null : (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{edu.school}</div>
                <div style={{ fontStyle: "italic", fontSize: 11.5, color: "#444" }}>
                  {[edu.degree, edu.field ? `— ${edu.field}` : "", edu.gpa ? `| GPA: ${edu.gpa}` : ""].filter(Boolean).join(" ")}
                </div>
              </div>
              <div style={{ fontSize: 10.5, color: "#555", flexShrink: 0, marginLeft: 12 }}>{edu.start}{edu.start && edu.end ? " – " : ""}{edu.end}</div>
            </div>
          ))}
        </ClassicSection>
      )}

      {projects.length > 0 && (
        <ClassicSection title="Projects">
          {projects.map(proj => !proj.name ? null : (
            <div key={proj.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "0 8px" }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{proj.name}</span>
                {proj.tech && <span style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>{proj.tech}</span>}
                {projectLinks(proj).length > 0 && <span style={{ fontSize: 10, color: "#555" }}><ProjectLinks proj={proj} /></span>}
              </div>
              {proj.description && <div style={{ fontSize: 11.5, lineHeight: 1.7, color: "#333", marginTop: 2 }}>{proj.description}</div>}
            </div>
          ))}
        </ClassicSection>
      )}

      <div style={{ display: "flex", gap: 36, marginTop: 4 }}>
        {skillList.length > 0 && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}>Skills</div>
            <div style={{ fontSize: 11.5, lineHeight: 1.8, color: "#333" }}>{skillList.join(" · ")}</div>
          </div>
        )}
        {certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}>Certifications</div>
            {certifications.map(c => c.name ? (
              <div key={c.id} style={{ fontSize: 11.5, marginBottom: 3 }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {c.issuer && <span style={{ color: "#555" }}> — {c.issuer}</span>}
                {c.year && <span style={{ color: "#777" }}> ({c.year})</span>}
                <span style={{ color: "#555" }}><CertLink cert={c} prefix=" · " /></span>
              </div>
            ) : null)}
          </div>
        )}
      </div>

      {achievements.length > 0 && (
        <ClassicSection title="Achievements">
          {achievements.map(a => a.title ? (
            <div key={a.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{a.title}</span>
                {a.year && <span style={{ fontSize: 10.5, color: "#777" }}>{a.year}</span>}
              </div>
              {a.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.65 }}>{a.description}</div>}
            </div>
          ) : null)}
        </ClassicSection>
      )}

      {(strengthList.length > 0 || languageList.length > 0 || hobbyList.length > 0) && (
        <div style={{ display: "flex", gap: 36, marginTop: 4 }}>
          {strengthList.length > 0 && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}>Strengths</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.8, color: "#333" }}>{strengthList.join(" · ")}</div>
            </div>
          )}
          {languageList.length > 0 && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}>Languages</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.8, color: "#333" }}>{languageList.join(" · ")}</div>
            </div>
          )}
          {hobbyList.length > 0 && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, borderBottom: "1px solid #1a1a1a", paddingBottom: 4 }}>Interests</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.8, color: "#333" }}>{hobbyList.join(" · ")}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
function ClassicSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{title}</div>
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 8 }}>{children}</div>
    </div>
  )
}

// ─── Template 3: Minimal (clean, indigo accents) ──────────────────────────────
function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary, experience, education, projects, skills, strengths, languages, hobbies, certifications, achievements } = data
  const skillList      = skills.split(",").map(s => s.trim()).filter(Boolean)
  const strengthList   = strengths.split(",").map(s => s.trim()).filter(Boolean)
  const languageList   = languages.split(",").map(s => s.trim()).filter(Boolean)
  const hobbyList      = hobbies.split(",").map(s => s.trim()).filter(Boolean)

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "'Helvetica Neue', Arial, sans-serif", background: "white", color: "#111", padding: "52px 60px", fontSize: 12, boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, borderLeft: "4px solid #6366f1", paddingLeft: 16 }}>
        <div style={{ fontSize: 30, fontWeight: 300, letterSpacing: "-0.01em", color: "#111" }}>{personal.name || "Your Name"}</div>
        {experience[0]?.role && <div style={{ fontSize: 13, color: "#6366f1", marginTop: 3, fontWeight: 500 }}>{experience[0].role}</div>}
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: "2px 18px", fontSize: 10.5, color: "#888" }}>
          {contactItems(personal).map((c) => <span key={c.kind}>{c.node}</span>)}
        </div>
      </div>

      {objective && (
        <MinSection title="Objective">
          <p style={{ fontSize: 12, lineHeight: 1.85, color: "#444", maxWidth: "95%" }}>{objective}</p>
        </MinSection>
      )}
      {summary && (
        <MinSection title="Summary">
          <p style={{ fontSize: 12, lineHeight: 1.85, color: "#444", maxWidth: "95%" }}>{summary}</p>
        </MinSection>
      )}

      {experience.length > 0 && (
        <MinSection title="Experience">
          {experience.map(exp => !exp.company && !exp.role ? null : (
            <div key={exp.id} style={{ display: "flex", gap: 20, marginBottom: 16 }}>
              <div style={{ width: 110, flexShrink: 0, fontSize: 10, color: "#999", paddingTop: 2, lineHeight: 1.5 }}>
                {exp.start}{(exp.start && (exp.end || exp.current)) ? "–" : ""}{exp.current ? "Now" : exp.end}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{exp.role}</div>
                <div style={{ fontSize: 11.5, color: "#6366f1", marginBottom: 3, fontWeight: 500 }}>{exp.company}</div>
                {exp.description && <div style={{ fontSize: 11, color: "#444", lineHeight: 1.7 }}>{exp.description.split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>}
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {education.length > 0 && (
        <MinSection title="Education">
          {education.map(edu => !edu.school ? null : (
            <div key={edu.id} style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div style={{ width: 110, flexShrink: 0, fontSize: 10, color: "#999", paddingTop: 2 }}>
                {edu.start}{edu.start && edu.end ? "–" : ""}{edu.end}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{edu.school}</div>
                <div style={{ fontSize: 11.5, color: "#555" }}>
                  {[edu.degree, edu.field ? `· ${edu.field}` : "", edu.gpa ? `· GPA ${edu.gpa}` : ""].filter(Boolean).join(" ")}
                </div>
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {projects.length > 0 && (
        <MinSection title="Projects">
          {projects.map(proj => !proj.name ? null : (
            <div key={proj.id} style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div style={{ width: 110, flexShrink: 0, fontSize: 10, color: "#6366f1", paddingTop: 2, lineHeight: 1.5 }}>{proj.tech}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  {proj.name}
                  {projectLinks(proj).length > 0 && <span style={{ fontWeight: 400, fontSize: 10, color: "#888", marginLeft: 8 }}><ProjectLinks proj={proj} /></span>}
                </div>
                {proj.description && <div style={{ fontSize: 11, color: "#444", lineHeight: 1.7, marginTop: 2 }}>{proj.description}</div>}
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {skillList.length > 0 && (
        <MinSection title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 10px" }}>
            {skillList.map((s, i) => (
              <span key={i} style={{ fontSize: 11, color: "#333", background: "#f5f5f7", padding: "2px 10px", borderRadius: 20, border: "1px solid #e5e5e5" }}>{s}</span>
            ))}
          </div>
        </MinSection>
      )}

      {certifications.length > 0 && (
        <MinSection title="Certifications">
          {certifications.map(c => c.name ? (
            <div key={c.id} style={{ fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{c.name}</span>
              {c.issuer && <span style={{ color: "#666" }}>, {c.issuer}</span>}
              {c.year && <span style={{ color: "#999" }}> ({c.year})</span>}
              <span style={{ color: "#888" }}><CertLink cert={c} prefix=" · " /></span>
            </div>
          ) : null)}
        </MinSection>
      )}

      {achievements.length > 0 && (
        <MinSection title="Achievements">
          {achievements.map(a => a.title ? (
            <div key={a.id} style={{ display: "flex", gap: 20, marginBottom: 10 }}>
              <div style={{ width: 110, flexShrink: 0, fontSize: 10, color: "#999", paddingTop: 2 }}>{a.year}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{a.title}</div>
                {a.description && <div style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>{a.description}</div>}
              </div>
            </div>
          ) : null)}
        </MinSection>
      )}

      {strengthList.length > 0 && (
        <MinSection title="Strengths">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 10px" }}>
            {strengthList.map((s, i) => (
              <span key={i} style={{ fontSize: 11, color: "#333", background: "#f5f5f7", padding: "2px 10px", borderRadius: 20, border: "1px solid #e5e5e5" }}>{s}</span>
            ))}
          </div>
        </MinSection>
      )}

      {(languageList.length > 0 || hobbyList.length > 0) && (
        <div style={{ display: "flex", gap: 40 }}>
          {languageList.length > 0 && (
            <MinSection title="Languages">
              <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.8 }}>{languageList.join(" · ")}</div>
            </MinSection>
          )}
          {hobbyList.length > 0 && (
            <MinSection title="Interests">
              <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.8 }}>{hobbyList.join(" · ")}</div>
            </MinSection>
          )}
        </div>
      )}
    </div>
  )
}
function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#bbb", marginBottom: 10, paddingBottom: 5, borderBottom: "1px solid #ebebeb" }}>{title}</div>
      {children}
    </div>
  )
}

// ─── Template 4: Sharp (two-column, emerald accents) ─────────────────────────
function SharpTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary, experience, education, projects, skills, strengths, languages, hobbies, certifications, achievements } = data
  const skillList      = skills.split(",").map(s => s.trim()).filter(Boolean)
  const strengthList   = strengths.split(",").map(s => s.trim()).filter(Boolean)
  const languageList   = languages.split(",").map(s => s.trim()).filter(Boolean)
  const hobbyList      = hobbies.split(",").map(s => s.trim()).filter(Boolean)
  const contactParts = contactItems(personal, ["phone", "location", "email"])

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "Arial, Helvetica, sans-serif", background: "white", color: "#111", fontSize: 12, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      {/* Full-width header */}
      <div style={{ background: "#0d1f1a", padding: "28px 36px 22px" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "white", letterSpacing: "0.02em" }}>{personal.name || "Your Name"}</div>
        {experience[0]?.role && <div style={{ fontSize: 13, color: "#34d399", marginTop: 4, fontWeight: 500 }}>{experience[0].role}</div>}
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: "3px 20px", fontSize: 10.5, color: "#94a3b8" }}>
          {contactParts.map((c) => (
            <span key={c.kind} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#059669", display: "inline-block" }} />
              {c.node}
            </span>
          ))}
          {contactItems(personal, ["linkedin", "github", "website"]).map((c) => <span key={c.kind} style={{ color: "#94a3b8" }}>{c.node}</span>)}
        </div>
      </div>

      {/* Two-column body — fills the rest of the page (a fixed minHeight plus the header overflowed A4 onto a blank page 2) */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Left column */}
        <div style={{ width: 220, background: "#f0faf6", padding: "24px 18px", borderRight: "3px solid #059669", flexShrink: 0 }}>
          {skillList.length > 0 && (
            <SharpSection title="Skills" accent="#059669">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {skillList.map((s, i) => (
                  <span key={i} style={{ fontSize: 10.5, background: "white", border: "1px solid #d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: 3, fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </SharpSection>
          )}

          {education.length > 0 && (
            <SharpSection title="Education" accent="#059669">
              {education.map(edu => !edu.school ? null : (
                <div key={edu.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 11.5, color: "#111" }}>{edu.school}</div>
                  <div style={{ fontSize: 10.5, color: "#444", marginTop: 1 }}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 1 }}>{[edu.start && edu.end ? `${edu.start} – ${edu.end}` : (edu.start || edu.end), edu.gpa ? `GPA: ${edu.gpa}` : ""].filter(Boolean).join(" · ")}</div>
                </div>
              ))}
            </SharpSection>
          )}

          {certifications.length > 0 && (
            <SharpSection title="Certifications" accent="#059669">
              {certifications.map(c => c.name ? (
                <div key={c.id} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 11, color: "#111" }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: "#666" }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}<CertLink cert={c} prefix={c.issuer || c.year ? " · " : ""} /></div>
                </div>
              ) : null)}
            </SharpSection>
          )}

          {strengthList.length > 0 && (
            <SharpSection title="Strengths" accent="#059669">
              {strengthList.map((s, i) => <div key={i} style={{ fontSize: 10.5, color: "#333", marginBottom: 3 }}>· {s}</div>)}
            </SharpSection>
          )}

          {languageList.length > 0 && (
            <SharpSection title="Languages" accent="#059669">
              {languageList.map((l, i) => <div key={i} style={{ fontSize: 10.5, color: "#333", marginBottom: 3 }}>· {l}</div>)}
            </SharpSection>
          )}

          {hobbyList.length > 0 && (
            <SharpSection title="Interests" accent="#059669">
              <div style={{ fontSize: 10.5, color: "#555", lineHeight: 1.7 }}>{hobbyList.join(" · ")}</div>
            </SharpSection>
          )}
        </div>

        {/* Right column */}
        <div style={{ flex: 1, padding: "24px 28px" }}>
          {objective && (
            <SharpSection title="Objective" accent="#059669">
              <p style={{ fontSize: 12, lineHeight: 1.75, color: "#333" }}>{objective}</p>
            </SharpSection>
          )}
          {summary && (
            <SharpSection title="Summary" accent="#059669">
              <p style={{ fontSize: 12, lineHeight: 1.75, color: "#333" }}>{summary}</p>
            </SharpSection>
          )}

          {experience.length > 0 && (
            <SharpSection title="Experience" accent="#059669">
              {experience.map(exp => !exp.company && !exp.role ? null : (
                <div key={exp.id} style={{ marginBottom: 14, paddingLeft: 10, borderLeft: "2px solid #d1fae5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{exp.role}</div>
                    <div style={{ fontSize: 10, color: "#64748b", flexShrink: 0, marginLeft: 8 }}>
                      {exp.start}{(exp.start && (exp.end || exp.current)) ? " – " : ""}{exp.current ? "Present" : exp.end}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#059669", fontWeight: 600, marginBottom: 3 }}>{exp.company}</div>
                  {exp.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.65 }}>{exp.description.split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>}
                </div>
              ))}
            </SharpSection>
          )}

          {projects.length > 0 && (
            <SharpSection title="Projects" accent="#059669">
              {projects.map(proj => !proj.name ? null : (
                <div key={proj.id} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{proj.name}</span>
                    {proj.tech && <span style={{ fontSize: 10, color: "#059669", fontWeight: 600 }}>{proj.tech}</span>}
                  </div>
                  {projectLinks(proj).length > 0 && <div style={{ fontSize: 10, color: "#059669", marginBottom: 2 }}><ProjectLinks proj={proj} /></div>}
                  {proj.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.65 }}>{proj.description}</div>}
                </div>
              ))}
            </SharpSection>
          )}

          {achievements.length > 0 && (
            <SharpSection title="Achievements" accent="#059669">
              {achievements.map(a => a.title ? (
                <div key={a.id} style={{ marginBottom: 10, paddingLeft: 10, borderLeft: "2px solid #d1fae5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{a.title}</div>
                    {a.year && <div style={{ fontSize: 10, color: "#64748b", flexShrink: 0, marginLeft: 8 }}>{a.year}</div>}
                  </div>
                  {a.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.65 }}>{a.description}</div>}
                </div>
              ) : null)}
            </SharpSection>
          )}
        </div>
      </div>
    </div>
  )
}
function SharpSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: accent, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 16, height: 2, background: accent }} />
        {title}
      </div>
      {children}
    </div>
  )
}

// ─── Template 5: Elegant (gradient header, amber accents) ────────────────────
function ElegantTemplate({ data }: { data: ResumeData }) {
  const { personal, objective, summary, experience, education, projects, skills, strengths, languages, hobbies, certifications, achievements } = data
  const skillList      = skills.split(",").map(s => s.trim()).filter(Boolean)
  const strengthList   = strengths.split(",").map(s => s.trim()).filter(Boolean)
  const languageList   = languages.split(",").map(s => s.trim()).filter(Boolean)
  const hobbyList      = hobbies.split(",").map(s => s.trim()).filter(Boolean)

  return (
    <div style={{ width: 794, minHeight: 1123, fontFamily: "'Georgia', 'Times New Roman', serif", background: "white", color: "#1a1a1a", fontSize: 12, boxSizing: "border-box" }}>
      {/* Gradient header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "36px 44px 30px", position: "relative", overflow: "hidden" }}>
        {/* Decorative circle */}
        <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(217,119,6,0.12)" }} />
        <div style={{ position: "absolute", right: 30, bottom: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(217,119,6,0.08)" }} />

        <div style={{ fontSize: 32, fontWeight: 700, color: "white", letterSpacing: "0.03em", fontFamily: "Georgia, serif" }}>{personal.name || "Your Name"}</div>
        {experience[0]?.role && (
          <div style={{ fontSize: 14, color: "#fbbf24", marginTop: 5, fontStyle: "italic", fontWeight: 400 }}>{experience[0].role}</div>
        )}
        {/* Divider */}
        <div style={{ width: 60, height: 2, background: "#d97706", margin: "12px 0" }} />
        {/* Contact row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 22px", fontSize: 10.5, color: "#cbd5e1" }}>
          {contactItems(personal).map((c) => <span key={c.kind}>{c.node}</span>)}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "30px 44px" }}>
        {objective && (
          <ElegantSection title="Objective">
            <p style={{ fontSize: 12.5, lineHeight: 1.85, color: "#444", fontStyle: "italic" }}>{objective}</p>
          </ElegantSection>
        )}
        {summary && (
          <ElegantSection title="Summary">
            <p style={{ fontSize: 12.5, lineHeight: 1.85, color: "#444", fontStyle: "italic" }}>{summary}</p>
          </ElegantSection>
        )}

        {/* Two-col: Experience (left 60%) + Skills/Certs (right 38%) */}
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          <div style={{ flex: "0 0 58%" }}>
            {experience.length > 0 && (
              <ElegantSection title="Experience">
                {experience.map(exp => !exp.company && !exp.role ? null : (
                  <div key={exp.id} style={{ marginBottom: 15 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{exp.role}</div>
                        <div style={{ fontSize: 11.5, color: "#d97706", fontWeight: 600 }}>{exp.company}</div>
                      </div>
                      <div style={{ fontSize: 10, color: "#888", flexShrink: 0, marginLeft: 8, fontFamily: "Arial, sans-serif" }}>
                        {exp.start}{(exp.start && (exp.end || exp.current)) ? " – " : ""}{exp.current ? "Present" : exp.end}
                      </div>
                    </div>
                    {exp.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.7, marginTop: 4 }}>{exp.description.split("\n").map((l, i) => <div key={i}>{l}</div>)}</div>}
                  </div>
                ))}
              </ElegantSection>
            )}

            {projects.length > 0 && (
              <ElegantSection title="Projects">
                {projects.map(proj => !proj.name ? null : (
                  <div key={proj.id} style={{ marginBottom: 11 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{proj.name}{proj.tech && <span style={{ fontWeight: 400, fontSize: 10.5, color: "#888", marginLeft: 8, fontFamily: "Arial, sans-serif" }}>{proj.tech}</span>}</div>
                    {projectLinks(proj).length > 0 && <div style={{ fontSize: 10, color: "#b45309", fontFamily: "Arial, sans-serif" }}><ProjectLinks proj={proj} /></div>}
                    {proj.description && <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.7, marginTop: 2 }}>{proj.description}</div>}
                  </div>
                ))}
              </ElegantSection>
            )}
          </div>

          <div style={{ flex: 1 }}>
            {education.length > 0 && (
              <ElegantSection title="Education">
                {education.map(edu => !edu.school ? null : (
                  <div key={edu.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>{edu.school}</div>
                    <div style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</div>
                    <div style={{ fontSize: 10, color: "#999", fontFamily: "Arial, sans-serif", marginTop: 1 }}>{edu.start}{edu.start && edu.end ? ` – ${edu.end}` : ""}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</div>
                  </div>
                ))}
              </ElegantSection>
            )}

            {skillList.length > 0 && (
              <ElegantSection title="Skills">
                <div style={{ fontFamily: "Arial, sans-serif" }}>
                  {skillList.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                      <div style={{ width: 5, height: 5, background: "#d97706", transform: "rotate(45deg)", flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: "#333" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </ElegantSection>
            )}

            {certifications.length > 0 && (
              <ElegantSection title="Certifications">
                {certifications.map(c => c.name ? (
                  <div key={c.id} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 11.5 }}>{c.name}</div>
                    <div style={{ fontSize: 10.5, color: "#666", fontFamily: "Arial, sans-serif" }}>{[c.issuer, c.year].filter(Boolean).join(" · ")}<CertLink cert={c} prefix={c.issuer || c.year ? " · " : ""} /></div>
                  </div>
                ) : null)}
              </ElegantSection>
            )}

            {achievements.length > 0 && (
              <ElegantSection title="Achievements">
                {achievements.map(a => a.title ? (
                  <div key={a.id} style={{ marginBottom: 9 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, fontSize: 11.5 }}>{a.title}</span>
                      {a.year && <span style={{ fontSize: 10, color: "#999", fontFamily: "Arial, sans-serif" }}>{a.year}</span>}
                    </div>
                    {a.description && <div style={{ fontSize: 11, color: "#555", lineHeight: 1.65, fontFamily: "Arial, sans-serif" }}>{a.description}</div>}
                  </div>
                ) : null)}
              </ElegantSection>
            )}

            {strengthList.length > 0 && (
              <ElegantSection title="Strengths">
                <div style={{ fontFamily: "Arial, sans-serif" }}>
                  {strengthList.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <div style={{ width: 5, height: 5, background: "#d97706", transform: "rotate(45deg)", flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: "#333" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </ElegantSection>
            )}

            {languageList.length > 0 && (
              <ElegantSection title="Languages">
                <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.8, fontFamily: "Arial, sans-serif" }}>{languageList.join(" · ")}</div>
              </ElegantSection>
            )}

            {hobbyList.length > 0 && (
              <ElegantSection title="Interests">
                <div style={{ fontSize: 11.5, color: "#555", lineHeight: 1.8, fontStyle: "italic" }}>{hobbyList.join(", ")}</div>
              </ElegantSection>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
function ElegantSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1a1a2e" }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #d97706, transparent)" }} />
      </div>
      {children}
    </div>
  )
}

// ─── Template renderer map ────────────────────────────────────────────────────
const RENDERERS: Record<TemplateId, (p: { data: ResumeData }) => React.ReactElement> = {
  ats: AtsTemplate,
  modern: ModernTemplate, classic: ClassicTemplate, minimal: MinimalTemplate, sharp: SharpTemplate, elegant: ElegantTemplate,
  azurill: AzurillTemplate, ditgar: DitgarTemplate, pikachu: PikachuTemplate, porygon: PorygonTemplate,
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResumePage() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<CareerProfile | null>(null)
  const [store, setStore] = useState<ResumeStore | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const [zoom, setZoom] = useState(0.68)
  const [downloading, setDownloading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dirty = useRef(false)
  const [tab, setTab] = useState<"edit" | "ats">("edit")
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [openSections, setOpenSections] = useState<string[]>(["personal", "projects"])

  const zoomIn  = () => setZoom(z => Math.min(+(z + 0.1).toFixed(1), 1.2))
  const zoomOut = () => setZoom(z => Math.max(+(z - 0.1).toFixed(1), 0.3))

  // Career Profile first: on a student's first visit the backend copies their
  // old resume into it before the resume settings are read.
  const load = useCallback(async () => {
    setLoadError(false)
    try {
      const p = await fetchCareerProfile()
      const res = await api.get("/student/resume")
      const st = loadStore(res.data.resume_data)
      setProfile(p)
      setStore({ ...st, resumes: st.resumes.map((d) => pruneDoc(d, p)) })
    } catch {
      setLoadError(true)
    }
  }, [])
  useEffect(() => { load() }, [load])

  const doc = store?.resumes.find((d) => d.id === store.active_id) ?? null
  const updateDoc = useCallback((fn: (d: ResumeDoc) => ResumeDoc) => {
    dirty.current = true
    setStore((st) => st && ({ ...st, resumes: st.resumes.map((d) => (d.id === st.active_id ? fn(d) : d)) }))
  }, [])
  const updateProfile = useCallback((fn: (p: CareerProfile) => CareerProfile) => setProfile((p) => (p ? fn(p) : p)), [])

  // Debounced auto-save of the resume settings (the facts save themselves via the Career Profile API).
  useEffect(() => {
    if (!store || !dirty.current) return
    setSaveStatus("unsaved")
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSaveStatus("saving")
      try {
        await api.put("/student/resume", store)
        setSaveStatus("saved")
      } catch (err: any) {
        setSaveStatus("unsaved")
        toast.error(err?.response?.data?.error || "Couldn't save your resume")
      }
    }, 1200)
  }, [store])

  const account = useMemo(() => ({
    name: user?.name, email: user?.email, phone: user?.phone,
    linkedin: user?.linkedin, github: user?.github, avatar: user?.avatar,
  }), [user])
  const data: ResumeData | null = useMemo(
    () => (profile && doc ? buildResumeData(profile, account, doc) : null), [profile, doc, account])

  const downloadPDF = async () => {
    if (!doc || !data || downloading) return
    // ATS template: real-text PDF rendered by the backend, one click.
    if (layoutOf(doc.template) === "ats") {
      setDownloading(true)
      try { await downloadTextPdf(data) } catch { toast.error("Could not generate the PDF. Please try again.") }
      finally { setDownloading(false) }
      return
    }
    // Designed templates: the browser's own "Save as PDF" writes the same design as
    // REAL TEXT (selectable, ATS-readable). The old screenshot export produced an
    // image that ATS software reads as an empty page, so it is gone.
    if (document.fonts?.ready) await document.fonts.ready
    const previousTitle = document.title
    document.title = `${(data.personal.name || "Resume").replace(/[^A-Za-z0-9]+/g, "_")}_Resume`  // default file name
    const restore = () => { document.title = previousTitle; window.removeEventListener("afterprint", restore) }
    window.addEventListener("afterprint", restore)
    toast.info("In the print window, choose “Save as PDF” as the destination.", { duration: 6000 })
    window.print()
  }

  if (loadError) {
    return (
      <div className="text-center py-16">
        <p className="text-foreground font-medium">Couldn't load your resume.</p>
        <Button variant="outline" className="mt-4" onClick={load}>Try again</Button>
      </div>
    )
  }
  if (!profile || !doc || !data) {
    return (
      <div className="flex gap-4" style={{ height: "calc(100vh - 6rem)" }}>
        <Skeleton className="w-[390px] h-full rounded-xl" />
        <Skeleton className="flex-1 h-full rounded-xl" />
      </div>
    )
  }

  const template = doc.template
  const ActiveTemplate = RENDERERS[template] ?? AtsTemplate
  const layout = layoutOf(template)

  /** "Fix this" from the ATS check: switch template, or open + scroll to the editor section. */
  const onFix = (target: FixTarget) => {
    if (target.action === "template" && target.value) {
      updateDoc(d => ({ ...d, template: target.value as TemplateId }))
      toast.success("Switched to the ATS template")
      return
    }
    if (!target.section) return
    setTab("edit")
    setOpenSections(s => (s.includes(target.section!) ? s : [...s, target.section!]))
    setTimeout(() => document.getElementById(`resume-section-${target.section}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 120)
  }

  return (
    <>
      {/* ── Full-size print target (hidden on screen). Portalled into <body> so the
            print stylesheet can show it alone — see @media print in globals.css. ── */}
      {mounted && createPortal(
        <div id="resume-print-area" style={{ display: "none" }}>
          <ActiveTemplate data={data} />
        </div>,
        document.body,
      )}

      {/* ── Main UI (hidden during print via CSS) ── */}
      <div className="resume-editor flex flex-col" style={{ height: "calc(100vh - 4rem)", margin: "-1.5rem", marginTop: "-0.5rem" }}>

        {/* Top bar */}
        {/* Title and actions keep their size; only the template row scrolls when space runs out. */}
        <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-border bg-background flex-shrink-0 min-w-0">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold font-serif text-foreground whitespace-nowrap">Resume Builder</h1>
            <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
              {saveStatus === "saved"   && <><Cloud className="h-3 w-3 text-success" /><span className="text-xs text-success">Saved to cloud</span></>}
              {saveStatus === "saving"  && <><Cloud className="h-3 w-3 text-muted-foreground animate-pulse" /><span className="text-xs text-muted-foreground">Saving…</span></>}
              {saveStatus === "unsaved" && <><CloudOff className="h-3 w-3 text-warning" /><span className="text-xs text-warning">Unsaved changes</span></>}
              <span className="text-xs text-muted-foreground">·</span>
              <Link href="/career-profile" className="text-xs text-primary hover:underline">Edit Career Profile</Link>
            </div>
          </div>
          <div className="flex items-center gap-3 min-w-0">
            {/* Template switcher */}
            <div className="flex gap-1 overflow-x-auto min-w-0 pb-1" role="group" aria-label="Template">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => updateDoc(d => ({ ...d, template: t.id }))}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex-shrink-0 whitespace-nowrap",
                    template === t.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: t.accent }} />
                  {t.label}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive flex-shrink-0"
              title="Include everything again and drop this resume's edits. Your Career Profile is not changed."
              onClick={() => {
                if (!confirm("Reset this resume? Everything from your Career Profile is included again and resume-only edits are removed. Your Career Profile is not changed.")) return
                updateDoc(d => ({ ...newResume(d.id, d.name), template: d.template, show_photo: d.show_photo }))
                toast.success("Resume reset")
              }}
            >
              <RotateCcw className="h-4 w-4 mr-1.5" /> Reset
            </Button>
            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
              <Button
                size="sm"
                className="bg-primary hover:brightness-110 text-primary-foreground"
                onClick={downloadPDF}
                disabled={downloading}
              >
                {layout === "ats" ? <FileCheck2 className="h-4 w-4 mr-1.5" /> : <Printer className="h-4 w-4 mr-1.5" />}
                {downloading ? "Preparing…" : "Download PDF"}
              </Button>
              {layout === "ats" ? (
                <span className="text-[10px] text-success">ATS-safe text PDF</span>
              ) : layout === "single" ? (
                <span className="text-[10px] text-muted-foreground" title="Opens your browser's print window — choose “Save as PDF”">
                  Text PDF · choose “Save as PDF”
                </span>
              ) : (
                <button type="button" onClick={() => onFix({ action: "template", value: "ats" })}
                  title="Two-column layouts can be read out of order by some ATS software. Click to switch to the ATS template."
                  className="text-[10px] text-warning hover:underline inline-flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> 2-column · ATS template is safer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Split panel */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left: choose + override ── */}
          <div className="w-[390px] flex-shrink-0 overflow-y-auto border-r border-border p-4 space-y-2">
            <div className="flex gap-1 p-1 rounded-lg bg-secondary/60 mb-2" role="tablist" aria-label="Resume tools">
              {([["edit", "Edit", PencilLine], ["ats", "ATS check", Gauge]] as const).map(([id, label, Icon]) => (
                <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                  className={cn("flex-1 inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors",
                    tab === id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
            </div>
            {tab === "edit" ? (
              <ResumeEditor profile={profile} setProfile={updateProfile} doc={doc} updateDoc={updateDoc} account={account}
                openSections={openSections} onOpenSectionsChange={setOpenSections} />
            ) : (
              <AtsPanel data={data} template={template} profile={profile} setProfile={updateProfile}
                doc={doc} updateDoc={updateDoc} onFix={onFix} />
            )}
          </div>
          {/* ── Right: Live Preview ── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Zoom controls bar */}
            <div className="flex items-center justify-center gap-2 py-1.5 border-b border-border/40 bg-zinc-900/60 flex-shrink-0">
              <button
                onClick={zoomOut}
                disabled={zoom <= 0.3}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs text-zinc-400 tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={zoomIn}
                disabled={zoom >= 1.2}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoom(0.68)}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 hover:border-zinc-500 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Scrollable canvas */}
            <div className="flex-1 overflow-auto bg-zinc-800 flex items-start justify-center py-8 px-4">
              <div style={{ width: 794 * zoom, flexShrink: 0 }}>
                <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: 794 }}>
                  <ActiveTemplate data={data} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
