import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { LEGAL, SITE_PAGES } from "@/lib/legal"

interface LegalPageProps {
  title: string
  summary: string
  current: string
  children: React.ReactNode
}

// Shared shell for /privacy, /terms and /cookies. Server component — no client JS.
export function LegalPage({ title, summary, current, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label={`${LEGAL.product} home`}><Logo size={28} /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <nav aria-label="About and legal pages" className="flex flex-wrap gap-2 mb-8">
          {SITE_PAGES.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.href === current ? "page" : undefined}
              className={
                l.href === current
                  ? "chip chip-primary"
                  : "chip text-muted-foreground hover:text-foreground"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-3">{title}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Effective {LEGAL.effectiveDate} · Last updated {LEGAL.lastUpdated}
        </p>
        <p className="glass-card rounded-xl border border-border p-4 sm:p-5 text-sm leading-relaxed mb-10">
          {summary}
        </p>

        <article
          className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-foreground/90
            [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:font-serif [&_h2]:text-foreground [&_h2]:pt-6 [&_h2]:scroll-mt-20
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:pt-2
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5
            [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline
            [&_table]:w-full [&_table]:text-left [&_table]:text-sm [&_th]:font-semibold [&_th]:p-2.5 [&_td]:p-2.5 [&_td]:align-top
            [&_tr]:border-b [&_tr]:border-border [&_thead_tr]:bg-secondary"
        >
          {children}
        </article>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center text-xs text-muted-foreground">
        © 2026 {LEGAL.entity}. {LEGAL.product} is operated by {LEGAL.entity}, {LEGAL.address}.
      </footer>
    </div>
  )
}

/** Horizontally scrollable wrapper so wide tables never cause page-level scroll on phones. */
export function LegalTable({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-xl border border-border">{children}</div>
}

export function ContactBlock() {
  return (
    <div className="glass-card rounded-xl border border-border p-4 sm:p-5 not-prose">
      <p className="font-semibold text-foreground">{LEGAL.entity}</p>
      <p>{LEGAL.address}</p>
      <p>Privacy and data requests: <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a></p>
      <p>General support: <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a></p>
    </div>
  )
}
