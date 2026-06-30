"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Award, BadgeCheck, GraduationCap, Download, ShieldCheck, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/api"

interface Certificate {
  certificate_uid: string
  kind: "course" | "domain"
  title: string
  recipient_name: string
  issuer: string
  issued_at: string | null
  pdf_url: string | null
  revoked: boolean
}

function fmtDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    api
      .get("/student/certificates")
      .then((res) => setCerts(res.data))
      .catch(() => toast.error("Failed to load certificates"))
      .finally(() => setLoading(false))
  }, [])

  async function download(cert: Certificate) {
    setDownloading(cert.certificate_uid)
    try {
      const res = await api.get(`/student/certificates/${cert.certificate_uid}/download`, {
        responseType: "blob",
      })
      const url = URL.createObjectURL(res.data as Blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Fynity_Certificate_${cert.title.replace(/\s+/g, "_")}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast.error("Download failed — please try again")
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <Award className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">My Certificates</h1>
          <p className="text-sm text-muted-foreground">
            Official certificates issued by Fynity for completed courses and domains.
          </p>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <GlassCard className="py-16 text-center">
          <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="font-medium text-foreground">No certificates yet</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Complete 100% of a course or a full domain program to earn your first Fynity certificate.
            It'll be emailed to you and appear here automatically.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.certificate_uid}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard
                className={cn(
                  "p-5 h-full flex flex-col gap-4 border-l-4",
                  cert.kind === "domain" ? "border-l-coding" : "border-l-success",
                  cert.revoked && "opacity-60"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      cert.kind === "domain" ? "bg-coding/10" : "bg-success/10"
                    )}
                  >
                    {cert.kind === "domain" ? (
                      <GraduationCap className="h-5 w-5 text-coding" />
                    ) : (
                      <BadgeCheck className="h-5 w-5 text-success" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {cert.kind === "domain" ? "Domain Program" : "Course"}
                    </p>
                    <p className="font-semibold text-foreground leading-tight">{cert.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Issued {fmtDate(cert.issued_at)} by {cert.issuer}
                    </p>
                  </div>
                  {cert.revoked && (
                    <span className="chip chip-danger flex-shrink-0">Revoked</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <Button
                    size="sm"
                    onClick={() => download(cert)}
                    disabled={cert.revoked || downloading === cert.certificate_uid}
                    className="gap-1.5"
                  >
                    <Download className="h-4 w-4" />
                    {downloading === cert.certificate_uid ? "Preparing…" : "Download"}
                  </Button>
                  <a
                    href={`/verify/${cert.certificate_uid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4" /> Verify <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
