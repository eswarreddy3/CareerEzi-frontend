import type { Metadata } from "next"
import Link from "next/link"
import { BadgeCheck, ShieldX, ShieldCheck, GraduationCap, CalendarDays, FileText } from "lucide-react"
import { API } from "@/lib/public-profile"

export const dynamic = "force-dynamic"

interface VerifyResult {
  valid: boolean
  revoked?: boolean
  certificate_uid?: string
  recipient_name?: string
  kind?: "course" | "domain"
  title?: string
  issuer?: string
  issued_at?: string | null
  error?: string
}

const ORIGIN = API.replace(/\/api$/, "")

async function verify(uid: string): Promise<VerifyResult | null> {
  try {
    const res = await fetch(`${API}/public/verify/${encodeURIComponent(uid)}`, { cache: "no-store" })
    if (res.status === 404) return { valid: false, error: "not_found" }
    if (!res.ok) return null
    return (await res.json()) as VerifyResult
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ uid: string }> }
): Promise<Metadata> {
  const { uid } = await params
  const r = await verify(uid)
  if (!r?.valid) return { title: "Certificate verification · CareerEzi" }
  return {
    title: `${r.title} — ${r.recipient_name} · Verified by ${r.issuer}`,
    description: `${r.recipient_name} completed ${r.title} on CareerEzi. Certificate verified and issued by ${r.issuer}.`,
  }
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
  } catch {
    return "—"
  }
}

export default async function VerifyPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params
  const r = await verify(uid)

  const ok = !!r?.valid
  const notFound = r?.error === "not_found"

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Status banner */}
          <div
            className={
              "px-6 py-5 flex items-center gap-3 " +
              (ok ? "bg-success/10 border-b border-success/20" : "bg-danger/10 border-b border-danger/20")
            }
          >
            {ok ? (
              <ShieldCheck className="h-7 w-7 text-success flex-shrink-0" />
            ) : (
              <ShieldX className="h-7 w-7 text-danger flex-shrink-0" />
            )}
            <div>
              <p className={"font-semibold font-serif " + (ok ? "text-success" : "text-danger")}>
                {ok ? "Certificate Verified" : r?.revoked ? "Certificate Revoked" : "Certificate Not Found"}
              </p>
              <p className="text-xs text-muted-foreground">
                {ok
                  ? `Authentic credential issued by ${r?.issuer}`
                  : notFound
                  ? "No certificate matches this ID."
                  : "This certificate is no longer valid."}
              </p>
            </div>
          </div>

          {ok && r ? (
            <div className="p-6 space-y-5">
              <div className="text-center space-y-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">This certifies that</p>
                <h1 className="text-2xl font-bold font-serif text-foreground">{r.recipient_name}</h1>
                <p className="text-xs uppercase tracking-wider text-muted-foreground pt-2">
                  has successfully completed the {r.kind === "domain" ? "domain program" : "course"}
                </p>
                <p className="text-lg font-semibold text-primary inline-flex items-center gap-2 justify-center">
                  {r.kind === "domain" ? <GraduationCap className="h-5 w-5" /> : <BadgeCheck className="h-5 w-5" />}
                  {r.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field icon={CalendarDays} label="Issued" value={fmtDate(r.issued_at)} />
                <Field icon={BadgeCheck} label="Issuer" value={r.issuer || "—"} />
              </div>

              <div className="rounded-lg bg-secondary/40 border border-border px-3 py-2">
                <p className="text-[11px] text-muted-foreground">Certificate ID</p>
                <p className="text-xs font-mono break-all text-foreground">{r.certificate_uid}</p>
              </div>

              <a
                href={`${ORIGIN}/static/uploads/certificates/${r.certificate_uid}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                <FileText className="h-4 w-4" /> View Certificate PDF
              </a>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <p className="font-mono break-all text-xs">{uid}</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          <Link href="https://www.careerezi.com" className="hover:text-primary transition-colors">
            Powered by <span className="font-semibold gradient-text">CareerEzi</span>
          </Link>
        </p>
      </div>
    </main>
  )
}

function Field({ icon: Icon, label, value }: { icon: typeof BadgeCheck; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/40 border border-border px-3 py-2 flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground leading-none">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  )
}
