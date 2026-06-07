import { toast } from "sonner"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DriveReport {
  id: number
  drive_code?: string | null
  company_name: string
  job_role: string
  industry_type: string
  ctc: number | null
  job_location: string | null
  drive_date: string
  registration_deadline: string
  venue_or_link?: string | null
  rounds: string[]
  min_cgpa: number | null
  max_backlogs: number | null
  eligible_branches: string[] | null
  required_skills: string | null
  description: string | null
  hr_name?: string | null
  hr_email?: string | null
  hr_phone?: string | null
  is_active: boolean
  registered_count: number
}

export interface EligibleStudentReport {
  id: number
  name: string
  email: string
  roll_number: string | null
  branch: string | null
  section: string | null
  cgpa: number | null
  active_backlogs: number | null
  placement_status: string
  registration_status: string | null
}

// ─── Shared helpers ─────────────────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function fmtDateTime(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

function safe(s: string): string {
  return s.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "")
}

function esc(s: any): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

// ─── CSV ────────────────────────────────────────────────────────────────────────

function csvCell(v: any): string {
  const s = v === null || v === undefined ? "" : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function downloadCSV(filename: string, rows: (string | number | null)[][]) {
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n")
  // Prepend BOM so Excel reads UTF-8 correctly
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportDriveCSV(drive: DriveReport) {
  const rows: (string | number | null)[][] = [
    ["Field", "Value"],
    ["Drive ID / Code", drive.drive_code || "—"],
    ["Company", drive.company_name],
    ["Job Role", drive.job_role],
    ["Industry", drive.industry_type],
    ["CTC (LPA)", drive.ctc ?? "Not disclosed"],
    ["Location", drive.job_location || "TBD"],
    ["Drive Date", fmtDateTime(drive.drive_date)],
    ["Registration Deadline", fmtDateTime(drive.registration_deadline)],
    ["Venue / Link", drive.venue_or_link || "—"],
    ["Min CGPA", drive.min_cgpa ?? "No minimum"],
    ["Max Active Backlogs", drive.max_backlogs ?? "No limit"],
    ["Eligible Branches", drive.eligible_branches ? drive.eligible_branches.join(" / ") : "All branches"],
    ["Interview Rounds", drive.rounds?.length ? drive.rounds.join(" → ") : "—"],
    ["Required Skills", drive.required_skills || "—"],
    ["HR Contact Name", drive.hr_name || "—"],
    ["HR Email", drive.hr_email || "—"],
    ["HR Phone", drive.hr_phone || "—"],
    ["Status", drive.is_active ? "Active" : "Inactive"],
    ["Registered Count", drive.registered_count],
    ["Description", drive.description || "—"],
  ]
  downloadCSV(`Drive_${safe(drive.company_name)}_${safe(drive.job_role)}`, rows)
}

export function exportEligibleCSV(drive: DriveReport, students: EligibleStudentReport[]) {
  const rows: (string | number | null)[][] = [
    ["Name", "Email", "Roll No", "Branch", "Section", "CGPA", "Active Backlogs", "Placement Status", "Drive Status"],
    ...students.map((s) => [
      s.name,
      s.email,
      s.roll_number || "",
      s.branch || "",
      s.section || "",
      s.cgpa ?? "",
      s.active_backlogs ?? 0,
      (s.placement_status || "").replace("_", " "),
      s.registration_status || "Not registered",
    ]),
  ]
  downloadCSV(`Eligible_${safe(drive.company_name)}_${safe(drive.job_role)}`, rows)
}

// ─── PDF (print window) ─────────────────────────────────────────────────────────

const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; background: #fff; font-size: 13px; }
  @page { margin: 16mm 14mm; size: A4; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  .page { max-width: 820px; margin: 0 auto; padding: 24px; }
  h2 { font-size: 15px; font-weight: 700; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e5e7eb; color: #111827; }
  section { margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { text-align: left; padding: 8px; background: #f9fafb; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
  td { padding: 7px 8px; border-bottom: 1px solid #f3f4f6; }
  .kv td:first-child { width: 38%; color: #6b7280; font-weight: 500; }
  .kv td:last-child { color: #111827; font-weight: 500; }
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 18px; }
  .stat-box { padding: 14px; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center; }
  .stat-val { font-size: 24px; font-weight: 700; color: #111827; }
  .stat-lbl { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .header-bar { background: #18181b; color: #fff; padding: 20px 24px; border-radius: 10px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
  .header-name { font-size: 22px; font-weight: 700; }
  .header-meta { font-size: 12px; color: #9ca3af; margin-top: 4px; line-height: 1.7; }
  .header-right { text-align: right; font-size: 11px; color: #9ca3af; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; margin: 2px; background: #0E707020; color: #0E7070; border: 1px solid #0E707040; }
  .chip-s { display:inline-block; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600; }
  .footer { text-align: center; font-size: 10px; color: #9ca3af; padding-top: 16px; border-top: 1px solid #f3f4f6; margin-top: 24px; }
`

async function htmlToPdf(filename: string, inner: string) {
  const toastId = toast.loading("Generating PDF…")

  // Offscreen container — explicit hex color/background so html2canvas never
  // inherits CSS-variable tokens from the app's global stylesheet.
  const container = document.createElement("div")
  Object.assign(container.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: "820px",
    background: "#ffffff",
    color: "#111827",
  })
  container.innerHTML =
    `<style>${BASE_CSS}</style><div class="page">${inner}` +
    `<div class="footer">CareerEzi · Placement Cell · Generated ${fmtDate(new Date().toISOString())} · Developed by Finity Innovations</div></div>`
  document.body.appendChild(container)

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      windowWidth: 820,
    })

    const pdf = new jsPDF({ unit: "pt", format: "a4" })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const imgW = pageW
    const imgH = (canvas.height * imgW) / canvas.width
    const imgData = canvas.toDataURL("image/jpeg", 0.92)

    let heightLeft = imgH
    let position = 0
    pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH)
    heightLeft -= pageH
    while (heightLeft > 0) {
      position -= pageH
      pdf.addPage()
      pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH)
      heightLeft -= pageH
    }

    pdf.save(`${filename}.pdf`)
    toast.success("PDF downloaded", { id: toastId })
  } catch (e) {
    console.error(e)
    toast.error("Failed to generate PDF", { id: toastId })
  } finally {
    document.body.removeChild(container)
  }
}

export async function generateDrivePDF(drive: DriveReport) {
  const generatedOn = fmtDate(new Date().toISOString())
  const kv = (label: string, value: string) =>
    `<tr><td>${esc(label)}</td><td>${esc(value)}</td></tr>`

  const inner = `
    <div class="header-bar">
      <div>
        <div class="header-name">${esc(drive.company_name)}</div>
        <div class="header-meta">
          ${esc(drive.job_role)} &nbsp;·&nbsp; ${esc(drive.industry_type)}
          ${drive.ctc ? ` &nbsp;·&nbsp; ₹${drive.ctc} LPA` : ""}
          <br/>${drive.is_active ? "Active drive" : "Inactive drive"} &nbsp;·&nbsp; ${drive.registered_count} registered
        </div>
      </div>
      <div class="header-right">
        Drive Details Report<br/>Generated on ${generatedOn}
      </div>
    </div>

    <section>
      <h2>Drive Information</h2>
      <table class="kv"><tbody>
        ${drive.drive_code ? kv("Drive ID / Code", drive.drive_code) : ""}
        ${kv("Company", drive.company_name)}
        ${kv("Job Role", drive.job_role)}
        ${kv("Industry", drive.industry_type)}
        ${kv("CTC", drive.ctc ? `₹${drive.ctc} LPA` : "Not disclosed")}
        ${kv("Location", drive.job_location || "TBD")}
        ${kv("Drive Date", fmtDateTime(drive.drive_date))}
        ${kv("Registration Deadline", fmtDateTime(drive.registration_deadline))}
        ${drive.venue_or_link ? kv("Venue / Link", drive.venue_or_link) : ""}
        ${kv("Status", drive.is_active ? "Active" : "Inactive")}
        ${kv("Registered Count", String(drive.registered_count))}
      </tbody></table>
    </section>

    <section>
      <h2>Eligibility Criteria</h2>
      <table class="kv"><tbody>
        ${kv("Minimum CGPA", drive.min_cgpa != null ? String(drive.min_cgpa) : "No minimum")}
        ${kv("Max Active Backlogs", drive.max_backlogs != null ? String(drive.max_backlogs) : "No limit")}
        ${kv("Eligible Branches", drive.eligible_branches ? drive.eligible_branches.join(", ") : "All branches")}
        ${drive.required_skills ? kv("Required Skills", drive.required_skills) : ""}
      </tbody></table>
    </section>

    ${drive.rounds?.length ? `
    <section>
      <h2>Interview Rounds</h2>
      <div>${drive.rounds.map((r, i) => `<span class="badge">${i + 1}. ${esc(r)}</span>`).join(" ")}</div>
    </section>` : ""}

    ${(drive.hr_name || drive.hr_email || drive.hr_phone) ? `
    <section>
      <h2>HR / Recruiter Contact</h2>
      <table class="kv"><tbody>
        ${drive.hr_name ? kv("Name", drive.hr_name) : ""}
        ${drive.hr_email ? kv("Email", drive.hr_email) : ""}
        ${drive.hr_phone ? kv("Phone", drive.hr_phone) : ""}
      </tbody></table>
    </section>` : ""}

    ${drive.description ? `
    <section>
      <h2>Description</h2>
      <p style="font-size:12px;color:#374151;line-height:1.6">${esc(drive.description)}</p>
    </section>` : ""}
  `
  await htmlToPdf(`Drive_${safe(drive.company_name)}_${safe(drive.job_role)}`, inner)
}

export async function generateEligiblePDF(drive: DriveReport, students: EligibleStudentReport[]) {
  const generatedOn = fmtDate(new Date().toISOString())

  const registered = students.filter((s) => s.registration_status).length
  const shortlisted = students.filter((s) => s.registration_status === "shortlisted").length
  const selected = students.filter((s) => s.registration_status === "selected").length

  const statusColor: Record<string, string> = {
    registered: "#3B82F6", shortlisted: "#F59E0B", selected: "#10B981", rejected: "#EF4444",
  }

  const rows = students.map((s, i) => `
    <tr>
      <td style="background:${i % 2 ? "#fafafa" : "#fff"}">
        <div style="font-weight:600">${esc(s.name)}</div>
        <div style="font-size:11px;color:#6b7280">${esc(s.email)}</div>
      </td>
      <td style="background:${i % 2 ? "#fafafa" : "#fff"}">${esc(s.roll_number || "—")}</td>
      <td style="background:${i % 2 ? "#fafafa" : "#fff"}">${esc(s.branch || "—")}${s.section ? " / " + esc(s.section) : ""}</td>
      <td style="background:${i % 2 ? "#fafafa" : "#fff"};text-align:center">${s.cgpa ?? "—"}</td>
      <td style="background:${i % 2 ? "#fafafa" : "#fff"};text-align:center">${s.active_backlogs ?? 0}</td>
      <td style="background:${i % 2 ? "#fafafa" : "#fff"}">${esc((s.placement_status || "").replace("_", " "))}</td>
      <td style="background:${i % 2 ? "#fafafa" : "#fff"}">
        ${s.registration_status
          ? `<span class="chip-s" style="background:${statusColor[s.registration_status] || "#6b7280"}20;color:${statusColor[s.registration_status] || "#6b7280"}">${esc(s.registration_status)}</span>`
          : `<span style="color:#9ca3af;font-size:11px">Not registered</span>`}
      </td>
    </tr>`).join("")

  const inner = `
    <div class="header-bar">
      <div>
        <div class="header-name">${esc(drive.company_name)}</div>
        <div class="header-meta">${esc(drive.job_role)} &nbsp;·&nbsp; ${esc(drive.industry_type)}${drive.ctc ? ` &nbsp;·&nbsp; ₹${drive.ctc} LPA` : ""}</div>
      </div>
      <div class="header-right">Eligible Students Report<br/>Generated on ${generatedOn}</div>
    </div>

    <section>
      <div class="stat-grid">
        <div class="stat-box"><div class="stat-val">${students.length}</div><div class="stat-lbl">Eligible</div></div>
        <div class="stat-box"><div class="stat-val" style="color:#3B82F6">${registered}</div><div class="stat-lbl">Registered</div></div>
        <div class="stat-box"><div class="stat-val" style="color:#F59E0B">${shortlisted}</div><div class="stat-lbl">Shortlisted</div></div>
        <div class="stat-box"><div class="stat-val" style="color:#10B981">${selected}</div><div class="stat-lbl">Selected</div></div>
      </div>
    </section>

    <section>
      <h2>Eligible Students (${students.length})</h2>
      ${students.length === 0
        ? `<p style="color:#6b7280;font-size:12px">No eligible students for this drive's criteria.</p>`
        : `<table>
            <thead><tr>
              <th>Student</th><th>Roll No</th><th>Branch</th>
              <th style="text-align:center">CGPA</th><th style="text-align:center">Backlogs</th>
              <th>Placement</th><th>Drive Status</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>`}
    </section>
  `
  await htmlToPdf(`Eligible_${safe(drive.company_name)}_${safe(drive.job_role)}`, inner)
}
